// @flow
import * as ipcConst from './constants';
import initContainerIpc from './channel/container';
const {ipcMain} = require('electron');
const querystring = require('querystring');
const request = require('request').defaults({
  headers: {
    'Host': 'docker.sock',
    'Content-Type': 'application/json'
  }
});

async function responseHandler(response, statusCallback: ?(status: string) => void): Promise {
  return new Promise((resolve, reject) => {
    let responseStr = '';
    let responsePackages = [];
    response.on('data', (buf: Buffer) => {
      responseStr += buf.toString();
      try {
        let responsePkg = JSON.parse(responseStr);
        handleResponsePackage(responsePkg, statusCallback);
        responsePackages.push(responsePkg);
        responseStr = '';
      } catch (e) {
        console.log('received incomplete buffer', e);
      }
    });
    response.on('end', () => {
      console.log('request finished');
      if (response.statusCode === 204) {
        resolve();
      } else if (response.statusCode === 200 || response.statusCode === 201) {
        resolve(responsePackages);
      } else {
        console.log(response.statusCode, responsePackages.pop());
        reject(responsePackages.pop());
      }
    });
  });
}

function handleResponsePackage(respPkg, statusCallback: ?(status: string) => void) {
  if (statusCallback && respPkg.hasOwnProperty('status')) {
    statusCallback(respPkg);
  }
}

type RequestType = {
  method: string,
  resource: string,
  query: ?Object,
  body: ?Object,
  statusCallback: ?(status: string) => void
};

export async function doRequest(options: RequestType): Promise {
  return new Promise((resolve) => {
    let url = 'http://unix:/var/run/docker.sock:/v1.26'+options.resource;
    if (options.query) {
      url += '?'+querystring.stringify(options.query);
    }
    let opts = {
      method: options.method,
      url: url,
      body: (options.body ? JSON.stringify(options.body) : undefined)
    };
    console.log(options.method, url);
    request(opts).on('response', (response) => {
      resolve(responseHandler(response, options.statusCallback));
    });
  });
}

export default function init() {
  ipcMain.on(ipcConst.CHANNEL_IMAGES, async (event, arg) => {
    switch (arg.type) {
      case ipcConst.IMAGES_LOAD:
        try {
          const responses = await doRequest({method: 'get', resource: '/images/json'});
          event.sender.send(ipcConst.RESPONSE_SET_IMAGES, responses.pop());
        } catch (e) {
          event.sender.send(ipcConst.RESPONSE_ERROR, e.toString());
        }
        break;

      case ipcConst.IMAGES_CREATE_FROM:
        const reference = arg.ref;
        try {
          await doRequest({
            method: 'post',
            resource: '/images/create',
            query: {
              fromImage: arg.from,
              tag: arg.tag
            },
            statusCallback: (status) => {
              event.sender.send(ipcConst.RESPONSE_ADD_IMAGES_STATUS, {ref: reference, status: status});
            }
          });
          const inspectResponses = await doRequest({method: 'get', resource: '/images/'+arg.from+'%3A'+arg.tag+'/json'});
          const details = inspectResponses.pop();
          event.sender.send(ipcConst.RESPONSE_ADD_IMAGES, {ref: reference, details: details, success: true});
        } catch (e) {
          event.sender.send(ipcConst.RESPONSE_ADD_IMAGES, {ref: reference, success: false});
          event.sender.send(ipcConst.RESPONSE_ERROR, e.toString());
        }
        break;

      case ipcConst.IMAGES_DELETE_ID:
        try {
          await doRequest({
            method: 'delete',
            resource: '/images/'+arg.id,
          });
          event.sender.send(ipcConst.RESPONSE_REMOVE_IMAGES, {ref: arg.ref, success: true});
        } catch (e) {
          if (e.message) {
            event.sender.send(ipcConst.RESPONSE_ERROR, {message: e.message});
          } else {
            event.sender.send(ipcConst.RESPONSE_ERROR, {message: e.toString()});
          }

        }
        break;
    }
  });

  initContainerIpc();
}