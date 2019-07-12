import { createStore, applyMiddleware, combineReducers } from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';

import api from './api.js';
import router from './router.js';
import config from './config.js';
import homepage from './homepage/store.js';
import reportMatchResult from './report-match-result/store.js';
import playerStore from './shared/player-store.js';

const enhancer = applyMiddleware(thunk, logger);

const rootReducer = combineReducers({
    homepage,
    playerStore,
    api,
    router,
    reportMatchResult
});

export function resetStore() {
    return (dispatch) => {
        dispatch({ type: 'RESET_APP' });
    };
}

const appReducer = (state, action) => {
    if (action.type === 'RESET_APP') {
        state = {
            router: {
                page: config.defaultPage
            }
        };
    }

    return rootReducer(state, action);
};

export default createStore(appReducer, enhancer);