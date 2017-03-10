// @flow
import React, { Component } from 'react';
import Image from './../../struct/Image';

export default class ContainerView extends Component {

  props: {
    createContainer: (imageRef: string, cmd: string) => void,
    images: Array<Image>
  };

  constructor(props) {
    super(props);

    this.state = {
      portMappings: [''],
      volumeMapping: ['']
    }
  }

  createContainer()  {
    let imageRef = this.createContainerImageSelect.value;
    if (!imageRef) {
      return;
    }

    let command = this.createCommand.value;

    this.props.createContainer(imageRef, command);
    this.createContainerImageSelect.value = "";
  }

  addPortMapping() {
    this.setState({
      portMappings: this.state.portMappings.concat([''])
    });
  }

  addVolumeMapping() {
    this.setState({
      portMappings: this.state.portMappings.concat([''])
    });
  }

  render() {
    return (
      <div className="uk-form">
        <div className="uk-form-row">
          <select defaultValue="" ref={(input) => { this.createContainerImageSelect = input; }}>
            <option key="cc_empty" value="">-- Select image --</option>
            {this.props.images.map((image: Image) => {
              return (
                <option key={image.id+"_option"} value={image.name}>{image.name}</option>
              );
            })}
          </select>
        </div>
        <div className="uk-form-row">
          <input type="text" ref={(input) => { this.createCommand = input; }} placeholder="Command"/>
        </div>
        <div className="uk-form-row">
          <label>Exposed ports</label>
          {this.state.portMappings.map((str, i) => {
            return (
              <div>
                <input key={i} type="number" placeholder="Port to expose"/>
              </div>
            );
          })}
          <button onClick={this.addPortMapping.bind(this)}>+</button>
        </div>
        <div className="uk-form-row">
          <label>Volumes</label>
          {this.state.volumeMapping.map((str, i) => {
            return (
              <div>
                <input key={i} type="text" placeholder="Path in Container"/>
              </div>
            );
          })}
          <button onClick={this.addVolumeMapping.bind(this)}>+</button>
        </div>
        <button onClick={this.createContainer.bind(this)}>Create container</button>
      </div>
    );
  }
}
