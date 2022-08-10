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
    PROJECT_CREATE_DIALOG_SHOW,
    PROJECT_INCH,
    PROJECT_VARIANCE,
    PROJECT_B_INCH,
    PROJECT_B_VARIANCE,
    PROJECT_LIMIT_TYPE
} from '../constants/actionTypes';

export function projectDialogShow(state = false, action) {
    switch (action.type) {
        case PROJECT_DIALOG_SHOW:
            return action.value;
        default:
            return state;
    }
}

export function inch(state = false, action) {
    switch (action.type) {
        case PROJECT_INCH:
            return action.value;
        default:
            return state;
    }
}

export function variance(state = false, action) {
    switch (action.type) {
        case PROJECT_VARIANCE:
            return action.value;
        default:
            return state;
    }
}

export function endBInch(state = false, action) {
    switch (action.type) {
        case PROJECT_B_INCH:
            return action.value;
        default:
            return state;
    }
}

export function endBVariance(state = false, action) {
    switch (action.type) {
        case PROJECT_B_VARIANCE:
            return action.value;
        default:
            return state;
    }
}



export function limitType(state = 0, action) {
    switch (action.type) {
        case PROJECT_LIMIT_TYPE:
            return action.value;
        default:
            return state;
    }
}



export function projectCreateDialogShow(state = false, action) {
    switch (action.type) {
        case PROJECT_CREATE_DIALOG_SHOW:
            return action.value;
        default:
            return state;
    }
}

export function projectDisabled(state = true, action) {
    switch (action.type) {
        case PROJECT_DELETED:
            return true;
        case PROJECT_DISABLED:
            return action.value;
        default:
            return state;
    }
}

export function projectSelected(state = '', action) {
    switch (action.type) {
        case PROJECT_SELECT:
            return action.projectKey;
        case PROJECT_DELETED:
            return '';
        default:
            return state;
    }
}

export function projectList(state = [], action) {
    switch (action.type) {
        case PROJECT_LIST:
            // console.log('PROJECT_LIST');
            // console.log(action.list);
            return action.list;
        default:
            return state;
    }
}

export function projectName(state = '', action) {
    switch (action.type) {
        case PROJECT_UPDATE_NAME:
        case PROJECT_SELECT:
            return action.projectName;
        case PROJECT_DELETED:
            return '';
        default:
            return state;
    }
}

export function projectFieldsUnits(state = {}, action) {
    const {type, keyName, value, fieldUnits} = action;
    switch (type) {
        case PROJECT_FIELD_UNIT_INIT: {
            return fieldUnits;
        }
        case PROJECT_UPDATE_FIELD_UNIT: {
            const obj = {...state};
            obj[keyName] = value;
            return obj;
        }
        default:
            return state;
    }
}

export function projectFields(state = {}, action) {
    const {type, keyName, value, keyType} = action;
    switch (type) {
        case PROJECT_DELETED:
            return {};
        case PROJECT_SELECT:

            var projectFields = action.projectFields;
            const {
                upperPipeDiameter,
                lowerPipeDiameter,
                nominalPipeDiameter,
                upperRadius,
                lowerRadius,
                nominalRadius,
                upperRadiusExtension,
                lowerRadiusExtension,
                nominalRadiusExtension,
                upperLandThickness,
                lowerLandThickness,
                nominalLandThickness,
                upperBevelAngle,
                lowerBevelAngle,
                nominalBevelAngle,
                upperHalfBevelGap,
                lowerHalfBevelGap,
                nominalHalfBevelGap,
                upperWallThickness,
                lowerWallThickness,
                nominalWallThickness,
                upperInternalPipeDiameter,
                lowerInternalPipeDiameter,
                nominalInternalPipeDiameter,
                upperOutsidePipeDiameter,
                lowerOutsidePipeDiameter,
                nominalOutsidePipeDiameter
            } = projectFields;

            projectFields['PipeDiameter'] = {
                upper: upperPipeDiameter,
                lower: lowerPipeDiameter,
                nominal: nominalPipeDiameter
            };

            projectFields['Radius'] = {
                upper: upperRadius,
                lower: lowerRadius,
                nominal: nominalRadius
            };

            projectFields['RadiusExtension'] = {
                upper: upperRadiusExtension,
                lower: lowerRadiusExtension,
                nominal: nominalRadiusExtension
            };

            projectFields['LandThickness'] = {
                upper: upperLandThickness,
                lower: lowerLandThickness,
                nominal: nominalLandThickness
            };

            projectFields['BevelAngle'] = {
                upper: upperBevelAngle,
                lower: lowerBevelAngle,
                nominal: nominalBevelAngle
            };

            projectFields['HalfBevelGap'] = {
                upper: upperHalfBevelGap,
                lower: lowerHalfBevelGap,
                nominal: nominalHalfBevelGap
            };

            projectFields['WallThickness'] = {
                upper: upperWallThickness,
                lower: lowerWallThickness,
                nominal: nominalWallThickness
            };

            projectFields['InternalPipeDiameter'] = {
                upper: upperInternalPipeDiameter,
                lower: lowerInternalPipeDiameter,
                nominal: nominalInternalPipeDiameter
            };

            projectFields['OutsidePipeDiameter'] = {
                upper: upperOutsidePipeDiameter,
                lower: lowerOutsidePipeDiameter,
                nominal: nominalOutsidePipeDiameter
            };

            return projectFields;
        case PROJECT_UPDATE_FIELD: {
            const obj = {...state};
            // console.log(obj[keyName]);
            if (typeof obj[keyName] == "undefined") {
                obj[keyName] = {
                    upper: 0,
                    lower: 0,
                    nominal: 0
                };
            }
            obj[keyName][keyType] = value;
            return obj;
        }
        default:
            return state;
    }
}

export function projectPipeOptions(state = {}, action) {
    const {type, value} = action;
    switch (type) {
        case PROJECT_PIPE_OPTION_AUTOARCHIVE:
            return {
                ...state,
                autoArchive: value,
            };
        case PROJECT_PIPE_OPTION_AUTOGENERATE:
            return {
                ...state,
                autoGenerate: value,
            };
        case PROJECT_PIPE_OPTION_SINGLEEND:
            return {
                ...state,
                singleEnd: value,
            };
        default:
            return state;
    }
}
