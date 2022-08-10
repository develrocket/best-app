import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import '../styles/field.scss';
import * as SettingsActions from '../actions/settings';

class Field extends Component {

    static propTypes = {
        manualField: PropTypes.array,
        fieldValue: PropTypes.string,
        addManualField: PropTypes.func.isRequired
    };

    handleRemoveClick = e => {
        e.preventDefault();
        var parentDiv = e.target.parentNode.parentNode;
        parentDiv.parentNode.removeChild(parentDiv);
    };

    handleChange = e => {
        const {
            manualField,
            addManualField
        } = this.props;

        const fieldData = {
            fieldIndex: this.props.index,
            mKey: e.target.value.replace(' ', '_'),
            mValue: e.target.value,
            fieldValue: e.target.value,
            manualField: manualField
        };

        addManualField(fieldData);
    };

    render() {
        return (
            <div className="input-prepend">
                <div className="add-item">
                    <div className="input-box">
                        <input type="text"
                               name="manualField"
                               onChange={this.handleChange}
                               key={this.props.inputKey}
                               value={this.props.fieldValue}/>
                    </div>
                </div>
                <a href="" className="delete" onClick={this.handleRemoveClick}>
                    <i className="icon icon-times"></i>
                </a>
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


export default connect(mapStateToProps, mapDispatchToProps)(Field);
