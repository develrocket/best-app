import fs from 'fs';
import low from 'lowdb';
import storage from 'lowdb/lib/file-sync';
import uuid from 'node-uuid';

const sqlite3 = require('electron').remote.require('sqlite3');

const dbFile = 'database/best.db';

function dbExists() {
    try {
        return fs.statSync(dbFile).isFile();
    }
    catch (err) {
        return false;
    }
}

// Create new database if file does not exist
function dbCreate(db) {
    // Create projects
    // CURRENT_TIMESTAMP
    db.run(`
    CREATE TABLE projects(
      keyProject TEXT NOT NULL UNIQUE,
      projectName TEXT NOT NULL,
      client TEXT DEFAULT '',
      contractor TEXT DEFAULT '',
      projectDesignation TEXT DEFAULT '',
      weldProcedure TEXT DEFAULT '',
      upperPipeDiameter REAL DEFAULT 0,
      lowerPipeDiameter REAL DEFAULT 0,
      nominalPipeDiameter REAL DEFAULT 0,
      nominalRadius REAL DEFAULT 0,
      upperRadius REAL DEFAULT 0,
      lowerRadius REAL DEFAULT 0,
      nominalRadiusExtension REAL DEFAULT 0,
      upperRadiusExtension REAL DEFAULT 0,
      lowerRadiusExtension REAL DEFAULT 0,
      nominalLandThickness REAL DEFAULT 0,
      upperLandThickness REAL DEFAULT 0,
      lowerLandThickness REAL DEFAULT 0,
      nominalBevelAngle REAL DEFAULT 0,
      upperBevelAngle REAL DEFAULT 0,
      lowerBevelAngle REAL DEFAULT 0,
      nominalHalfBevelGap REAL DEFAULT 0,
      upperHalfBevelGap REAL DEFAULT 0,
      lowerHalfBevelGap REAL DEFAULT 0,
      nominalWallThickness REAL DEFAULT 0,
      upperWallThickness REAL DEFAULT 0,
      lowerWallThickness REAL DEFAULT 0,
      nominalInternalPipeDiameter REAL DEFAULT 0,
      upperInternalPipeDiameter REAL DEFAULT 0,
      lowerInternalPipeDiameter REAL DEFAULT 0,
      nominalOutsidePipeDiameter REAL DEFAULT 0,
      upperOutsidePipeDiameter REAL DEFAULT 0,
      lowerOutsidePipeDiameter REAL DEFAULT 0,
      upperTolerance REAL DEFAULT 0,
      lowerTolerance REAL DEFAULT 0,
      nominalTolerance REAL DEFAULT 0,
      fieldUnits TEXT DEFAULT '{}',
      pipeOptions TEXT DEFAULT '{}',
      dateCreated TEXT,
      deleted BOOLEAN DEFAULT 0,
      PRIMARY KEY(keyProject)
    );`
    );

    // Create scan end A
    db.run(`
    CREATE TABLE scansA(
      keyScan TEXT NOT NULL UNIQUE,
      radius TEXT DEFAULT '[]',
      bevelAngle TEXT DEFAULT '[]',
      landThickness TEXT DEFAULT '[]',
      halfBevelGap TEXT DEFAULT '[]',
      wallThickness TEXT DEFAULT '[]',
      dateCreated TEXT,
      deleted BOOLEAN DEFAULT 0,
      saved BOOLEAN DEFAULT 0,
      PRIMARY KEY(keyScan)
    );`
    );

    // Create scan end B
    db.run(`
    CREATE TABLE scansB(
      keyScan TEXT NOT NULL UNIQUE,
      radius TEXT DEFAULT '[]',
      bevelAngle TEXT DEFAULT '[]',
      landThickness TEXT DEFAULT '[]',
      halfBevelGap TEXT DEFAULT '[]',
      wallThickness TEXT DEFAULT '[]',
      dateCreated TEXT,
      deleted BOOLEAN DEFAULT 0,
      saved BOOLEAN DEFAULT 0,
      PRIMARY KEY(keyScan)
    );`
    );

    // Create pipes
    db.run(`
    CREATE TABLE pipes(
      keyPipe TEXT NOT NULL UNIQUE,
      keyScanA TEXT,
      keyScanB TEXT,
      keyProject TEXT,
      pipeNumber TEXT DEFAULT '',
      heatNumber TEXT DEFAULT '',
      dateCreated TEXT,
      deleted BOOLEAN DEFAULT 0,
      PRIMARY KEY(keyPipe)
    );`
    );
}

function dbOpen() {
    const exists = dbExists();
    const db = new sqlite3.Database(dbFile); // Will auto create

    if (!exists) {
        // console.log('Creating new database');
        dbCreate(db);
    }

    return db;
}

// function dbSaveProjectPipe(projectKey, key) {
//   const dbProject = low('database/projects/'+projectKey, { storage });
//   dbProject('pipes').push(key);
// }

