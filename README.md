# BEST Database Application

The BEST database application watches a directory specified under the settings where there are two pipe ends. Each pipe end has it's own watch directory.  Projects can be added and managed through the project functions built into the application.

The application watches a directory and if any new files appear then it adds them into a queued list to review before being databased by the application.

The database keeps track of key values so values already stored in directory will not be duplicated and checked against the database values.

New database values that are not stored in the database will show up in a queued list for each pipe end.

## Development Requirements

Knowledge of the following technologies is required for future development of the application.

- NodeJS - https://nodejs.org/en/
- Electron - https://www.electron.org
- React - https://facebook.github.io/react/
- Redux - https://github.com/reactjs/redux
- Webpack - https://webpack.github.io/
- C3 Graphs - (updated graphs)
- SCSS / SASS - Stylesheet langauge
- SQLite - http://sqlite.org/

## Install

```bash
npm install
```

## Run

```bash
$ npm run dev
```

## Build

```bash
npm run build
```

#### Toggle Chrome DevTools
- OS X: <kbd>Cmd</kbd> <kbd>Alt</kbd> <kbd>I</kbd> or <kbd>F12</kbd>
- Linux: <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>I</kbd> or <kbd>F12</kbd>
- Windows: <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>I</kbd> or <kbd>F12</kbd>

## Package

```bash
$ npm run package
```

To package apps for all platforms:

```bash
$ npm run package-all
```

## Windows build

TODO

A windows install running node is required for building the windows version of the application.

Note:
Windows build using WINE on Linux is possible, but probably not necessary.

## Mac build

Information is still TBD for Mac OSX related builds.  This has not been tested yet, but should work with existing configuration.


## Version
0.10.0
- Initial version submitted.

0.20.0
- Clean up interactive graphs.  Using C3 charts now.
- Clean up Electron project files. Some of the boilerplate has been changed.
- Make changes to watch files are now being treated as a directory and the excel file is loaded correctly from the Geomagic script files.
- Disable second pipe end. Set this up under a settings under second. directory.  Also added option to allow a single pipe end to be databased.
- Removal of CSV export.  Not needed with SQLite database now.
- Move database functions into separate source file.
- Add a UI component to show a list of pending scans.
- Add ability to auto generate fill pipe number.
- Rewrite and removal of all <table> tags.  Now using DIV's with flex.
- Update to Electron > v1.0.
- Remove React Router.
- Cleaning up of TextBlock component renamed to InputText.
- Splitting up previous TextBlock component into two components InputText and InputNumberUnit.
- Conversion of units now done correctly. Units are always stored as metric (mm) in the database.
- Data is now stored in a SQLite DB file.  The need to export as excel is no longer needed since larger data analytics can be done directly by accessing the SQLite database file or processing script.
- Selecting a project is now down though a popup dialog box.  This will make it easier to see a list of project and data associated with it,
- Removal of all MaterialUI components.  Using FixedDataTable and react-modal dialog system.
- Disabled debugging scripts.
- Cleaned up reducer structure for projectFields and settings.
- Clean up README and package files.
- Major and minor code cleanups.

## TODO
- Get pipe


## Future development considerations
- Replace deprecated this.refs for React components.
- Possibly having the ability to have the SQLite database file stored in a different location.

## Scaning logic

The application can watch and process files from two separate directories, which are for two separate pipe ends.  When a file found initially or if a new file appears into a watch directory it is processed immediately and saved into the database.  When the application is launched it will re-read the directories and compare with the exiting ones in the database.  If a directory has been previously processed then the scan is ignored.

The following updated format of the directory is as follows.

```
S2 12 Intersection - 1_20160715_210115
  --- flat_Dimensions.csv
```

NOTE: If the structure of the directory name is changed it might create breakage.  This will need to be corrected by modifying the code in the file ``` actions/scans.js``` under the ```parseFilename``` function.

## Pipe scanning options

The application allows the user an extra step to enter in a Pipe Number and Heat number. The current scan(s) will be databased by clicking on the "Save Scan" button.  The pipe and heat number can be alpha numeric.  The Pipe number can also be generated automatically when the "Auto Generate Pipe Number" option is selected (see detailed description below)

- Auto Archive scans
  Then this feature is enabled the Pipe Number and Heat Number will be disabled and the pipe number will be generated automatically using the "Auto Generate Pipe Number" function.

  NOTE: It is important if using two pipe ends that the scans are done in synchronous order.  The application will create a pipe using the first scans in the queue.  So if scanning pipes

  Moreover, when scans are already queued enabling this feature will automatically archive all pipes.  This feature can also be disable during scanning and is mostly used for batch processing.

- Auto Generate Pipe Number
  This function allows a pipe number to be generate automatic increment using the highest value in the pipe list for the project by incrementing by one (1). When this function is enabled the Pipe Number field will be disabled.

  NOTE: In the middle of the archiving process this function can be disabled and the pipe number field will become active again allowing manual entry.  If re-enabled the incrementing will start with the highest number in the pipe list for the current project. If pipe list is empty the pipe Number will start at one (1).

  - Save single pipe end
  This function allows only a single pipe end to be databased.  This feature was added in for testing purposes.  It is recommended that pipe end A be used for single archiving, but this feature will also work with pipe end B.
  NOTE: Regular functionality requires both pipe ends to have at least one scan in the queue.

Each scan will have a scan queue.  It is recommended that for individual scans thats

## Database

All information is stored in a SQLite database broken out into the following structure.

```
CREATE TABLE projects(
  keyProject TEXT NOT NULL UNIQUE,
  projectName TEXT NOT NULL,
  client TEXT DEFAULT '',
  contractor TEXT DEFAULT '',
  projectDesignation TEXT DEFAULT '',
  weldProcedure TEXT DEFAULT '',
  pipeDiameter REAL DEFAULT 0,
  nominalRadius REAL DEFAULT 0,
  nominalRadiusExtension REAL DEFAULT 0,
  nominalLandThickness REAL DEFAULT 0,
  nominalBevelAngle REAL DEFAULT 0,
  nominalHalfBevelGap REAL DEFAULT 0,
  nominalWallThickness REAL DEFAULT 0,
  nominalInternalPipeDiameter REAL DEFAULT 0,
  nominalOutsidePipeDiameter REAL DEFAULT 0,
  upperTolerance REAL DEFAULT 0,
  lowerTolerance REAL DEFAULT 0,
  fieldUnits // used to store the unit type in JSON format
  pipeOptions // Pipe options for project
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
```

# Datbase Tranlation Suggestions

The SQLite database is stored in a single file and can be accessed directly using a application or can be copied.  It is recommended that a script be created to convert the SQLite database to the correct format for larger analytical processes when those are you be determined.

## Tableau integration for SQLite

http://kb.tableau.com/articles/knowledgebase/customizing-odbc-connections
