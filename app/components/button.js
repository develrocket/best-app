import React, {Component, PropTypes} from 'react';
import '../styles/button.scss';

export default class Button extends Component {
    static propTypes = {
        label: PropTypes.string.isRequired,
        disabled: PropTypes.bool,
        onClick: PropTypes.func.isRequired
    };

    static defaultProps = {
        disabled: false
    };

    render() {
        const {label, onClick, disabled} = this.props;

        return (
            <button
                className="buttonContainer"
                onClick={onClick}
                disabled={disabled}
            >
                { label }
            </button>
        );
    }
}
