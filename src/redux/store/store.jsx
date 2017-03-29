import {createStore, combineReducers, applyMiddleware} from 'redux';
import * as reducer from '../reducer/index';
import thunk from 'redux-thunk';

//创建一个 Redux store 来以存放应用中所有的 state，应用中应有且仅有一个 store。
const  store = createStore(
  combineReducers(reducer),
  applyMiddleware(thunk)
);


export default store;