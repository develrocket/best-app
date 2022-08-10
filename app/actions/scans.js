import watch from 'watch';
import fs from 'fs';
import fse from 'fs-extra';
import csv from 'csv-parser';
import {
    SCAN_UPDATE,
    SCAN_START,
    SCAN_DISCARD_A,
    SCAN_DISCARD_B,
    SCAN_FILE,
    SCAN_LIST_A,
    SCAN_ADD_A,
    SCAN_LIST_B,
    SCAN_ADD_B,
    GRAPH_DIALOG_OPEN,
    RELOAD_GRAPH,
    HISTORY_DIALOG_OPEN,
    SHOW_SCANS,
    HISTORY_LIST_A,
    HISTORY_LIST_B,
    HISTORY_ADD_A,
    HISTORY_ADD_B
} from '../constants/actionTypes';


import {
    dbScanCheck,
    dbScanCreate,
    dbScansLoadList,
} from '../db/mongodb';

function dataScanRow(data, scanData, manualField) {

    //Added by Jerome
    // console.log('function: dataScanRow');
    // console.log('data :', data);
    // console.log('scanData :', scanData);
    // console.log('manualField:', manualField);

    const ret = scanData;
    if (data.Name) {
        const strParse = data.Name.split('-');
        if (strParse.length > 1) {
            const index = parseInt(strParse[0].trim(), 10) - 1;
            const type = strParse[1].trim();

            switch (type.toLowerCase()) { // test incasesensitive
                case 'radius':
                    if (!('radius' in ret)) ret.radius = [];
                    ret.radius[index] = parseFloat(data.Measured);
                    break;
                case 'angle':
                    if (!ret.bevelAngle) ret.bevelAngle = [];
                    ret.bevelAngle[index] = parseFloat(data.Measured);
                    break;
                case 'thickness':
                    if (!ret.landThickness) ret.landThickness = [];
                    ret.landThickness[index] = parseFloat(data.Measured);
                    break;
                case 'gap':
                    if (!ret.halfBevelGap) ret.halfBevelGap = [];
                    ret.halfBevelGap[index] = parseFloat(data.Measured);
                    break;
                case 'wt':
                    if (!ret.wallThickness) ret.wallThickness = [];
                    ret.wallThickness[index] = parseFloat(data.Measured);
                    break;
                default:
                    break;
            }
        }
    }

    return ret;
}

function parseTimestamp(date, time) {
    const year = parseInt(date.substr(0, 4), 10);
    const month = parseInt(date.substr(4, 2), 10);
    const day = parseInt(date.substr(6), 10);

    const hour = parseInt(time.substr(0, 2), 10);
    const minute = parseInt(time.substr(2, 2), 10);
    const second = parseInt(time.substr(4, 2), 10);

    const ret = new Date(year, month - 1, day, hour, minute, second);
    return ret;
}

function parseFilename(filename) {
    const metaData = filename.split('-')[1].trim();
    const elements = metaData.split('_');

    if (elements.length === 3) {
        const pipeNumber = parseInt(elements[0], 10);
        const date = parseTimestamp(elements[1], elements[2]);

        return {
            pipeNumber,
            date
        };
    }

    return undefined;
}

function stripExt(path) {
    return path.replace(/\.[^/.]+$/, '');
}

function stripPath(filepath) {
    return filepath.replace(/^.*[\\\/]/, '');
}

function processDir(path, keyScan, dispatch, end, manualField) {
    // Check for csv file named flat_Dimensions.csv
    const files = fs.readdirSync(path);

    files.forEach(file => {
        if (file === 'flat_Dimensions.csv') {
            const fileStrip = stripExt(file);
            const parseData = parseFilename(keyScan);

            if (parseData) {
                let scanData = {};

                const fullPath = `${path}/${file}`;
                fs.createReadStream(fullPath)
                    .pipe(csv())
                    .on('data', (data) => {
                        scanData = dataScanRow(data, scanData, manualField);
                    })
                    .on('end', () => {
                        scanData.dateCreated = parseData.date;
                        // console.log('dbScanEnd Path:', path);
                        // dbScanCheck(keyScan, end, found => {
                        //     console.log('dbScanCheck:', found);
                        //     if (!found) {
                        //         dbScanCreate(keyScan, scanData, end, res => {
                        //             console.log('DB Scan Created');
                        //             var movePath = 'temp/' + end + '/' + keyScan;
                        //             fse.mkdirs(movePath, function(err) {
                        //                 console.log('made directory');
                        //                 if (!err) {
                        //                     try {
                        //                         fse.copySync(path, movePath);
                        //                         console.log('file copied');
                        //                         try{
                        //                             fse.removeSync(path);
                        //                             console.log('file deleted');
                        //                         }catch(err) {
                        //                             console.log(err);
                        //                         }
                        //                     }catch(err) {
                        //                         console.log(err);
                        //                     }
                        //                 }
                        //             });
                        //         });
                        //     }
                        // });
                        scanData.key = keyScan;
                        scanData.keyScan = keyScan;
                        scanData.path = path;

                        if (end.toLowerCase() === 'a') {
                            dispatch({type: SCAN_ADD_A, data: scanData});
                        } else {
                            dispatch({type: SCAN_ADD_B, data: scanData});
                        }
                    });
            }
        }
    });
}

