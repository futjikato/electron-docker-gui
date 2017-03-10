// @flow
import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './containers/App';
import HomePage from './containers/HomePage';
import ImagePage from './containers/ImagePage';
import ContainerPage from './containers/ContainerPage';


export default (
  <Route path="/" component={App}>
    <IndexRoute component={HomePage} />
    <Route path="/images" component={ImagePage} />
    <Route path="/containers" component={ContainerPage} />
  </Route>
);
