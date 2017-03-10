const {ipcRenderer} = require('electron');
import { setImage, setImageStatus, setImageSubmoduleStatus, finishImageLoad, deletedRef } from './../actions/image';
import transformImage, { ImageType } from './../handler/image';
import * as ipcConst from './../backend/constants';
import initContainerIpc from './channel/container';

type ImageCreateStatusType = {
  ref: string,
  success: ?boolean,
  status: {
    status: string,
    progressDetail: ?{
      current: ?number,
      total: ?number
    },
    progress: ?string,
    id: ?string
  }
};

type ImageCreateResponse = {
  ref: string,
  success: ?boolean,
  details: ?{
    Id: string
  }
};

export default function init(store) {
  ipcRenderer.on('containers', (event, arg) => {
    //store.dispatch(setContainer(args.containers));
    console.log('event->', event);
    console.log('arg->', arg);
  });
  ipcRenderer.on(ipcConst.RESPONSE_SET_IMAGES, (event, arg: Array<ImageType>) => {
    store.dispatch(setImage(arg.map(transformImage)));
  });
  ipcRenderer.on(ipcConst.RESPONSE_ADD_IMAGES, (event, arg: ImageCreateResponse) => {
    store.dispatch(finishImageLoad(arg.ref, arg.success, arg.details.Id.split(':').pop()));
  });
  ipcRenderer.on(ipcConst.RESPONSE_ADD_IMAGES_STATUS, (event, arg: ImageCreateStatusType) => {
    if (arg.status.id && arg.ref.indexOf(arg.status.id) === -1) {
      store.dispatch(setImageSubmoduleStatus(
        arg.ref,
        arg.status.id,
        arg.status.status,
        arg.status.progressDetail
      ));
    } else {
      store.dispatch(setImageStatus(arg.ref, arg.status.status));
    }
  });
  ipcRenderer.on(ipcConst.RESPONSE_REMOVE_IMAGES, (event, arg) => {
    store.dispatch(deletedRef(arg.ref));
  });
  ipcRenderer.on(ipcConst.RESPONSE_ERROR, (event, arg: string) => {
    console.error('IPC ERROR: ', arg);
  });

  initContainerIpc(store);
}