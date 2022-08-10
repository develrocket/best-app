// import fs from 'fs';
import { storeJSON } from './storeJSON';

export default store => next => action => {
  const state = store.getState();
  console.log('writing to state.json');

  storeJSON(state);
  // add adapter here
  //fs.writeFileSync('state.json', JSON.stringify(state));

  next(action);
};
