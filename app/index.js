import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';
import App from './containers/app';
// import {
//   // dbProjectsLoad,
//   dbScansLoadList,
// } from './db/sqlite';
import './styles/app.scss';

// Load initial data
// const projectList = dbProjectsLoad(rows => {
// });

// const { scanListA, scanListB } = dbScansLoadList();

// TODO remove this
// const projectList = [];
// const scanListA = [];
// const scanListB = [];
//
// const initialState = {
//   projectList,
//   scanListA,
//   scanListB,
// };

const store = configureStore({});
render(
  <Provider store={store}>
    <App/>
  </Provider>,
  document.getElementById('root')
);
