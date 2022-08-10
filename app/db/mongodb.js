/**
 * Created by Administrator on 11/10/2016.
 */


import uuid from 'node-uuid';

var SERVER_URL = 'http://localhost:3000';
var PIPE_SAVE_URL = '/api/pipe/save';
var PIPE_LIST_BY_PROJECT_URL = '/api/pipe/list/project';
var PIPE_LIST_BY_PIPE_URL = '/api/pipe/list/pipe';
var SCANSA_UPDATE_SAVE_URL = '/api/scansA/updateSave';
var SCANSA_LIST_URL = '/api/scansA/list';
var SCANSA_LOAD_KEYSCAN_URL = '/api/scansA/load/keyScan';
var SCANSA_ADD_URL = '/api/scansA/add';
var SCANSA_LOAD_LIST_URL = '/api/scansA/load/list';
var SCANSB_UPDATE_SAVE_URL = '/api/scansB/updateSave';
var SCANSB_LIST_URL = '/api/scansB/list';
var SCANSB_LOAD_KEYSCAN_URL = '/api/scansB/load/keyScan';
var SCANSB_ADD_URL = '/api/scansB/add';
var SCANSB_LOAD_LIST_URL = '/api/scansB/load/list';
var PROJECTS_LIST_URL = '/api/projects/list';
var PROJECTS_UPDATE_FIELD_URL = '/api/projects/update/field';
var PROJECTS_UPDATE_UNIT_URL = '/api/projects/update/unit';
var PROJECTS_LOAD_UNIT_URL = '/api/projects/load/unit';
var PROJECTS_ADD_URL = '/api/projects/add';
var PROJECTS_UPDATE_PIPE_OPTIONS_URL = '/api/projects/update/options';
var PROJECTS_LOAD_PIPE_OPTIONS_URL = '/api/projects/load/options';
var PROJECTS_UPDATE_NAME_URL = '/api/projects/update/name';
var PROJECTS_LOAD_FILEDS_URL = '/api/projects/load/fields';
var PROJECTS_DELETE_URL = '/api/projects/delete';
var MANUAL_FIELDS_SAVE_URL = "/api/manualFields/add";
var MANUAL_FIELDS_LOAD_URL = "/api/manualFields/list/pipe";
var $ = require('jquery');

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

function dbPipeDelete(pipeKey) {
    const dbPipe = low('database/pipes/' + pipeKey, {storage});

    dbPipe.object.deleted = true;
    dbPipe.write();
}

export function dbManualFieldSave(keyPipe, manualField) {

    var data = {
        keyPipe: keyPipe,
        data: manualField
    };

    $.ajax({
        url: SERVER_URL + MANUAL_FIELDS_SAVE_URL,
        type: 'POST',
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify(data)
    }).done(function(res) {
        // console.log('Pipe Save:');
        // console.log(res);
    });
}

export function dbManualFieldLoad(keyPipe, callback) {
    var data = {
        keyPipe: keyPipe
    };

    $.ajax({
        url: SERVER_URL + MANUAL_FIELDS_LOAD_URL,
        type: 'POST',
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify(data)
    }).done(function(res) {
        // console.log('Pipe Load:');
        // console.log(res);
        callback(res);
    });
}

export function dbPipeSave(projectKey, pipeNumber, heatNumber, scanAKey, scanBKey) {

    const keyPipe = uuid();

    scanAKey = scanAKey.split(' ').join('_');
    scanAKey = scanAKey.split(' ').join('_');

    var data = {
        keyPipe: keyPipe,
        keyScanA: scanAKey,
        keyScanB: scanBKey,
        keyProject: projectKey,
        pipeNumber: pipeNumber,
        heatNumber: heatNumber
    };

    $.ajax({
        url: SERVER_URL + PIPE_SAVE_URL,
        type: 'POST',
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify(data)
    }).done(function(res) {
        // console.log('Pipe Save:');
        // console.log(res);
    });

    return keyPipe;
}



export function dbScanFlag(scanKey, end) {

    scanKey = scanKey.split(' ').join('_');

    var url = SERVER_URL + SCANSA_UPDATE_SAVE_URL;
    if (end.toUpperCase() == 'B') {
        url = SERVER_URL + SCANSB_UPDATE_SAVE_URL;
    }

    $.ajax({
        url: url,
        type: 'POST',
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify({
            keyScan: scanKey
        })
    }).done(function(res) {
        // console.log('Scan Flag Update:');
        // console.log(res);
    });

}

export function dbLoadPipeList(projectKey, callback) {

    $.ajax({
        url: SERVER_URL + PIPE_LIST_BY_PROJECT_URL,
        type: 'POST',
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify({
            keyProject: projectKey
        })
    }).done(function(res) {
        // console.log('Load Pipe List By Project:');
        // console.log(res);
        if (res) callback(res);
    });

}

export function dbScanLookup(scanKey, end, callback) {

    scanKey = scanKey.split(' ').join('_');

    var url = SERVER_URL + SCANSA_LIST_URL;
    if (end.toUpperCase() == 'B') {
        url = SERVER_URL + SCANSB_LIST_URL;
    }

    $.ajax({
        url: url,
        type: 'POST',
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify({
            keyScan: scanKey
        })
    }).done(function(res) {
        // console.log('Scan List:');
        // console.log(res);
        if (res) callback(res);
    });

}

export function dbPipeLookup(pipeKey, callback) {

    $.ajax({
        url: SERVER_URL + PIPE_LIST_BY_PIPE_URL,
        type: 'POST',
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify({
            keyPipe: pipeKey
        })
    }).done(function(res) {
        // console.log('Pipe List:');
        // console.log(res);
        if (res) callback(res);
    });

}

