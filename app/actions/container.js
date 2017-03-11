// @flow
import type { containerStateType, actionType } from '../reducers/container';
import * as ipcConst from './../backend/constants';
const { ipcRenderer } = require('electron');
import Container from './../struct/Container';

export const SET_CONTAINER = 'SET_CONTAINER';
export const STOP_CONTAINER = 'STOP_CONTAINER';
export const START_CONTAINER = 'START_CONTAINER';
export const SET_PORT = 'SET_PORT';
export const SET_VOLUME = 'SET_VOLUME';

const LOAD_REQUEST_BREAK = 60000;

export function setContainer(container: Array<Container> = []): actionType {
  return {
    type: SET_CONTAINER,
    container: container
  };
}

export function loadContainer() {
  return (dispatch: () => void, getState: () => containerStateType) => {
    const { container } = getState();

    if (container.lastLoad > (Date.now() - LOAD_REQUEST_BREAK)) {
      console.log('Just loaded containers so skip this request', Date.now() - container.lastLoad, LOAD_REQUEST_BREAK);
      return;
    }

    ipcRenderer.send(ipcConst.CHANNEL_CONTAINERS, {type: ipcConst.CONTAINERS_LOAD});
  };
}

export function stopContainer(id: string) {
  return (dispatch: () => void, getState: () => containerStateType) => {
    ipcRenderer.send(ipcConst.CHANNEL_CONTAINERS, {
      id,
      type: ipcConst.CONTAINERS_STOP
    });
  }
}

export function setStopped(id: string) {
  return {
    type: STOP_CONTAINER,
    id
  };
}

export function startContainer(id: string) {
  return (dispatch: () => void, getState: () => containerStateType) => {
    ipcRenderer.send(ipcConst.CHANNEL_CONTAINERS, {
      type: ipcConst.CONTAINERS_START,
      id
    });
  }
}

export function setStarted(id: string) {
  return {
    type: START_CONTAINER,
    id
  };
}

export function deleteContainer(id: string) {
  return (dispatch: () => void, getState: () => containerStateType) => {
    ipcRenderer.send(ipcConst.CHANNEL_CONTAINERS, {
      type: ipcConst.CONTAINERS_DELETE,
      id
    });
  }
}

export function createContainer(imageRef: string, cmd: string) {
  return (dispatch: () => void, getState: () => containerStateType) => {
    ipcRenderer.send(ipcConst.CHANNEL_CONTAINERS, {
      type: ipcConst.CONTAINERS_CREATE,
      imageRef,
      cmd
    });
  }
}

export function setPort(containerId: string, protocol: string, port: number, hostPort: ?string) {
  return {
    type: SET_PORT,
    id: containerId,
    protocol,
    port,
    hostPort
  };
}

export function setVolume(containerId: string, containerVolume: string, bind: ?string) {
  return {
    type: SET_VOLUME,
    id: containerId,
    volume: containerVolume,
    volumeBind: bind
  }
}
