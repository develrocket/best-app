import { combineReducers } from 'redux';
// import { routerReducer as routing } from 'react-router-redux';

import * as settings from './settings';
import * as scans from './scans';
import * as pipes from './pipes';
import * as project from './project';

// import

// import home from './home';
// import { settingsShow, settings } from './settings';
// import {
//   projectFields,
//   projectList,
//   projectSelected,
//   projectDisabled,
//   projectName } from './project';
// import { scanListA, scanListB } from './scans';
//
// import {
//   pipeFields,
//   pipeList,
//   pipeListSort,
//   pipeDialogData,
//   pipeDialogOpen } from './pipes';
//
// const rootReducer = combineReducers({
//   projectFields,
//   projectList,
//   projectSelected,
//   projectDisabled,
//   projectName,
//   pipeFields,
//   pipeList,
//   pipeListSort,
//   pipeDialogData,
//   pipeDialogOpen,
//   scanListA,
//   scanListB,
//   settings,
//   settingsShow,
//   routing
// });

// export default rootReducer;

const rootReducer = combineReducers(
  {
    ...settings,
    ...scans,
    ...pipes,
    ...project,
    // routing,
  }
);

export default rootReducer;
