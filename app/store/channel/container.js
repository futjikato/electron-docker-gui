import * as ipcConst from './../../backend/constants';
import * as containerActions from './../../actions/container';
import transformContainer from './../../handler/container';
const { ipcRenderer } = require('electron');

export default function init(store) {
  ipcRenderer.on(ipcConst.RESPONSE_SET_CONTAINERS, (event, arg) => {
    store.dispatch(containerActions.setContainer(arg.map(transformContainer)));
  });
  ipcRenderer.on(ipcConst.RESPONSE_STOPPED_CONTAINER, (event, arg) => {
    store.dispatch(containerActions.setStopped(arg.id));
  });
  ipcRenderer.on(ipcConst.RESPONSE_STARTED_CONTAINER, (event, arg) => {
    store.dispatch(containerActions.setStarted(arg.id));
  });
}