// @flow
export default class Container {
  id: ?string;
  command: string;
  status: string = 'Unknown';
  imageRef: string;
  isRunning: boolean = false;
  createdDate: ?Date;
  knownPorts: {[id: string]: number}  = {};
  knownVolumes: {[id: string]: number} = {};

  constructor(command: string, imageRef: string) {
    this.command = command;
    this.imageRef = imageRef;
  }
}
