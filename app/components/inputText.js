import React, {Component, PropTypes} from 'react';
import classNames from 'classnames';
import '../styles/inputText.scss';

export default class InputText extends Component {
    static propTypes = {
        onChange: PropTypes.func.isRequired,
        label: PropTypes.string.isRequired,
        error: PropTypes.bool,
        value: PropTypes.string,
    };

    static defaultProps = {
        error: false,
        value: '',
    };

    handleChange = () => {
        const value = this.refs.inputValue.value;
        this.props.onChange(value);
    };

    render() {
        const {label, value} = this.props;
        const classInput = classNames({
            inputTextInput: true,
            inputTextInputError: value === ''
        });

        return (
            <div className="inputTextContainer">
                <div>
                    {label}
                </div>
                <input
                    ref="inputValue"
                    type="text"
                    value={value}
                    onChange={this.handleChange}
                    className={classInput}
                />
            </div>
        );
    }
}
