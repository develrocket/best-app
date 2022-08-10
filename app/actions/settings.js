import {
    SETTINGS_SET_WATCH_DIRECTORY_A,
    SETTINGS_SET_WATCH_DIRECTORY_B,
    SETTINGS_SET_OUTPUT_DIRECTORY_A,
    SETTINGS_SET_OUTPUT_DIRECTORY_B,
    TOPBAR_SETTINGS_SHOW,
    TOPBAR_MANUAL_FIELDS_SHOW,
    PIPE_MANUAL_FIELD_SHOW,
    MANUAL_FIELD_UPDATE,
    MANUAL_FIELD_ADD
} from '../constants/actionTypes';

import {startWatch} from './scans';

export function settingsSetWatch(path, end, manualField) {
    return dispatch => {
        dispatch(startWatch(path, end, manualField));

        if (end.toLowerCase() === 'a') {
            dispatch({
                type: SETTINGS_SET_WATCH_DIRECTORY_A,
                path
            });
        } else {
            dispatch({
                type: SETTINGS_SET_WATCH_DIRECTORY_B,
                path
            });
        }
    };
}


export function settingsSetOutput(path, end) {
    return dispatch => {
        if (end.toLowerCase() === 'a') {
            dispatch({
                type: SETTINGS_SET_OUTPUT_DIRECTORY_A,
                path
            });
        } else {
            dispatch({
                type: SETTINGS_SET_OUTPUT_DIRECTORY_B,
                path
            });
        }
    };
}

export function showSettings(show) {
    return {
        type: TOPBAR_SETTINGS_SHOW,
        show
    };
}

export function showManualFields(show) {
    return {
        type: TOPBAR_MANUAL_FIELDS_SHOW,
        show
    }
}

export function showManualFieldsForm(show) {
    return {
        type: PIPE_MANUAL_FIELD_SHOW,
        show
    }
}

export function updateManualField(fieldData) {
    return dispatch => {
        dispatch({
            type: MANUAL_FIELD_UPDATE,
            fieldData: fieldData
        });
    };
}

export function addManualField(fieldData) {
    return dispatch => {
        dispatch({
            type: MANUAL_FIELD_ADD,
            fieldData: fieldData
        });
    };
}

