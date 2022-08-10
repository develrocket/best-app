import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import classNames from 'classnames';
import '../styles/inputText.scss';
import Button from './button';
import * as SettingsActions from '../actions/settings';

class ManualInputText extends Component {
    static propTypes = {
        label: PropTypes.string.isRequired,
        error: PropTypes.bool,
        fieldValue: PropTypes.string,
        manualField: PropTypes.array,
        showManualFieldsForm: PropTypes.func.isRequired,
        updateManualField: PropTypes.func.isRequired
    };

    static defaultProps = {
        error: false,
        value: '',
    };

    handleChange = e => {
        const {
            manualField,
            updateManualField
        } = this.props;

        // const value = this.refs.inputValue.value;
        const text_value = e.target.value;
        // manualField[this.props.index].mRValue = text_value;

        var data = {
            fieldValue: text_value,
            fieldIndex: this.props.index,
            manualField: manualField
        };

        updateManualField(data);
    };

    handleRemove = () => {
        const {
            manualField
        } = this.props;

        manualField.splice(this.props.index, 1);

        this.props.showManualFieldsForm(false);

        if (manualField.length > 0) {
            this.props.showManualFieldsForm(true);
        }else {
            this.props.showManualFieldsForm(false);
        }
    };

    render() {
        const {label, fieldValue} = this.props;
        const classInput = classNames({
            inputTextInput: true,
            inputTextInputError: fieldValue === ''
        });

        return (
            <div className="inputTextContainer">
                <div className="divManualField">
                    {label}
                    <Button
                        ref="delButton"
                        label="X"
                        onClick={this.handleRemove}/>
                </div>
                <input
                    type="text"
                    key={this.props.inputKey}
                    value={fieldValue}
                    onChange={this.handleChange}
                    className={classInput}
                />
            </div>
        );
    }
}

function mapStateToProps(state) {
    const {
        manualField,
        fieldValue
    } = state;

    return {
        manualField,
        fieldValue
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(SettingsActions, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(ManualInputText);
