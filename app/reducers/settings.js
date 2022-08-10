import {
    TOPBAR_SETTINGS_SHOW,
    TOPBAR_MANUAL_FIELDS_SHOW,
    PIPE_MANUAL_FIELD_SHOW,
    SETTINGS_SET_WATCH_DIRECTORY_A,
    SETTINGS_SET_WATCH_DIRECTORY_B,
    SETTINGS_SET_OUTPUT_DIRECTORY_A,
    SETTINGS_SET_OUTPUT_DIRECTORY_B,
    PROJECT_TABLE_SHOW
} from '../constants/actionTypes';

export function settingsShow(state = false, action) {
    const {type, show} = action;
    switch (type) {
        case TOPBAR_SETTINGS_SHOW:
            return show;
        default:
            return state;
    }
}

export function manualFieldsShow(state = false, action) {
    const {type, show} = action;
    switch (type) {
        case TOPBAR_MANUAL_FIELDS_SHOW:
            return show;
        default:
            return state;
    }
}

export function manualFieldsFormShow(state = false, action) {
    const {type, show} = action;
    switch (type) {
        case PIPE_MANUAL_FIELD_SHOW:
            return show;
        default:
            return state;
    }
}

export function projectTableShow(state = false, action) {
    const {type, show} = action;
    switch (type) {
        case PROJECT_TABLE_SHOW:
            return show;
        default:
            return state;
    }
}



export function settingsWatchA(state = null, action) {
    const {type, path} = action;
    switch (type) {
        case SETTINGS_SET_WATCH_DIRECTORY_A:
            return path;
        default:
            return state;
    }
}

export function settingsWatchB(state = null, action) {
    const {type, path} = action;
    switch (type) {
        case SETTINGS_SET_WATCH_DIRECTORY_B:
            return path;
        default:
            return state;
    }
}

export function settingsOutputA(state = null, action) {
    const {type, path} = action;
    switch (type) {
        case SETTINGS_SET_OUTPUT_DIRECTORY_A:
            return path;
        default:
            return state;
    }
}

export function settingsOutputB(state = null, action) {
    const {type, path} = action;
    switch (type) {
        case SETTINGS_SET_OUTPUT_DIRECTORY_B:
            return path;
        default:
            return state;
    }
}