function scanDirectory(path, dispatch, end) {
    const files = fs.readdirSync(path);

    files.forEach(file => {
        const filepath = `${path}/${file}`;
        const stats = fs.statSync(filepath);

        if (stats.isDirectory()) {
            // Commented by Jerome
            //
            dbScanCheck(file, end, found => {
                if (!found) {
                    // console.log('scan not found');
                    processDir(filepath, file, dispatch, end);
                }
            });

            // processDir(filepath, file, dispatch, end);
        }
    });
}

export function scanLoadList() {
    function buildPayload(rows) {
        return rows.map(v => {
            return {
                keyScan: v.keyScan,
                radius: JSON.parse(v.radius),
                bevelAngle: JSON.parse(v.bevelAngle),
                landThickness: JSON.parse(v.landThickness),
                halfBevelGap: JSON.parse(v.halfBevelGap),
                wallThickness: JSON.parse(v.wallThickness),
                dateCreated: v.dateCreated,
                is_saved: v.is_saved
            };
        });
    }

    return dispatch => {
        dbScansLoadList('A', rows => {
            var payload = buildPayload(rows);
            // dispatch({type: SCAN_LIST_A, payload});
            dispatch({type: HISTORY_LIST_A, payload});
        });

        dbScansLoadList('B', rows => {
            var payload = buildPayload(rows);
            // dispatch({type: SCAN_LIST_B, payload});
            dispatch({type: HISTORY_LIST_B, payload});
        });
    };
}

export function scanDiscard(key, typeLabel) {
    // move files and clear form state
    const pathScans = 'database/scans/';
    const pathScansSaved = 'database/scansDiscard/';
    fs.renameSync(pathScans + key, pathScansSaved + key);

    if (typeLabel.toLowerCase() === 'a') {
        return {
            type: SCAN_DISCARD_A,
            key
        };
    }

    return {
        type: SCAN_DISCARD_B,
        key
    };
}

export function startWatch(path, end, manualField) {

    // console.log('start-watch');

    return dispatch => {
        if (!path) return;
        if (path.length <= 0) return;

        watch.createMonitor(path, {interval: 1000}, (monitor) => {
            monitor.on('created', (f, stat) => {

                if (stat.isDirectory()) {
                    const file = stripPath(f);

                    // Added by Jerome
                    // console.log('Log for Scan -> startWatch');
                    // console.log(file);

                    // Commented By Jerome

                    dbScanCheck(file, end, found => {
                        if (!found) {
                            // console.log('scan not found');
                            processDir(f, file, dispatch, end, manualField);
                        }
                    });

                    // processDir(f, file, dispatch, end, manualField);

                    // console.log(dir);
                    // if (checkExists(dir) === false) {
                    //   processDir(f, file, dispatch);
                    // }
                }
            });
        });

        // TODO check two directories
        if (path.length > 0) {
            scanDirectory(path, dispatch, end);
        }
        // dispatch({ type: SCAN_START, path });
    };
}

export function graphDialogShowFunc(value) {
    return {type: GRAPH_DIALOG_OPEN, value};
}

export function historyDialogShowFunc(value) {
    return {type: HISTORY_DIALOG_OPEN, value};
}

export function reloadGraphFunc(value) {
    return {type: RELOAD_GRAPH, value};
}

export function showScansFunc(value) {
    return {type: SHOW_SCANS, value: value};
}

