// @flow
import { SET_CONTAINER, STOP_CONTAINER, START_CONTAINER } from '../actions/container';
import Container from './../struct/Container';

type InnerContainerStateType = {
  list: Array<Container>,
  lastLoad: number
};

export type containerStateType = {
  container: InnerContainerStateType
};

export type actionType = {
  type: string,
  container: ?Array<Container>,
  id: ?string
};

export default function container(state: InnerContainerStateType = {
  list: [],
  lastLoad: 0
}, action: actionType) {
  switch (action.type) {
    case SET_CONTAINER:
      return Object.assign({}, state, {
        list: action.container,
        lastLoad: Date.now()
      });
    case STOP_CONTAINER:
      return Object.assign({}, state, {
        list: state.list.map((container: Container) => {
          if (container.id === action.id) {
            container.isRunning = false;
            container.status = 'exit';
          }

          return container;
        })
      });

    case START_CONTAINER:
      return Object.assign({}, state, {
        list: state.list.map((container: Container) => {
          if (container.id === action.id) {
            container.isRunning = true;
            container.status = 'running';
          }

          return container;
        })
      });
    default:
      return state;
  }
}