// This is probably not needed but keeps a snapshot of project settings and pipe
// function dbSavePipe(key, obj, projectFields, projectKey) {
//   const dbPipe = low('database/pipes/'+key, { storage });
//   dbPipe.object = { ...obj, projectFields, projectKey };
//   dbPipe.write();
// }

export function dbPipeSave(projectKey,
                           pipeNumber,
                           heatNumber,
                           scanAKey,
                           scanBKey) {
    const keyPipe = uuid();
    // const created = new Date();
    const db = dbOpen();
    const sql = `
    INSERT INTO pipes(
      keyPipe,
      keyScanA,
      keyScanB,
      keyProject,
      pipeNumber,
      heatNumber
    ) VALUES (
      $keyPipe,
      $scanAKey,
      $scanBKey,
      $projectKey,
      $pipeNumber,
      $heatNumber
    );
  `;

    db.run(sql, {
        $keyPipe: keyPipe,
        $scanAKey: scanAKey,
        $scanBKey: scanBKey,
        $projectKey: projectKey,
        $pipeNumber: pipeNumber,
        $heatNumber: heatNumber,
    });
    db.close();

    return keyPipe;
}

export function dbScanFlag(scanKey, end) {
    const db = dbOpen();
    const sql = `
    UPDATE scans${end.toUpperCase()}
    SET saved=1
    WHERE keyScan=$scanKey;
  `;

    db.run(sql, {$scanKey: scanKey});
    db.close();
}

function dbLookpupPipe(pipeKey) {
    const dbPipe = low('database/pipes/' + pipeKey, {storage});

    if (!dbPipe.object.deleted) {
        return ({
            created: dbPipe.object.created,
            pipeNumber: dbPipe.object.pipeNumber,
            heatNumber: dbPipe.object.heatNumber,
        });
    }

    return null;
}

export function dbLoadPipeList(projectKey, callback) {
    const db = dbOpen();
    const sql = `
    SELECT
      keyPipe,
      pipeNumber,
      heatNumber,
      dateCreated
    FROM pipes
    WHERE keyProject=$projectKey AND deleted=0;
  `;

    db.all(sql, {$projectKey: projectKey}, (err, rows) => {
        if (rows) {
            callback(rows);
        }
    });

    db.close();
}

export function dbScanLookup(scanKey, end, callback) {
    const db = dbOpen();
    const sql = `
    SELECT
      radius,
      bevelAngle,
      landThickness,
      halfBevelGap,
      wallThickness
    FROM scans${end.toUpperCase()}
    WHERE keyScan=$scanKey;
  `;

    db.get(sql, {$scanKey: scanKey}, (err, row) => {
        if (row) {
            // TODO can probably use Object.keys
            const {
                radius,
                bevelAngle,
                landThickness,
                halfBevelGap,
                wallThickness,
            } = row;

            const retRow = {
                radius: JSON.parse(radius),
                bevelAngle: JSON.parse(bevelAngle),
                landThickness: JSON.parse(landThickness),
                halfBevelGap: JSON.parse(halfBevelGap),
                wallThickness: JSON.parse(wallThickness),
            };

            callback(retRow);
        }
    });
    db.close();
}

export function dbPipeLookup(pipeKey, callback) {
    const db = dbOpen();
    const sql = `
    SELECT
      keyScanA,
      keyScanB,
      pipeNumber,
      heatNumber,
      dateCreated
    FROM pipes
    WHERE keyPipe=$pipeKey;
  `;

    db.get(sql, {$pipeKey: pipeKey}, (err, row) => {
        if (row) {
            callback(row);
        }
    });
    db.close();
}

function dbPipeDelete(pipeKey) {
    const dbPipe = low('database/pipes/' + pipeKey, {storage});

    dbPipe.object.deleted = true;
    dbPipe.write();
}

export function dbProjectsLoad(callback) {
    const db = dbOpen();
    const sql = `
    SELECT keyProject, projectName FROM projects WHERE deleted=0;
  `;

    db.all(sql, (err, rows) => {
        if (rows) {
            callback(rows);
        }
    });

    db.close();
}

export function dbProjectUpdateFields(projectKey, keyName, value, type) {
    const db = dbOpen();
    keyName = type + keyName;
    const sql = `
        UPDATE projects
        SET
          ${keyName}=$value
        WHERE
          keyProject=$projectKey;
      `;

    db.run(sql, {$value: value, $projectKey: projectKey});
    db.close();
}

export function dbProjectUpdateFieldsUnits(projectKey, value) {
    const db = dbOpen();
    const sql = `
    UPDATE
      projects
    SET
      fieldUnits=$fieldUnits
    WHERE keyProject=$projectKey;
  `;

    db.run(sql, {
        $fieldUnits: JSON.stringify(value),
        $projectKey: projectKey,
    });
    db.close();
}

export function dbProjectLoadUnits(projectKey, callback) {
    const db = dbOpen();
    const sql = `
  SELECT
    fieldUnits
  FROM projects
  WHERE keyProject=$projectKey;
  `;

    db.get(sql, {$projectKey: projectKey}, (err, row) => {
        if (row) {
            callback(JSON.parse(row.fieldUnits));
        }
    });
    db.close();
}

