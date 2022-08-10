import {
    PIPE_UPDATE_PIPE_NUMBER,
    PIPE_UPDATE_HEAT_NUMBER,
    PIPE_LIST,
    PIPE_SAVE,
    PIPE_INFO,
    PIPE_LIST_SORT_COLUMN,
    PIPE_DIALOG_SET_DATA_A,
    PIPE_DIALOG_SET_DATA_B,
    PIPE_DIALOG_OPEN,
    MANUAL_FIELD_UPDATE,
    MANUAL_FIELD_ADD,
    MANUAL_FIELDS
} from '../constants/actionTypes';

export function pipeDialogOpen(state = false, action) {
    switch (action.type) {
        case PIPE_DIALOG_OPEN:
            return action.open;
        default:
            return state;
    }
}

export function pipeDialogData(state = {}, action) {
    const {pipeData, type} = action;
    switch (type) {
        case MANUAL_FIELDS:
            return {
                ...state,
                manualFields: pipeData
            };
        case PIPE_INFO:
            return {
                ...state,
                pipeData
            };
        case PIPE_DIALOG_SET_DATA_A:
            return {
                ...state,
                pipeDataA: pipeData,
            };
        case PIPE_DIALOG_SET_DATA_B:
            return {
                ...state,
                pipeDataB: pipeData,
            };
        default:
            return state;
    }
}

export function pipeListSort(state = {}, action) {
    switch (action.type) {
        case PIPE_LIST_SORT_COLUMN:
            return {
                ...state,
                columnName: action.columnNameSelected,
                orderAsc: action.orderAsc,
            };
        default:
            return state;
    }
}

export function pipeList(state = [], action) {
    switch (action.type) {
        case PIPE_LIST:
            return action.payload;
        case PIPE_SAVE:
            return [...state, action.value];
        default:
            return state;
    }
}

export function pipeFields(state = {}, action) {
    const value = action.value;

    switch (action.type) {
        case PIPE_UPDATE_PIPE_NUMBER:
            return {
                ...state,
                pipeNumber: value,
            };
        case PIPE_UPDATE_HEAT_NUMBER:
            return {
                ...state,
                heatNumber: value,
            };
        case PIPE_SAVE:
            return {
                ...state,
                pipeNumber: '',
                heatNumber: value.heatNumber,
            };
        default:
            return state;
    }
}

export function manualFieldsUpdate(state = {}, action) {
    const data = action.fieldData;

    switch (action.type) {
        case MANUAL_FIELD_UPDATE:
            // console.log('manual field update');
            // console.log(data);
            const text_value = data.fieldValue;
            var manualField = data.manualField;
            manualField[data.fieldIndex].mRValue = text_value;
            return {
                ...state,
                manualField: manualField,
                fieldValue: text_value
            };
        default:
            return state;
    }
}

export function manualFieldAdd(state = {}, action) {
    const data = action.fieldData;

    switch (action.type) {
        case MANUAL_FIELD_ADD:
            // console.log('manual field add');
            // console.log(data);

            var manualField = data.manualField;
            const text_value = data.fieldValue;

            while (manualField.length < data.fieldIndex + 1) {
                manualField.push({
                    mKey: '',
                    mValue: '',
                    mRValue: ''
                });
            }

            manualField[data.fieldIndex] = {
                mKey: data.mKey,
                mValue: data.mValue,
                mRValue: ''
            };

            return {
                ...state,
                manualField: manualField,
                fieldValue: text_value
            };
        default:
            return state;
    }
}
