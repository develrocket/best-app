import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Table, Column, Cell} from 'fixed-data-table';
import Modal from '../components/modal';
import * as ProjectActions from '../actions/project';
import '../styles/projectDialog.scss';
import '../styles/fixed-data-table.scss';
import Button from '../components/button';
import ToggleUnit from '../components/toggleUnit';

class ProjectCreateDialog extends Component {
    static propTypes = {
        projectCreateDialogShow: PropTypes.bool.isRequired,
        projectList: PropTypes.array.isRequired,
        projectCreateDialogShowFunc: PropTypes.func.isRequired,
        inch: PropTypes.bool,
        projectMeter: PropTypes.func.isRequired,
        createProject: PropTypes.func.isRequired
    };

    static defaultProps = {
        inch: false
    };

    constructor(props) {
        super(props);
        this.state = {
            open: false,
            disableButtonProject: true
        };
    }

    checkProjectName = value => {
        if (value.toString().length <= 0) {
            return true;
        }

        const projectList = this.props.projectList;
        for (let i = 0, s = projectList.length; i < s; i++) {
            if (projectList[i].projectName.toLowerCase() === value.toLowerCase()) {
                return true;
            }
        }

        return false;
    };

    handleClose = () => {
        this.props.projectCreateDialogShowFunc(false);
    };

    handleProjectField = (event) => {
        this.setState({
            disableButtonProject: this.checkProjectName(event.target.value)
        });
    };

    handleCreateProject = () => {

        var data = {};
        data['keyProject'] = '';
        data['projectName'] = this.refs.projectName.value;

        var keys = Object.keys(this.refs);
        for (var i = 0; i < keys.length; i ++) {
            var key = keys[i];
            if (key == 'projectName') continue;

            if (key.indexOf('nominal') >= 0) {
                data[key] = this.refs[key].value;
            }else {
                var key0 = key.replace('tolerance', 'nominal');
                var key1 = key.replace('tolerance', 'upper');
                var key2 = key.replace('tolerance', 'lower');
                data[key1] = this.refs[key0].value * 1.000 + this.refs[key].value * 1.000;
                data[key2] = this.refs[key0].value * 1.000 - this.refs[key].value * 1.000;
            }
        }

        data['fieldUnits'] = this.props.inch ? 'inch' : 'mm';

        this.props.createProject(data);
        this.refs.projectName.value = '';
        this.setState({
            disableButtonProject: true
        });

        this.props.projectCreateDialogShowFunc(false);
    };

    handleChangeUnit = unitType => {
        const ratio = 0.0393701;
        this.props.projectMeter(unitType);
        var keys = Object.keys(this.refs);
        for (var i = 0; i < keys.length; i ++) {
            var key = keys[i];
            if (key == 'projectName') continue;
            if (unitType) {
                this.refs[key].value = parseFloat(parseFloat(Math.round(this.refs[key].value * ratio * 1000) / 1000).toFixed(3));
            }else {
                this.refs[key].value = parseFloat(parseFloat(Math.round(this.refs[key].value / ratio * 1000) / 1000).toFixed(3));
            }
        }
    };

    render() {
        const {props, handleClose, handleRowClick} = this;
        const {
            projectCreateDialogShow,
            projectList,
            inch
        } = props;

        const dimensionNames = [
            'Radius',
            'Bevel Angle',
            'Land Thickness',
            'Half Bevel',
            'Wall Thickness',
            'Radius Extension'
        ];

        const nominalFields = [
            <input className="dimensionInput" ref="nominalRadius"/>,
            <input className="dimensionInput" ref="nominalBevelAngle"/>,
            <input className="dimensionInput" ref="nominalLandThickness"/>,
            <input className="dimensionInput" ref="nominalHalfBevelGap"/>,
            <input className="dimensionInput" ref="nominalWallThickness"/>,
            <input className="dimensionInput" ref="nominalRadiusExtension"/>
        ];

        const toleranceFields = [
            <input className="dimensionInput" ref="toleranceRadius"/>,
            <input className="dimensionInput" ref="toleranceBevelAngle"/>,
            <input className="dimensionInput" ref="toleranceLandThickness"/>,
            <input className="dimensionInput" ref="toleranceHalfBevelGap"/>,
            <input className="dimensionInput" ref="toleranceWallThickness"/>,
            <input className="dimensionInput" ref="toleranceRadiusExtension"/>
        ];

        return (
            <div className="createProjectDialogContainer">
                <Modal
                    title="New Project"
                    isOpen={projectCreateDialogShow}
                    onRequestClose={handleClose}>

                    <div className="projectName">
                        <span>Project Name</span>
                        <input
                            className="topbarTextInputNewProject"
                            type="text"
                            onChange={this.handleProjectField}
                            ref="projectName"
                        />
                        <div className="inputNumberUnitToggle">
                            <ToggleUnit
                                onChange={this.handleChangeUnit}
                                toggled={inch}
                            />
                        </div>
                    </div>

                    <Table
                        rowHeight={50}
                        rowsCount={6}
                        height={352}
                        width={800}
                        headerHeight={50}>

                        <Column
                            header={<Cell>Dimension Name</Cell>}
                            cell={({ rowIndex, ...props }) => (
                                <Cell {...props}>
                                    {dimensionNames[rowIndex]}
                                </Cell>
                            )}
                            width={200}/>

                        <Column
                            header={<Cell>Nominal</Cell>}
                            cell={({ rowIndex, ...props }) => (
                                <Cell {...props}>
                                    {nominalFields[rowIndex]}
                                </Cell>
                            )}
                            width={300}/>

                        <Column
                            header={<Cell>+/- Tolerance</Cell>}
                            cell={({ rowIndex, ...props }) => (
                                <Cell {...props}>
                                    {toleranceFields[rowIndex]}
                                </Cell>
                            )}
                            width={300}/>

                    </Table>

                    <div className="text-right">
                        <Button
                            label="Create Project"
                            onClick={this.handleCreateProject}
                            disabled={this.state.disableButtonProject}
                        />
                    </div>
                </Modal>
            </div>
        );
    }
}


function mapStateToProps(state) {
    const {
        projectList,
        projectCreateDialogShow,
        inch
    } = state;

    return {
        projectList,
        projectCreateDialogShow,
        inch
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(ProjectActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectCreateDialog);
