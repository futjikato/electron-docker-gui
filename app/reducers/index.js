// @flow
import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import container from './container';
import image from './image';

const rootReducer = combineReducers({
  container,
  image,
  routing
});

export default rootReducer;