export function dbProjectsLoad(callback) {

    $.ajax({
        url: SERVER_URL + PROJECTS_LIST_URL,
        type: 'GET',
        contentType: 'application/json',
        dataType: 'json',
    }).done(function(res) {
        if (res.length) callback(res);
    });

}

export function dbProjectUpdateFields(projectKey, keyName, value, type) {

    $.ajax({
        url: SERVER_URL + PROJECTS_UPDATE_FIELD_URL,
        type: 'POST',
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify({
            keyName: type + keyName,
            value: value,
            keyProject: projectKey
        })
    }).done(function(res) {
        // console.log('Project Field Update:');
        // console.log(res);
    });

}

export function dbProjectUpdateFieldsUnits(projectKey, value) {

    $.ajax({
        url: SERVER_URL + PROJECTS_UPDATE_UNIT_URL,
        type: 'POST',
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify({
            value: value,
            keyProject: projectKey
        })
    }).done(function(res) {
        // console.log('Project Unit Update:');
        // console.log(res);
    });

}

export function dbProjectLoadUnits(projectKey, callback) {

    $.ajax({
        url: SERVER_URL + PROJECTS_LOAD_UNIT_URL,
        type: 'POST',
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify({
            keyProject: projectKey
        })
    }).done(function(res) {
        // console.log('Project Load Unit:');
        // console.log(res);
        if (res) callback(res);
    });

}

export function dbProjectCreate(projectData) {

    const keyProject = uuid();

    projectData.keyProject = keyProject;

    $.ajax({
        url: SERVER_URL + PROJECTS_ADD_URL,
        type: 'POST',
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify(projectData)
    }).done(function(res) {
        // console.log('Project Create:');
        // console.log(res);
    });

    return keyProject;
}

export function dbProjectUpdatePipeOptions(projectKey, options) {

    $.ajax({
        url: SERVER_URL + PROJECTS_UPDATE_PIPE_OPTIONS_URL,
        type: 'POST',
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify({
            pipeOptions: JSON.stringify(options),
            keyProject: projectKey
        })
    }).done(function(res) {
        // console.log('Project Update Pipe Options:');
        // console.log(res);
    });

}

export function dbProjectLoadPipeOptions(projectKey, callback) {

    $.ajax({
        url: SERVER_URL + PROJECTS_LOAD_PIPE_OPTIONS_URL,
        type: 'POST',
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify({
            keyProject: projectKey
        })
    }).done(function(res) {
        // console.log('Project Load Pipe Options:');
        // console.log(res);
        if (res) callback(res);
    });

}

export function dbProjectUpdateName(projectKey, value) {

    $.ajax({
        url: SERVER_URL + PROJECTS_UPDATE_NAME_URL,
        type: 'POST',
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify({
            keyProject: projectKey,
            projectName: value
        })
    }).done(function(res) {
        // console.log('Project Update Name:');
        // console.log(res);
    });

}

export function dbProjectGetFields(projectKey, callback) {

    $.ajax({
        url: SERVER_URL + PROJECTS_LOAD_FILEDS_URL,
        type: 'POST',
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify({
            keyProject: projectKey
        })
    }).done(function(res) {
        // console.log('Project Load Fields:');
        // console.log(res);
        if (res) callback(res);
    });

}

export function dbProjectDelete(projectKey, callback) {

    $.ajax({
        url: SERVER_URL + PROJECTS_DELETE_URL,
        type: 'POST',
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify({
            keyProject: projectKey
        })
    }).done(function(res) {
        // console.log('Project Delete:');
        // console.log(res);
        callback(res);
    });

}

export function dbScanCheck(keyScan, end, callback) {

    keyScan = keyScan.split(' ').join('_');

    var url = SERVER_URL + SCANSA_LOAD_KEYSCAN_URL;
    if (end.toUpperCase() == 'B') url = SERVER_URL + SCANSB_LOAD_KEYSCAN_URL;

    $.ajax({
        url: url,
        type: 'POST',
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify({
            keyScan: keyScan
        })
    }).done(function(res) {
        // console.log('Scans load scan:');
        // console.log(res);

        if (!res) {
            callback(false);
        }else {
            callback(true);
        }
    });

}

export function dbScanCreate(keyScan, data, end, callback) {

    keyScan = keyScan.split(' ').join('_');

    var url = SERVER_URL + SCANSA_ADD_URL;
    if (end.toUpperCase() == 'B') {
        url = SERVER_URL + SCANSB_ADD_URL;
    }

    const {
        radius,
        bevelAngle,
        landThickness,
        halfBevelGap,
        wallThickness
    } = data;

    $.ajax({
        url: url,
        type: 'POST',
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify({
            keyScan: keyScan,
            radius: JSON.stringify(radius),
            bevelAngle: JSON.stringify(bevelAngle),
            landThickness: JSON.stringify(landThickness),
            halfBevelGap: JSON.stringify(halfBevelGap),
            wallThickness: JSON.stringify(wallThickness),
            is_saved: true
        })
    }).done(function(res) {
        // console.log('Scan Create:');
        // console.log(res);
        callback(res);
    });

}

export function dbScansLoadList(end, callback) {

    var url = SERVER_URL + SCANSA_LOAD_LIST_URL;

    if (end.toUpperCase() == 'B') url = SERVER_URL + SCANSB_LOAD_LIST_URL;

    $.ajax({
        url: url,
        type: 'GET',
        contentType: 'application/json',
        dataType: 'json',
    }).done(function(res) {
        // console.log('Scans Load List: ', end);
        // console.log(res);
        if (res) callback(res);
    });

}

