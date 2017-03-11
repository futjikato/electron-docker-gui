// @flow
export type PortMapping = {
  protocol: string,
  port: number,
  hostPort: ?number
};

export type VolumeType = {
  container: string,
  host: ?string
};

export default class Container {
  id: ?string;
  command: string;
  status: string = 'Unknown';
  imageRef: string;
  isRunning: boolean = false;
  createdDate: ?Date;
  ports: Array<PortMapping> = [];
  volumes: Array<VolumeType> = [];

  constructor(command: string, imageRef: string) {
    this.command = command;
    this.imageRef = imageRef;
  }

  setPort(portData: PortMapping) {
    let hasReplaced = false;
    this.ports.map((port: PortMapping) => {
      if (port.protocol === portData.protocol && port.port === portData.port) {
        hasReplaced = true;

        return portData;
      }
      return port;
    });
    if (!hasReplaced) {
      this.ports.push(portData);
    }
  }

  setVolume(volumeData: VolumeType) {
    let hasReplaced = false;
    this.volumes.map((volume: VolumeType) => {
      if (volume.container === volumeData.container) {
        hasReplaced = true;

        return volumeData;
      }
      return volume;
    });
    if (!hasReplaced) {
      this.volumes.push(volumeData);
    }
  }
}
