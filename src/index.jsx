import 'core-js/fn/object/assign'
import React from 'react'
import {render} from 'react-dom'
import route from './router/route' //路由配置

import 'normalize.css'
import './styles/common.css'

// Render the main component into the dom
render(
  <div>{route}</div>
  , document.getElementById('app'))
