// @flow
import type { imageStateType, actionType } from '../reducers/image';
import Image from './../struct/Image';
import { CHANNEL_IMAGES, IMAGES_DELETE_ID, IMAGES_LOAD, IMAGES_CREATE_FROM } from './../backend/constants';
const { ipcRenderer } = require('electron');

export const SET_IMAGE = 'SET_IMAGE';
export const ADD_IMAGE = 'ADD_IMAGE';
export const FINISH_IMAGE = 'FINISH_IMAGE';
export const IMAGE_STATUS = 'IMAGE_STATUS';
export const IMAGE_SUBMODULE_STATUS = 'IMAGE_SUBMODULE_STATUS';
export const DELETE_IMAGE = 'DELETE_IMAGE';

const LOAD_REQUEST_BREAK = 60000;

export function setImage(image: Array<Image> = []): actionType {
  return {
    type: SET_IMAGE,
    image: image
  };
}

export function setImageStatus(reference: string, status: string): actionType {
  return {
    type: IMAGE_STATUS,
    ref: reference,
    status: status
  };
}

export function setImageSubmoduleStatus(
  reference: string,
  subModuleId: string,
  status: string,
  progress: ?{
    current: ?number,
    total: ?number
  }
) {
  let percentageProgress = 0;
  if (progress && progress.total > 0) {
    percentageProgress = progress.current / progress.total * 100;
  }

  return {
    type: IMAGE_SUBMODULE_STATUS,
    ref: reference,
    submoduleRef: subModuleId,
    status: status,
    progress: percentageProgress
  };
}

export function startImageLoad(ref: string): actionType {
  return {
    type: ADD_IMAGE,
    ref: ref
  };
}

export function finishImageLoad(ref: string, success: boolean, id: ?string) {
  return (dispatch: () => void, getState: () => imageStateType) => {
    if (success) {
      dispatch({
        type: FINISH_IMAGE,
        ref: ref,
        id: id
      });
    } else {
      dispatch(deletedRef(ref));
    }
  }
}

export function loadImage() {
  return (dispatch: () => void, getState: () => imageStateType) => {
    const { image } = getState();

    if (image.lastLoad > (Date.now() - LOAD_REQUEST_BREAK)) {
      console.log('Just loaded images so skip this request', Date.now() - image.lastLoad, LOAD_REQUEST_BREAK);
      return;
    }

    ipcRenderer.send(CHANNEL_IMAGES, {type: IMAGES_LOAD});
  };
}

export function createImage(from: string, tag: string) {
  return (dispatch: () => void, getState: () => imageStateType) => {
    const { image } = getState();

    if (image.list.find((img: Image) => {
        return img.name === from+':'+tag;
      })) {
      console.log('image already found. dont build', from);
      return;
    }

    const ref = from+':'+tag;
    dispatch(startImageLoad(ref));
    ipcRenderer.send(CHANNEL_IMAGES, {type: IMAGES_CREATE_FROM, ref: ref, from: from, tag: tag});
  }
}

export function deleteImage(ref: string, id: string) {
  return (dispatch: () => void, getState: () => imageStateType) => {
    const { image } = getState();
    let foundImage;

    if (undefined === (foundImage = image.list.find((img: Image) => {
      return img.id === id;
    }))) {
      console.log('image id not found. do not send delete request.', id);
      return;
    }

    ipcRenderer.send(CHANNEL_IMAGES, {type: IMAGES_DELETE_ID, ref, id});
  }
}

export function deletedRef(reference: string): actionType {
  return {
    type: DELETE_IMAGE,
    ref: reference
  };
}