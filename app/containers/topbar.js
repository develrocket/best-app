import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as projectActions from '../actions/project';
import * as settingsActions from '../actions/settings';
import ConfirmDialog from '../components/confirmDialog';
import Button from '../components/button';
import '../styles/topbar.scss';
import {debugA, debugB} from '../utils/debug';

class Topbar extends Component {
    static propTypes = {
        pipeFields: PropTypes.object.isRequired,
        showSettings: PropTypes.func.isRequired,
        showManualFields: PropTypes.func.isRequired,
        showManualFieldsForm: PropTypes.func.isRequired,
        showProjectTable: PropTypes.func.isRequired,
        createProject: PropTypes.func.isRequired,
        deleteProject: PropTypes.func.isRequired,
        projectName: PropTypes.string.isRequired,
        projectList: PropTypes.array.isRequired,
        selectProject: PropTypes.func.isRequired,
        projectDialogShowFunc: PropTypes.func.isRequired,
        projectCreateDialogShowFunc: PropTypes.func.isRequired,
        projectSelected: PropTypes.string.isRequired,
        settingsOutputA: PropTypes.string,
        settingsOutputB: PropTypes.string,
        scanListA: PropTypes.array,
        scanListB: PropTypes.array,
        manualField: PropTypes.array
    };

    constructor(props) {
        super(props);
        this.state = {
            open: false,
            disableButtonProject: true,
            selectProject: false
        };
    }

    handleDeleteProject = () => {
        this.props.deleteProject();
    };

    handleDeleteButton = () => {
        this.refs.confirmDialog.toggle(
            `Are you sure you want to delete project: ${this.props.projectName}`
        );
    };

    handleShowManualFields = () => {
        this.props.showManualFields(true);
        this.props.showManualFieldsForm(false);
    };

    handleShowSettings = () => {
        this.props.showSettings(true);
    };

    handleCreateProject = () => {
        this.props.projectCreateDialogShowFunc(true);
    };

    handleProjectMenu = () => {
        // console.log('handle-project-menu');
        // console.log(this.props.projectList);
        this.props.showProjectTable(false);
        this.props.showProjectTable(true);
        this.props.projectDialogShowFunc(true);
    };

    handleRequestClose = () => {
        this.setState({
            selectProject: false
        });
    };

    render() {
        const {projectName} = this.props;
        const disableDeleteProject = (this.props.projectSelected === '') ? true : false;

        return (
            <div className="topbarContainer">
                <div className="topbarContainerLeft">
                    <div className="topbarButtonDebug">
                        <Button
                            label="A"
                            onClick={() => debugA(this.props.settingsOutputA, this.props.scanListA, this.props.manualField, this.props.pipeFields)}/>
                    </div>
                    <div className="topbarButtonDebug">
                        <Button
                            label="B"
                            onClick={() => debugB(this.props.settingsOutputB, this.props.scanListB, this.props.manualField, this.props.pipeFields)}/>
                    </div>
                    <div className="topbarButtonDebug">
                        <Button
                            label = "Manual Fields"
                            onClick = {this.handleShowManualFields}/>
                    </div>
                    <div className="topbarButtonSettings">
                        <Button
                            label="Settings"
                            onClick={this.handleShowSettings}
                        />
                    </div>
                    <Button
                        label="New Project"
                        onClick={this.handleCreateProject}
                    />
                </div>
                <div className="topbarContainerRight">
                    <div className="topbarProjectName">
                        { projectName }
                    </div>
                    <Button
                        label="Select Project"
                        onClick={this.handleProjectMenu}
                    />
                    <Button
                        label="Delete Project"
                        disabled={disableDeleteProject}
                        onClick={this.handleDeleteButton}
                    />
                </div>
                <ConfirmDialog
                    ref="confirmDialog"
                    title="Confirm Project Delete"
                    onOk={this.handleDeleteProject}
                />
            </div>
        );
    }
}

function mapStateToProps(state) {
    const {
        projectList,
        projectSelected,
        projectName,
        settingsOutputA,
        settingsOutputB,
        scanListA,
        scanListB,
        manualField,
        pipeFields
    } = state;

    //Added by Jerome
    // console.log(state);

    return {
        projectList,
        projectSelected,
        projectName,
        settingsOutputA,
        settingsOutputB,
        scanListA,
        scanListB,
        manualField,
        pipeFields
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        ...projectActions,
        ...settingsActions
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Topbar);
