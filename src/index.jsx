import 'core-js/fn/object/assign';
import React from 'react';
import {render} from 'react-dom';
import Route from './router/route';
import {Provider} from 'react-redux';
import store from './redux/store/store';

import 'normalize.css';
import 'animate.css';
import './styles/common.css';
import './styles/common.less';


const app = document.getElementById('app');

store.subscribe(() => { //监听state变化
});


// Render the main component into the dom
render(
  <Provider store={store}>
    <Route />
  </Provider>
  , app)
