import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';

import index from '../components/Main';
import search from '../components/search';
import bookIntroduce from '../components/bookIntroduce';
import about from '../components/about';
import read from '../components/read';
import changeOrigin from '../components/changeOrigin';


const RouteConfig = () => (
  <Router>
    <Switch>
      <Route path="/" exact component={index} />
      <Route path="/search" exact component={search} />
      <Route path="/bookIntroduce/:id"  component={bookIntroduce} />
      <Route path="/about" exact component={about} />
      <Route path="/read/:id" exact component={read} />
      <Route path="/changeOrigin/:id" exact component={changeOrigin} />
      <Route component={index} />
    </Switch>
  </Router>
)


export default RouteConfig