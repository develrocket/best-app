import React, { Component, PropTypes } from 'react';
import '../styles/group.scss';

export default class Group extends Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    children: PropTypes.any
  }

  render() {
    return (
    <div className="groupContainer">
      <div className="groupHeaderBlock">
        <div className="groupHeaderBlockCell">{ this.props.label }</div>
      </div>
      <div>
        { this.props.children }
      </div>
  </div>
  );
  }
}
