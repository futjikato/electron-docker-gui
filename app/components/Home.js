// @flow
import React, { Component } from 'react';
import { Link } from 'react-router';
import styles from './Home.css';
import Container from './../struct/Container';
import Image from './../struct/Image';

export default class Home extends Component {

  props: {
    containers: Array<Container>,
    images: Array<Image>,
    loadImage: () => void,
    loadContainer: () => void,
  };

  componentWillMount() {
    this.props.loadImage();
    this.props.loadContainer();
  }

  render() {
    return (
      <div className={styles.container+" uk-flex"}>
        <div className="uk-flex-1">
          <h2>Images</h2>
          <ul>
            {this.props.images.map((image: Image) => {
              return (
                <li key={image.id}>{image.name}</li>
              );
            })}
          </ul>
        </div>
        <div className="uk-flex-1">
          <h2>Containers</h2>
          <ul>
            {this.props.containers.map((container: Container) => {
              return (
                <li key={container.id}>{container.imageRef}</li>
              );
            })}
          </ul>
        </div>
      </div>
    );
  }
}