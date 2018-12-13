import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {routerReducer, routerMiddleware} from 'react-router-redux';
import {composeWithDevTools} from 'redux-devtools-extension';
import {i18nState} from 'redux-i18n';
import user from 'redux/modules/user';
import createHistory from 'history/createBrowserHistory';
//import Reactotron from '../ReactotronConfig';


const history = createHistory()

const middlewares = [thunk, routerMiddleware(history)];


const env = process.env.NODE_ENV;

if(env === 'development'){
    const {logger} = require('redux-logger');
    middlewares.push(logger);
}


const reducer = combineReducers({
    user,
    routing: routerReducer,
    i18nState
})

let store;
if(env === 'development'){
    store = initialState => createStore(reducer, composeWithDevTools(applyMiddleware(...middlewares)))
}else{

    store = initialState => createStore(reducer, applyMiddleware(...middlewares))
}

export {history};
export default store();