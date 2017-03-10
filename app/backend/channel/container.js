// @flow
import * as ipcConst from './../constants';
import { doRequest } from './../ipc';
const { ipcMain } = require('electron');

export default function init() {
  ipcMain.on(ipcConst.CHANNEL_CONTAINERS, async(event, arg) => {
    switch (arg.type) {
      case ipcConst.CONTAINERS_LOAD:
        try {
          const responses = await doRequest({method: 'get', resource: '/containers/json', query: {all: true}});
          event.sender.send(ipcConst.RESPONSE_SET_CONTAINERS, responses.pop());
        } catch (e) {
          event.sender.send(ipcConst.RESPONSE_ERROR, e.toString());
        }
        break;

      case ipcConst.CONTAINERS_STOP:
        try {
          // returns 204 on success
          await doRequest({method: 'post', resource: '/containers/'+arg.id+'/stop', query: {t: 30}});
          event.sender.send(ipcConst.RESPONSE_STOPPED_CONTAINER, {
            id: arg.id
          });
        } catch (e) {
          event.sender.send(ipcConst.RESPONSE_ERROR, e.toString());
        }
        break;

      case ipcConst.CONTAINERS_START:
        try {
          // returns 204 on success
          await doRequest({method: 'post', resource: '/containers/'+arg.id+'/start'});
          event.sender.send(ipcConst.RESPONSE_STARTED_CONTAINER, {
            id: arg.id
          });
        } catch (e) {
          event.sender.send(ipcConst.RESPONSE_ERROR, e.toString());
        }
        break;

      case ipcConst.CONTAINERS_CREATE:
        try {
          const resp = await doRequest({method: 'post', resource: '/containers/create', body: {
            "Image": arg.imageRef,
            "Cmd": arg.cmd
          }});
          event.sender.send(ipcConst.RESPONSE_CREATED_CONTAINER, {
            newId: resp.Id
          });
        } catch (e) {
          event.sender.send(ipcConst.RESPONSE_ERROR, e.toString());
        }
        break;
    }
  });
}