export function dbProjectCreate(projectName) {
    const keyProject = uuid();
    const db = dbOpen();
    const sql = `
    INSERT INTO projects(
      keyProject,
      projectName
    ) VALUES (
      $keyProject,
      $projectName
    );
  `;

    db.run(sql, {
        $keyProject: keyProject,
        $projectName: projectName,
    });
    db.close();

    return keyProject;
}

export function dbProjectUpdatePipeOptions(projectKey, options) {
    const db = dbOpen();
    const sql = `
    UPDATE projects
    SET pipeOptions=$pipeOptions
    WHERE keyProject=$projectKey
  `;

    db.run(sql, {
        $pipeOptions: JSON.stringify(options),
        $projectKey: projectKey,
    });
    db.close();
}

export function dbProjectLoadPipeOptions(projectKey, callback) {
    const db = dbOpen();
    const sql = `
    SELECT pipeOptions
    FROM projects WHERE keyProject=$projectKey;
  `;

    db.get(sql, {$projectKey: projectKey}, (err, row) => {
        if (row) {
            callback(JSON.parse(row.pipeOptions));
        }
    });
    db.close();
}

export function dbProjectUpdateName(projectKey, value) {
    const db = dbOpen();
    const sql = `
    UPDATE projects
    SET projectName=$projectName
    WHERE keyProject=$projectKey
  `;

    db.run(sql, {
        $projectName: value,
        $projectKey: projectKey,
    });
    db.close();
}

export function dbProjectGetFields(projectKey, callback) {
    const db = dbOpen();
    const sql = `
    SELECT
      projectName,
      client,
      contractor,
      projectDesignation,
      weldProcedure,
      nominalPipeDiameter,
      nominalRadius,
      nominalRadiusExtension,
      nominalLandThickness,
      nominalBevelAngle,
      nominalHalfBevelGap,
      nominalWallThickness,
      nominalInternalPipeDiameter,
      nominalOutsidePipeDiameter,
      upperPipeDiameter,
      upperRadius,
      upperRadiusExtension,
      upperLandThickness,
      upperBevelAngle,
      upperHalfBevelGap,
      upperWallThickness,
      upperInternalPipeDiameter,
      upperOutsidePipeDiameter,
      lowerPipeDiameter,
      lowerRadius,
      lowerRadiusExtension,
      lowerLandThickness,
      lowerBevelAngle,
      lowerHalfBevelGap,
      lowerWallThickness,
      lowerInternalPipeDiameter,
      lowerOutsidePipeDiameter,
      upperTolerance,
      lowerTolerance,
      nominalTolerance
    FROM projects
    WHERE keyProject=$projectKey;
  `;

    // console.log('db-get projectKey:', projectKey);
    db.get(sql, {$projectKey: projectKey}, (err, row) => {
        // console.log(err);
        // console.log(row);
        callback(row);
    });

    db.close();
}

export function dbProjectDelete(projectKey) {
    const db = dbOpen();
    const sql = `
    UPDATE projects
    SET deleted=1
    WHERE keyProject=$projectKey;
  `;

    db.run(sql, {$projectKey: projectKey});
    db.close();
}

export function dbScanCheck(keyScan, end, callback) {
    const db = dbOpen();
    const sql = `
    SELECT keyScan
    FROM scans${end.toUpperCase()}
    WHERE keyScan=$keyScan
  `;

    db.get(sql, {$keyScan: keyScan}, (err, row) => {
        if (row) {
            callback(true);
        } else {
            callback(false);
        }
    });
    db.close();
}

export function dbScanCreate(keyScan, data, end) {
    const db = dbOpen();
    const {
        radius,
        bevelAngle,
        landThickness,
        halfBevelGap,
        wallThickness,
        date,
    } = data;

    const sql = `
    INSERT INTO scans${end.toUpperCase()}(
      keyScan,
      radius,
      bevelAngle,
      landThickness,
      halfBevelGap,
      wallThickness,
      dateCreated
    ) VALUES (
      $keyScan,
      $radius,
      $bevelAngle,
      $landThickness,
      $halfBevelGap,
      $wallThickness,
      $dateCreated
    );
  `;

    // console.log()

    db.run(sql, {
        $keyScan: keyScan,
        $radius: JSON.stringify(radius),
        $bevelAngle: JSON.stringify(bevelAngle),
        $landThickness: JSON.stringify(landThickness),
        $halfBevelGap: JSON.stringify(halfBevelGap),
        $wallThickness: JSON.stringify(wallThickness),
        $dateCreated: date,
    });
    db.close();
}

export function dbScansLoadList(end, callback) {
    const db = dbOpen();
    const sql = `
    SELECT
      keyScan,
      radius,
      bevelAngle,
      landThickness,
      halfBevelGap,
      wallThickness,
      dateCreated
    FROM scans${end.toUpperCase()} WHERE saved=0 AND deleted=0;
  `;

    db.all(sql, (err, rows) => {
        if (rows) {
            callback(rows);
        }
    });

    db.close();
}
