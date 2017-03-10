// @flow
import React, { Component } from 'react';
import Image from './../struct/Image';

export default class ImageView extends Component {

  props: {
    loadImage: () => void,
    deleteImage: () => void,
    createImage: (from: string, tag: string) => void,
    images: Array<Image>
  };

  componentWillMount() {
    this.props.loadImage();
  }

  createImage() {
    let tag = 'latest';
    let from = this.createImageInput.value;
    if (from.indexOf(':') >= 0) {
      tag = from.substr(from.indexOf(':') + 1);
      from = from.substr(0, from.indexOf(':'));
    }

    this.props.createImage(from, tag);
    this.createImageInput.value = "";
  }

  renderImage(image: Image) {
    let actionsButtons = [];
    if (image.id) {
      actionsButtons.push(
        <button
          key={image.name+"_btn_delete"}
          onClick={this.props.deleteImage.bind(this, image.name, image.id)}
          className="uk-button uk-button-danger uk-button-small"
        >
          <i className="fa fa-trash"/>
          Delete
        </button>
      );
    }

    let statusDetails;
    if (image.submodules.length > 0) {
      statusDetails = (
        <table className="uk-table uk-table-small">
          <thead>
          <tr>
            <td>ID</td>
            <td>Status</td>
            <td>Progress</td>
          </tr>
          </thead>
          <tbody>
          {image.submodules.map((subModule: {
            id: string,
            status: string,
            progress: number
          }, i: number) => {
            return (
              <tr key={subModule.id+'_'+i}>
                <td>{subModule.id}</td>
                <td>{subModule.status}</td>
                <td>
                  <progress className="uk-progress" value={Math.floor(subModule.progress)} max="100">
                    {Math.floor(subModule.progress)}%
                  </progress>
                </td>
              </tr>
            );
          })}
          </tbody>
        </table>
      );
    }

    return (
      <tr key={image.name}>
        <td>{image.name}</td>
        <td>
          {image.status}
          {statusDetails}
        </td>
        <td>{actionsButtons}</td>
      </tr>
    );
  }

  render() {
    return (
      <div>
        <h2>Images</h2>
        <button className="uk-button uk-button-secondary" onClick={this.props.loadImage}>Reload images</button>
        <table className="uk-table">
          <thead>
          <tr>
            <th>Name</th>
            <th>Status</th>
            <th/>
          </tr>
          </thead>
          <tbody>
          {this.props.images.map(this.renderImage.bind(this))}
          </tbody>
        </table>
        <div>
          <input ref={(input) => { this.createImageInput = input; }} placeholder="Image:version"/>
          <button onClick={this.createImage.bind(this)}>Pull image</button>
        </div>
      </div>
    )
  }
}