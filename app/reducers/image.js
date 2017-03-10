// @flow
import * as imageActions from '../actions/image';
import Image from './../struct/Image';

type InnerState = {
  list: Array<Image>,
  lastLoad: number
};

export type imageStateType = {
  image: InnerState
};

export type actionType = {
  type: string,
  image: ?Array<Image>,
  status: ?string,
  ref: ?string,
  id: ?string,
  submoduleRef: ?string,
  progress: ?number
};

export default function image(state: InnerState = {
  list: [],
  lastLoad: 0
}, action: actionType): InnerState {
  switch (action.type) {
    case imageActions.SET_IMAGE:
      return Object.assign({}, state, {
        list: action.image,
        lastLoad: Date.now()
      });
    case imageActions.IMAGE_STATUS:
      return Object.assign({}, state, {list: state.list.map((image) => {
        if (image.name == action.ref) {
          image.status = action.status;
        }
        return image;
      })});
    case imageActions.ADD_IMAGE:
      let newImage = new Image(action.ref);
      return Object.assign({}, state, {list: state.list.concat([newImage])});
    case imageActions.FINISH_IMAGE:
      return Object.assign({}, state, {list: state.list.map((image) => {
        if (image.name == action.ref) {
          image.finishLoading(action.id);
        }
        return image;
      })});
    case imageActions.IMAGE_SUBMODULE_STATUS:
      return Object.assign({}, state, {list: state.list.map((image) => {
        if (image.name == action.ref) {
          image.setSubmoduleState(action.submoduleRef, action.status, action.progress);
        }
        return image;
      })});
    case imageActions.DELETE_IMAGE:
      return Object.assign({}, state, {list: state.list.filter((image) => {
        return (image.name !== action.ref);
      })});
    default:
      return state;
  }
}
