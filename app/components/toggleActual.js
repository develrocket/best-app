import React, {Component, PropTypes} from 'react';
import uuid from 'uuid';
import '../styles/toggleUnit.scss';

export default class ToggleActual extends Component {
    static propTypes = {
        onChange: PropTypes.func.isRequired,
        toggled: PropTypes.bool.isRequired,
        disabled: PropTypes.bool,
    };

    static defaultProps = {
        disabled: false,
    };

    handleChange = (e, value) => {
        const {onChange} = this.props;
        if (onChange) {
            onChange(e.target.checked);
        }
    };

    render() {
        const {props, handleChange} = this;
        const {label, toggled, disabled} = props;
        const inputId = uuid();

        // console.log(disabled);

        return (
            <div className="toggleContainer">
                <div className="toggleLabelUnit">actual</div>
                <div className="toggleSwitch">
                    <input
                        id={inputId}
                        type="checkbox"
                        className="tgl tgl-light"
                        disabled={disabled}
                        onChange={handleChange}
                        checked={toggled}
                    />
                    <label
                        htmlFor={inputId}
                        className="tgl-btn"
                    >
                    </label>
                </div>
                <div className="toggleLabelUnit">variance</div>
            </div>
        );
    }
}
