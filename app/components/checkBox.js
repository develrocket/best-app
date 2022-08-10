import React, { Component, PropTypes } from 'react';

export default class CheckBox extends Component {
  static propTypes = {
    checked: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    label: PropTypes.string,
  }

  static defaultProps = {
    label: '',
    checked: false,
  }

  handleChange = e => {
    const { checkBox } = this.refs;
    this.props.onChange(checkBox.checked)
  }

  render() {
    const {
      label,
      onChange,
      checked,
    } = this.props;

    return (
      <div className="checkBoxContainer">
        <input
          ref="checkBox"
          type="checkbox"
          className="checkBoxInput"
          onChange={this.handleChange}
          checked={checked}
        />
        {label}
      </div>
    );
  }
}
