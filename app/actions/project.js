import {
    PROJECT_LIST,
    PROJECT_SELECT,
    PROJECT_DELETED,
    PROJECT_UPDATE_NAME,
    PROJECT_UPDATE_FIELD,
    PROJECT_UPDATE_FIELD_UNIT,
    PROJECT_FIELD_UNIT_INIT,
    PROJECT_DISABLED,
    PROJECT_DIALOG_SHOW,
    PROJECT_PIPE_OPTION_AUTOARCHIVE,
    PROJECT_PIPE_OPTION_AUTOGENERATE,
    PROJECT_PIPE_OPTION_SINGLEEND,
    PROJECT_TABLE_SHOW,
    PROJECT_CREATE_DIALOG_SHOW,
    PROJECT_INCH,
    PROJECT_VARIANCE,
    PROJECT_B_INCH,
    PROJECT_B_VARIANCE,
    PROJECT_LIMIT_TYPE
} from '../constants/actionTypes';
import uuid from 'node-uuid';
import {
    dbProjectCreate,
    dbProjectsLoad,
    dbProjectGetFields,
    dbProjectUpdateFields,
    dbProjectUpdateFieldsUnits,
    dbProjectLoadUnits,
    dbProjectUpdateName,
    dbProjectDelete,
    dbProjectUpdatePipeOptions,
    dbProjectLoadPipeOptions,
} from '../db/mongodb';
import {pipeGetList, PIPE_LIST} from './pipes';

export function getProjectList() {
    // console.log('get-project-list');
    return dispatch => {
        dbProjectsLoad(list => {
            // console.log('db-project-load');
            // console.log(list);
            dispatch({type: PROJECT_LIST, list});
        });
    };
}

export function selectProject(projectKey) {
    // console.log('select-project:', projectKey);
    return dispatch => {
        if ((!projectKey) || (projectKey === '')) {
            dispatch({type: PROJECT_DISABLED, value: true});
        }

        dbProjectGetFields(projectKey, projectFields => {
            // console.log(projectKey);
            // console.log(projectFields);
            const {projectName} = projectFields;

            dispatch({type: PROJECT_SELECT, projectKey, projectName, projectFields});
            dispatch(pipeGetList(projectKey));
            dispatch({type: PROJECT_DISABLED, value: false});
        });

        dbProjectLoadUnits(projectKey, fieldUnits => {
            dispatch({type: PROJECT_FIELD_UNIT_INIT, fieldUnits});
        });
    };
}

export function deleteProject() {
    // console.log('delete-project');
    return (dispatch, getState) => {
        const {projectSelected} = getState();

        dbProjectDelete(projectSelected, function(res) {
            // console.log('project-delete-callback');
        });

        setTimeout(() => {
            dispatch(getProjectList());
        });

        dispatch({type: PROJECT_DELETED});
    };
}

export function createProject(projectData) {
    const key = dbProjectCreate(projectData);

    return dispatch => {
        setTimeout(() => {
            dispatch(getProjectList());
            dispatch(selectProject(key));
        }, 100);
    };
}

export function projectUpdate(keyName, value, keyType, unit) {
    return (dispatch, getState) => {
        const {projectSelected} = getState();
        if (projectSelected) {
            // console.log('projectUpdateValue', value);
            dbProjectUpdateFields(projectSelected, keyName, value, keyType);
            dispatch({type: PROJECT_UPDATE_FIELD, keyName, value, keyType});
        }
    };
}

export function projectRename(projectName) {
    return (dispatch, getState) => {
        const {projectSelected} = getState();
        dbProjectUpdateName(projectSelected, projectName);
        dispatch({type: PROJECT_UPDATE_NAME, projectName});
        dispatch(getProjectList());
    };
}

export function projectDialogShowFunc(value) {
    return {type: PROJECT_DIALOG_SHOW, value};
}

export function projectCreateDialogShowFunc(value) {
    return {type: PROJECT_CREATE_DIALOG_SHOW, value};
}

export function projectMeter(value) {
    return {type: PROJECT_INCH, value};
}

export function projectEndBMeter(value) {
    return {type: PROJECT_B_INCH, value};
}

export function projectEndBActual(value) {
    return {type: PROJECT_B_VARIANCE, value};
}
export function projectActual(value) {
    return {type: PROJECT_VARIANCE, value};
}

export function projectLimitTypeFunc(value) {
    return {type: PROJECT_LIMIT_TYPE, value};
}

export function showProjectTable(show) {
    return {
        type: PROJECT_TABLE_SHOW,
        show
    }
}


export function projectUpdateUnit(keyName, value) {
    return (dispatch, getState) => {
        const {projectSelected, projectFieldsUnits} = getState();

        projectFieldsUnits[keyName] = value;
        dbProjectUpdateFieldsUnits(projectSelected, projectFieldsUnits);
        dispatch({type: PROJECT_UPDATE_FIELD_UNIT, keyName, value});
    };
}

export function projectPipeOptionsLoad() {
    return (dispatch, getState) => {
        const {projectSelected} = getState();

        dbProjectLoadPipeOptions(projectSelected, pipeOptions => {
            const {autoArchive, autoGenerate, singleEnd} = pipeOptions;

            dispatch({
                type: PROJECT_PIPE_OPTION_AUTOARCHIVE,
                value: autoArchive
            });

            dispatch({
                type: PROJECT_PIPE_OPTION_AUTOGENERATE,
                value: autoGenerate
            });

            dispatch({
                type: PROJECT_PIPE_OPTION_SINGLEEND,
                value: singleEnd
            });
        });
    }
}

export function projectPipeOptionsAutoArchive(value) {
    return (dispatch, getState) => {
        const {projectPipeOptions, projectSelected} = getState();

        dbProjectUpdatePipeOptions(projectSelected, {
            ...projectPipeOptions,
            autoArchive: value,
        });

        dispatch({type: PROJECT_PIPE_OPTION_AUTOARCHIVE, value});
    }
}

export function projectPipeOptionsAutoGenerate(value) {
    return (dispatch, getState) => {
        const {projectPipeOptions, projectSelected} = getState();

        dbProjectUpdatePipeOptions(projectSelected, {
            ...projectPipeOptions,
            autoGenerate: value,
        });

        dispatch({type: PROJECT_PIPE_OPTION_AUTOGENERATE, value});
    }
}

export function projectPipeOptionsSingleEnd(value) {
    return (dispatch, getState) => {
        const {projectPipeOptions, projectSelected} = getState();

        dbProjectUpdatePipeOptions(projectSelected, {
            ...projectPipeOptions,
            singleEnd: value,
        });

        dispatch({type: PROJECT_PIPE_OPTION_SINGLEEND, value});
    }
}
