import * as containerActions from './container';
import * as imageActions from './image';

const rootActions = {
  ...containerActions,
  ...imageActions
};

export default rootActions;