import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Modal from '../components/modal';
import * as SettingsActions from '../actions/settings';
import DynamicField from '../components/dynamicField';
import '../styles/reactModal.scss';
import '../styles/settings.scss';
import {
    MANUAL_FIELD
} from '../constants/actionTypes';

const dialog = require('electron').remote.dialog;

class ManualFields extends Component {
    static propTypes = {
        settingsSetWatch: PropTypes.func.isRequired,
        showManualFields: PropTypes.func.isRequired,
        showManualFieldsForm: PropTypes.func.isRequired,
        manualFieldsShow: PropTypes.bool.isRequired,
        settingsWatchA: PropTypes.string,
        settingsWatchB: PropTypes.string,
        manualField: PropTypes.array
    };

    handleClose = () => {

        const {
            manualField,
            settingsWatchA,
            settingsWatchB
        } = this.props;

        this.props.showManualFields(false);
        this.props.settingsSetWatch(settingsWatchA, 'a', manualField);
        this.props.settingsSetWatch(settingsWatchB, 'b', manualField);

        if (manualField.length > 0) {
            this.props.showManualFieldsForm(true);
        }else {
            this.props.showManualFieldsForm(false);
        }
    };

    render() {
        const {
            props,
            handleClose
        } = this;
        const {
            manualFieldsShow
        } = props;

        return (
            <Modal
                title="Manual Fields"
                isOpen={manualFieldsShow}
                onRequestClose={handleClose}>

                <div id="react-dynamic-fields">
                    <DynamicField
                        actionName={'Add an additional field'}/>
                </div>

            </Modal>
        );
    }
}

function mapStateToProps(state) {
    const {
        manualFieldsShow,
        manualField,
        settingsWatchA,
        settingsWatchB
    } = state;

    return {
        manualFieldsShow,
        manualField,
        settingsWatchA,
        settingsWatchB
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(SettingsActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ManualFields);
