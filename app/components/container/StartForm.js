// @flow
import React, { Component } from 'react';
import Container, { PortMapping, VolumeType } from './../../struct/Container';

export default class StartForm extends Component {

  props: {
    startContainer: (id: string) => void,
    cancelStartContainer: () => void,
    setPort: (containerId: string, protocol: string, port: number, hostPort: ?string) => void,
    setVolume: (containerId: string, containerVolume: string, bind: ?string) => void,
    container: ?Container
  };

  renderPortMappings() {
    if (!this.props.container) {
      return (
        <span>No ports</span>
      );
    }

    return this.props.container.ports.map((port: PortMapping) => {
      return (
        <div key={port.protocol+'/'+port.port}>
          <input type="number" defaultValue={port.hostPort} placeholder="Host Port"/>:{port.port}
        </div>
      );
    });
  }

  renderVolumeMapping() {
    if (!this.props.container) {
      return (
        <span>No Volumes</span>
      );
    }

    return this.props.container.volumes.map((vol: VolumeType) => {
      return (
        <div>
          <input type="text" defaultValue={vol.host} placeholder="Mount at host"/>:{vol.container}
        </div>
      );
    });
  }

  addPort() {
    const protocol = this.portProtocolSelect.value;
    const containerPort = parseInt(this.portContainer.value, 10);
    this.portContainer.value = '';
    this.props.setPort(this.props.container.id, protocol, containerPort);
  }

  addVolume() {
    const containerVolume = this.volumeContainer.value;
    this.volumeContainer.value = '';
    this.props.setVolume(this.props.container.id, containerVolume);
  }

  render() {
    let modalClasses = 'uk-modal';
    let modalStyles = {};
    if (this.props.container) {
      modalClasses += ' uk-open';
      modalStyles['display'] = 'block';
    }

    return (
      <div className={modalClasses} style={modalStyles}>
        <div className="uk-modal-dialog">
          <a onClick={this.props.cancelStartContainer} className="uk-modal-close uk-close">X</a>
          <h3>Container Mapping</h3>
          <div>
            <label>Port Mappings</label>
            {this.renderPortMappings()}
            <div>
              <select ref={(input) => {this.portProtocolSelect = input;}}>
                <option value="tcp">TCP</option>
                <option value="udp">UDP</option>
              </select>
              <input type="number" ref={(input) => {this.portContainer = input;}}/>
              <button onClick={this.addPort.bind(this)}>Add</button>
            </div>
          </div>
          <div>
            <label>Volume Mappings</label>
            {this.renderVolumeMapping()}
            <div>
              <input type="text" placeholder="Volume" ref={(input) => {this.volumeContainer = input;}}/>
              <button onClick={this.addVolume.bind(this)}>Add</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
