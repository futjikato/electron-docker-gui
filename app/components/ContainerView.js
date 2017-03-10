// @flow
import React, { Component } from 'react';
import Container from './../struct/Container';
import Image from './../struct/Image';
import CreateForm from './container/CreateForm';

export default class ContainerView extends Component {

  props: {
    loadContainer: () => void,
    stopContainer: (id: string) => void,
    startContainer: (id: string) => void,
    deleteContainer: (id: string) => void,
    createContainer: (imageRef: string, cmd: string) => void,
    containers: Array<Container>,
    images: Array<Image>
  };

  constructor(props) {
    super(props);
    this.state = {
      startContainerId: undefined
    };
  }

  componentWillMount() {
    this.props.loadContainer();
  }

  initContainerStart(cId: string) {
    if (this.state.startContainerId) {
      return;
    }

    this.setState({
      startContainerId: cId
    });
  }

  cancelContainerStart() {
    this.setState({
      startContainerId: undefined
    });
  }

  renderContainer(container: Container) {
    let actionButtons = [];
    if (container.isRunning) {
      actionButtons.push(
        <button
          key={container.id+"_btn_stop"}
          onClick={this.props.stopContainer.bind(this, container.id)}
          className="uk-button uk-button-danger uk-button-small"
        >
          Stop
        </button>
      );
    } else {
      actionButtons.push(
        <button
          key={container.id+"_btn_start"}
          onClick={this.initContainerStart.bind(this, container.id)}
          className="uk-button uk-button-primary uk-button-small"
        >
          Start
        </button>
      );
      actionButtons.push(
        <button
          key={container.id+"_btn_delete"}
          onClick={this.props.deleteContainer.bind(this, container.id)}
          className="uk-button uk-button-danger uk-button-small"
        >
          <i className="fa fa-trash"/>
          Delete
        </button>
      )
    }

    return (
      <tr key={container.id}>
        <td>{container.status}</td>
        <td>{container.imageRef}</td>
        <td>{container.command}</td>
        <td>{actionButtons}</td>
      </tr>
    );
  }

  render() {
    let modalClasses = 'uk-modal';
    let modalStyles = {};
    if (this.state.startContainerId) {
      modalClasses += ' uk-open';
      modalStyles['display'] = 'block';
    }

    return (
      <div>
        <h2>Containers</h2>
        <button className="uk-button uk-button-secondary" onClick={this.props.loadContainer}>Reload containers</button>
        <table className="uk-table">
          <thead>
          <tr>
            <th>Status</th>
            <th>Image</th>
            <th>Command</th>
            <th/>
          </tr>
          </thead>
          <tbody>
          {this.props.containers.map(this.renderContainer.bind(this))}
          </tbody>
        </table>
        <CreateForm images={this.props.images} createContainer={this.props.createContainer}/>
        <div className={modalClasses} style={modalStyles}>
          <div className="uk-modal-dialog">
            <a onClick={this.cancelContainerStart.bind(this)} className="uk-modal-close uk-close">X</a>
            <h3>Container Mapping</h3>
            <div>
              <label>Port Mappings</label>
              <div>
                <input type="text"/>:????
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
