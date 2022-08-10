import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Modal from '../components/modal';
import * as SettingsActions from '../actions/settings';
import Button from '../components/button';
import '../styles/reactModal.scss';
import '../styles/settings.scss';

const dialog = require('electron').remote.dialog;

class Settings extends Component {
    static propTypes = {
        settingsSetWatch: PropTypes.func.isRequired,
        settingsSetOutput: PropTypes.func.isRequired,
        showSettings: PropTypes.func.isRequired,
        settingsShow: PropTypes.bool.isRequired,
        settingsWatchA: PropTypes.string.isRequired,
        settingsWatchB: PropTypes.string.isRequired,
        settingsOutputA: PropTypes.string.isRequired,
        settingsOutputB: PropTypes.string.isRequired,
        // settings: PropTypes.object.isRequired,
        manualField: PropTypes.array
    };

    setWatch = end => {
        const {
            manualField
        } = this.props;

        dialog.showOpenDialog({
                properties: ['openDirectory']
            },
            (directory) => {
                this.props.settingsSetWatch(directory[0], end, manualField);
            });
    };

    setOutput = end => {
        dialog.showOpenDialog({
                properties: ['openDirectory']
            },
            (directory) => {
                this.props.settingsSetOutput(directory[0], end);
            });
    };

    handleClose = () => {
        this.props.showSettings(false);
    };

    render() {
        const {
            props,
            handleClose,
            setWatch,
            setOutput
        } = this;
        const {
            settingsShow,
            settingsWatchA,
            settingsWatchB,
            settingsOutputA,
            settingsOutputB
        } = props;

        return (
            <Modal
                title="Watch Settings"
                isOpen={settingsShow}
                onRequestClose={handleClose}>
                <div className="settingsContainer">
                    <div>Pipe End A</div>
                    <div>
                        <div className="settingsSubContainer">
                            <Button
                                label="Set Watch Directory"
                                onClick={() => setWatch('a')}
                            />
                            <div>{settingsWatchA}</div>
                        </div>
                        <div className="settingsSubContainer">
                            <Button
                                label="Set Output Directory"
                                onClick={() => setOutput('a')}
                            />
                            <div>{settingsOutputA}</div>
                        </div>
                    </div>
                </div>
                <div className="settingsContainer">
                    <div>Pipe End B</div>
                    <div>
                        <div className="settingsSubContainer">
                            <Button
                                label="Set Watch Directory"
                                onClick={() => setWatch('b')}
                            />
                            <div>{settingsWatchB}</div>
                        </div>
                        <div className="settingsSubContainer">
                            <Button
                                label="Set Output Directory"
                                onClick={() => setOutput('b')}
                            />
                            <div>{settingsOutputB}</div>
                        </div>
                    </div>
                </div>
            </Modal>
        );
    }
}

function mapStateToProps(state) {
    const {
        settingsShow,
        settingsWatchA,
        settingsWatchB,
        settingsOutputA,
        settingsOutputB,
        manualField
    } = state;

    return {
        settingsShow,
        settingsWatchA,
        settingsWatchB,
        settingsOutputA,
        settingsOutputB,
        manualField
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(SettingsActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
