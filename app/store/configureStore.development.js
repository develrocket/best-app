import {createStore, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import persistState from 'redux-localstorage';
import mergePersistedState from 'redux-localstorage/lib/mergePersistedState';
import filter from 'redux-localstorage-filter';
import rootReducer from '../reducers';
import adapter from '../db/adapterJSON';

const reducer = compose(
    mergePersistedState(),
)(rootReducer);

const storage = compose(
    filter([
        'settingsWatchA',
        'settingsWatchB',
        'settingsOutputA',
        'settingsOutputB',
        'projectSelected',
        'pipeFields',
        'pipeListSort',
    ])
)(adapter('database/settings.json'));

const enhancer = compose(
    persistState(storage, 'BEST'),
    applyMiddleware(thunk),
    window.devToolsExtension ?
        window.devToolsExtension() : noop => noop,
);

export default function configureStore(initialState) {
    const store = createStore(reducer, initialState, enhancer);

    if (module.hot) {
        module.hot.accept('../reducers', () =>
            store.replaceReducer(require('../reducers'))
        );
    }

    return store;
}
