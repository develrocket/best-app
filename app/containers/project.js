import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as ProjectActions from '../actions/project';
import InputText from '../components/inputText';
import InputNumberUnit from '../components/inputNumberUnit';
import Group from '../components/group';
import '../styles/project.scss';

class Projects extends Component {
    static propTypes = {
        projectFields: PropTypes.object.isRequired,
        projectFieldsUnits: PropTypes.object.isRequired,
        projectName: PropTypes.string.isRequired,
        projectUpdate: PropTypes.func.isRequired,
        projectUpdateUnit: PropTypes.func.isRequired,
        projectList: PropTypes.array.isRequired,
        selectProject: PropTypes.func.isRequired,
        projectSelected: PropTypes.string.isRequired,
        projectRename: PropTypes.func.isRequired,
    };

    componentDidMount() {
        const {
            projectSelected,
            selectProject,
        } = this.props;

        // console.log('Container Project Mount:', projectSelected);

        if (projectSelected) {
            selectProject(projectSelected);
        }
    }

    handleProjectField = value => {
        const {props, checkProjectName} = this;
        const {projectRename} = props;

        if (checkProjectName(value) === false) {
            projectRename(value);
        }
    };

    checkProjectName = value => {
        if (value.length <= 0) {
            return true;
        }

        // Check if there is dupicate
        const projectList = this.props.projectList;
        for (let i = 0, s = projectList.length; i < s; i++) {
            if (projectList[i].projectName.toLowerCase() === value.toLowerCase()) {
                return true;
            }
        }

        return false;
    };

    render() {
        const {props, handleProjectField} = this;
        const {
            projectName,
            projectFields,
            projectFieldsUnits,
            projectUpdate,
            projectUpdateUnit,
        } = props;

        // Used for manual text fields
        const {
            client,
            contractor,
            projectDesignation,
            weldProcedure,
        } = projectFields;

        // Using wrapper for less recurring code.
        // Only for numerical values.
        const wrapperInputNumberUnit = (keyName, label) =>
            <InputNumberUnit
                label={label}
                keyName={keyName}
                value={projectFields[keyName]}
                inch={projectFieldsUnits[keyName]}
                onUnitChange={u => projectUpdateUnit(keyName, u)}
                onUpperChange={v => projectUpdate(keyName, v, 'upper')}
                onLowerChange={v => projectUpdate(keyName, v, 'lower')}
                onNominalChange={v => projectUpdate(keyName, v, 'nominal')}
            />

        return (
            <div className="projectContainer">
                <Group label="Project Settings">
                    <InputText
                        label="Project Name"
                        onChange={handleProjectField}
                        value={projectName}
                    />
                    {/*<InputText*/}
                        {/*label="Client"*/}
                        {/*keyName="client"*/}
                        {/*value={client}*/}
                        {/*onChange={v => projectUpdate('client', v)}*/}
                    {/*/>*/}
                    {/*<InputText*/}
                        {/*label="Contractor"*/}
                        {/*type="text"*/}
                        {/*keyName="contractor"*/}
                        {/*value={contractor}*/}
                        {/*onChange={v => projectUpdate('contractor', v)}*/}
                    {/*/>*/}
                    {/*{wrapperInputNumberUnit('PipeDiameter', 'Pipe Diameter')}*/}
                    {/*{wrapperInputNumberUnit('WallThickness', 'Wall Thickness')}*/}
                    {/*<InputText*/}
                        {/*label="Project Designation"*/}
                        {/*type="text"*/}
                        {/*keyName="projectDesignation"*/}
                        {/*value={projectDesignation}*/}
                        {/*onChange={v => projectUpdate('projectDesignation', v)}*/}
                    {/*/>*/}
                    {/*<InputText*/}
                        {/*label="Weld Procedure"*/}
                        {/*type="text"*/}
                        {/*keyName="weldProcedure"*/}
                        {/*value={weldProcedure}*/}
                        {/*onChange={v => projectUpdate('weldProcedure', v)}*/}
                    {/*/>*/}
                </Group>
                <Group label="Nominal Settings">
                    {wrapperInputNumberUnit('Radius', 'Radius')}
                    {wrapperInputNumberUnit('RadiusExtension', 'Radius Extension')}
                    {wrapperInputNumberUnit('LandThickness', 'Land Thickness')}
                    {wrapperInputNumberUnit('BevelAngle', 'Bevel Angle')}
                    {wrapperInputNumberUnit('HalfBevelGap', '½ Bevel Gap')}
                    {wrapperInputNumberUnit('WallThickness', 'Wall Thickness')}
                    {wrapperInputNumberUnit('InternalPipeDiameter', 'Internal Pipe Diameter')}
                    {wrapperInputNumberUnit('OutsidePipeDiameter', 'Outside Pipe Diameter')}
                </Group>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const {
        projectFields,
        projectFieldsUnits,
        projectName,
        projectList,
        projectSelected,
    } = state;

    return {
        projectFields,
        projectFieldsUnits,
        projectName,
        projectList,
        projectSelected,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(ProjectActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Projects);
