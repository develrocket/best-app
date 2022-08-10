import {
    SCAN_LIST_A,
    SCAN_LIST_B,
    SCAN_ADD_A,
    SCAN_ADD_B,
    SCAN_DISCARD_A,
    SCAN_DISCARD_B,
    MANUAL_FIELD,
    GRAPH_DIALOG_OPEN,
    HISTORY_DIALOG_OPEN,
    RELOAD_GRAPH,
    SCAN_UPDATE_SAVE_A,
    SCAN_UPDATE_SAVE_B,
    HISTORY_ADD_A,
    HISTORY_ADD_B,
    HISTORY_LIST_A,
    HISTORY_LIST_B,
    SHOW_SCANS
} from '../constants/actionTypes';

import {PIPE_SAVE} from '../actions/pipes';

export function scanListA(state = [], action) {
    const {type, data, payload} = action;
    switch (type) {
        case SCAN_DISCARD_A:
        case PIPE_SAVE:
            return [
                ...state.slice(1)
            ];
        case SCAN_ADD_A:
            // for (var i = 0; i < state.length; i ++) {
            //     var item = state[i];
            //     if (item.key == data.key) {
            //         state[i] = data;
            //         return state;
            //     }
            // }
            return [data];
        case SCAN_UPDATE_SAVE_A:
            // const {keyScan} = action;
            // for (var i = 0; i < state.length; i ++) {
            //     var item = state[i];
            //     if (item.key == keyScan) {
            //         item.is_saved = true;
            //     }
            // }
            return [];
        case SCAN_LIST_A:
            return payload;
        default:
            return state;
    }
}

export function historyListA(state = [], action) {
    const {type, data, payload} = action;
    switch (type) {
        case HISTORY_ADD_A:
            for (var i = 0; i < state.length; i ++) {
                var item = state[i];
                if (item.key == data.key) {
                    state[i] = data;
                    return state;
                }
            }
            return state.concat(data);
        case HISTORY_LIST_A:
            return payload;
        default:
            return state;
    }
}

export function historyListB(state = [], action) {
    const {type, data, payload} = action;
    switch (type) {
        case HISTORY_ADD_B:
            for (var i = 0; i < state.length; i ++) {
                var item = state[i];
                if (item.key == data.key) {
                    state[i] = data;
                    return state;
                }
            }
            return state.concat(data);
        case HISTORY_LIST_B:
            return payload;
        default:
            return state;
    }
}

export function scanListB(state = [], action) {
    const {type, data, payload} = action;
    switch (type) {
        case SCAN_DISCARD_B:
        case PIPE_SAVE:
            return [
                ...state.slice(1)
            ];
        case SCAN_ADD_B:
            // for (var i = 0; i < state.length; i ++) {
            //     var item = state[i];
            //     if (item.key == data.key) {
            //         state[i] = data;
            //         return state;
            //     }
            // }
            return [data];
        case SCAN_UPDATE_SAVE_A:
            // const {keyScan} = action;
            // for (var i = 0; i < state.length; i ++) {
            //     var item = state[i];
            //     if (item.key == keyScan) {
            //         item.is_saved = true;
            //     }
            // }
            return [];
        case SCAN_LIST_B:
            return payload;
        default:
            return state;
    }
}

export function manualField(state = [], action) {
    switch (action.type) {
        case MANUAL_FIELD:
            return action.list;
        default:
            return state;
    }
}

export function graphDialogOpen(state = false, action) {
    switch (action.type) {
        case GRAPH_DIALOG_OPEN:
            return action.value;
        default:
            return state;
    }
}

export function historyDialogOpen(state = false, action) {
    switch (action.type) {
        case HISTORY_DIALOG_OPEN:
            return action.value;
        default:
            return state;
    }
}

export function reloadGraph(state = false, action) {
    switch (action.type) {
        case RELOAD_GRAPH:
            return action.value;
        default:
            return state;
    }
}

export function showScans(state = false, action) {
    // console.log('Show-Scan-Reducer: ', action.value);
    switch (action.type) {
        case SHOW_SCANS:
            return action.value;
        default:
            return state;
    }
}


