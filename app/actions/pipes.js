import {
    PIPE_UPDATE_PIPE_NUMBER,
    PIPE_UPDATE_HEAT_NUMBER,
    PIPE_LIST,
    PIPE_SAVE,
    PIPE_LIST_SORT_COLUMN,
    PIPE_DIALOG_SET_DATA_A,
    PIPE_DIALOG_SET_DATA_B,
    PIPE_DIALOG_OPEN,
    PIPE_DIALOG_CLOSE,
    PIPE_INFO,
    MANUAL_FIELDS,
    SCAN_UPDATE_SAVE_A,
    SCAN_UPDATE_SAVE_B,
    HISTORY_ADD_A,
    HISTORY_ADD_B,
    SHOW_SCANS
} from '../constants/actionTypes';
import fs from 'fs';
import fse from 'fs-extra';
// import  {
//     dbLoadPipeList,
//     dbPipeSave,
//     dbScanFlag,
//     dbPipeLookup,
//     dbScanLookup,
// } from '../db/sqlite';
import {
    dbLoadPipeList,
    dbPipeSave,
    dbScanFlag,
    dbPipeLookup,
    dbScanLookup,
    dbManualFieldSave,
    dbManualFieldLoad,
    dbScanCheck,
    dbScanCreate,
} from '../db/mongodb';
import uuid from 'node-uuid';

function saveScanData(scanData, end) {

    var keyScan = scanData.keyScan;
    var path = scanData.path;
    scanData.is_saved = true;

    // console.log('Save Scan Data');
    // console.log(scanData);

    dbScanCheck(keyScan, end, found => {
        // console.log('dbScanCheck:', found);
        if (!found) {
            dbScanCreate(keyScan, scanData, end, res => {
                // console.log('DB Scan Created');
                var movePath = 'temp/' + end + '/' + keyScan;
                fse.mkdirs(movePath, function(err) {
                    // console.log('made directory');
                    if (!err) {
                        try {
                            fse.copySync(path, movePath);
                            // console.log('file copied');
                            try{
                                fse.removeSync(path);
                                // console.log('file deleted');
                            }catch(err) {
                                // console.log(err);
                            }
                        }catch(err) {
                            // console.log(err);
                        }
                    }
                });
            });
        }
    });
}

export function pipeDialogClose() {
    return ({type: PIPE_DIALOG_OPEN, open: false});
}

export function pipeDialogFetchData(pipeKey) {
    return dispatch => {
        dbPipeLookup(pipeKey, row => {
            const {keyScanA, keyScanB} = row[0];

            dispatch({type: PIPE_INFO, pipeData: row[0]});

            dbManualFieldLoad(pipeKey, row => {
                // console.log('*******************************');
                // console.log(row);
                dispatch({type: MANUAL_FIELDS, pipeData: row});
            });

            // Make sure at least one scan exists
            dbScanLookup(keyScanA, 'A', row => {
                dispatch({type: PIPE_DIALOG_SET_DATA_A, pipeData: row});
                dispatch({type: PIPE_DIALOG_OPEN, open: true});
            });

            dbScanLookup(keyScanB, 'B', row => {
                dispatch({type: PIPE_DIALOG_SET_DATA_B, pipeData: row});
                dispatch({type: PIPE_DIALOG_OPEN, open: true});
            });
        });
    };
}

export function pipeActionListSort(columnNameSelected) {
    return (dispatch, getState) => {
        // const state = getState();
        const {columnName} = getState().pipeListSort;
        let {orderAsc} = getState().pipeListSort;

        if (columnName === columnNameSelected) {
            orderAsc = !orderAsc;
        } else {
            orderAsc = true;
        }

        dispatch({type: PIPE_LIST_SORT_COLUMN, columnNameSelected, orderAsc});
    };
}

export function pipeDelete() {
    return (dispatch, getState) => {
        const {pipeDialogData, projectSelected} = getState();

        dbPipeDelete(pipeDialogData.key);
        const payload = dbLoadPipeList(projectSelected);
        dispatch({type: PIPE_LIST, payload});
    }
}

export function pipeSave(pipeNumber, heatNumber, manualField) {
    return (dispatch, getState) => {
        const {
            projectSelected,
            scanListA,
            scanListB,
        } = getState();

        var scanAKey = (scanListA.length > 0) ?
            scanListA[0].keyScan : '';
        var scanBKey = (scanListB.length > 0) ?
            scanListB[0].keyScan : '';
        const dateCreated = new Date();


        // const obj = {
        //   key,
        //   pipeNumber,
        //   heatNumber,
        //   scanKeyA: scanA.key,
        //   scanKeyB: scanB.key,
        //   created,
        // };

        const keyPipe = dbPipeSave(
            projectSelected,
            pipeNumber,
            heatNumber,
            scanAKey,
            scanBKey,
            dateCreated,
        );

        if (scanAKey !== '') {
            // dbScanFlag(scanAKey, 'A');
            saveScanData(scanListA[0], 'A');
            dispatch({type: HISTORY_ADD_A, data: scanListA[0]});
        }
        if (scanBKey !== '') {
            // dbScanFlag(scanBKey, 'B');
            saveScanData(scanListB[0], 'B');
            dispatch({type: HISTORY_ADD_B, data: scanListB[0]});
        }

        dbManualFieldSave(keyPipe, manualField);

        // if (projectSelected.length > 0) {
        //   // dbSaveProjectPipe(projectSelected, key);
        //
        //   dbSavePipe(key, obj, settings, projectSelected);
        //
        //   // const pathScans = 'database/scans/';
        //   // const pathScansSaved = 'database/scansSaved/';
        //   // fs.renameSync(pathScans + scanA.key, pathScansSaved + scanA.key);
        //   // fs.renameSync(pathScans + scanB.key, pathScansSaved + scanB.key);
        // }

        dispatch({
            type: PIPE_SAVE,
            value: {keyPipe, pipeNumber, heatNumber, dateCreated},
        });

        dispatch({
            keyScan: scanAKey,
            type: SCAN_UPDATE_SAVE_A
        });

        dispatch({
            keyScan: scanBKey,
            type: SCAN_UPDATE_SAVE_B
        });

        dispatch({
            type: SHOW_SCANS,
            value: false
        });
        dispatch({
            type: SHOW_SCANS,
            value: true
        });
    };
}

// used for project selection
export function pipeGetList(projectKey) {
    return (dispatch) => {
        dbLoadPipeList(projectKey, payload => {
            dispatch({type: PIPE_LIST, payload});
        });
    };
}

export function pipeFieldUpdatePipeNumber(value) {
    return {type: PIPE_UPDATE_PIPE_NUMBER, value};
}

export function pipeFieldUpdateHeatNumber(value) {
    return {type: PIPE_UPDATE_HEAT_NUMBER, value};
}

