// @flow
import React, { Component } from 'react';
import { Link } from 'react-router';

export default class App extends Component {
  props: {
    children: HTMLElement
  };

  render() {
    return (
      <div className="app-root uk-flex">
        <ul className="uk-nav uk-flex-none">
          <li className="uk-active">
            <Link className="" to="/">Dashboard</Link>
          </li>
          <li>
            <Link className="" to="/images">Images</Link>
          </li>
          <li>
            <Link className="" to="/containers">Containers</Link>
          </li>
          <li>
            <a>Compose Projects</a>
          </li>
        </ul>
        <div className="uk-flex-1">
          {this.props.children}
        </div>
      </div>
    );
  }
}
