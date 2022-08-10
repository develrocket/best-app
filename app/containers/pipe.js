import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as PipeActions from '../actions/pipes';
import * as ProjectActions from '../actions/project';
import InputText from '../components/inputText';
import Group from '../components/group';
import Button from '../components/button';
import CheckBox from '../components/checkBox';
import ManualInputTextList from '../components/manualInputTextList';
import '../styles/pipe.scss';

class Pipe extends Component {
    static propTypes = {
        pipeFields: PropTypes.object.isRequired,
        pipeFieldUpdatePipeNumber: PropTypes.func.isRequired,
        pipeFieldUpdateHeatNumber: PropTypes.func.isRequired,
        pipeSave: PropTypes.func.isRequired,
        pipeList: PropTypes.array.isRequired,
        scanListA: PropTypes.array.isRequired,
        scanListB: PropTypes.array.isRequired,
        projectFields: PropTypes.object.isRequired,
        projectPipeOptionsAutoArchive: PropTypes.func.isRequired,
        projectPipeOptionsAutoGenerate: PropTypes.func.isRequired,
        projectPipeOptionsSingleEnd: PropTypes.func.isRequired,
        projectPipeOptionsLoad: PropTypes.func.isRequired,
        projectPipeOptions: PropTypes.object.isRequired,
        manualField: PropTypes.array.isRequired,
        manualFieldsFormShow: PropTypes.bool.isRequired
    };

    componentDidMount() {
        this.props.projectPipeOptionsLoad();
    }

    handleSave = () => {
        const {
            pipeFields,
            pipeSave,
            manualField
        } = this.props;

        const {pipeNumber} = pipeFields;
        let {heatNumber} = pipeFields;

        if (pipeNumber) {
            if (!heatNumber) heatNumber = '';

            pipeSave(pipeNumber, heatNumber, manualField);
        }
    };

    pipeNameCheck = pipeNumber => {
        const {pipeList} = this.props;

        for (let i = 0, len = pipeList.length; i < len; i++) {
            if (pipeList[i].pipeNumber === pipeNumber) {
                return true;
            }
        }

        return false;
    };

    render() {
        const {
            props,
            handleSave,
            pipeNameCheck,
        } = this;
        const {
            projectPipeOptionsAutoArchive,
            projectPipeOptionsAutoGenerate,
            projectPipeOptionsSingleEnd,
            projectPipeOptions,
            pipeFields,
            scanListA,
            scanListB,
            pipeFieldUpdatePipeNumber,
            pipeFieldUpdateHeatNumber,
            manualField,
            manualFieldsFormShow
        } = props;
        const {
            autoArchive,
            autoGenerate,
            singleEnd,
        } = projectPipeOptions;

        // TODO check this
        const data = Object.assign(
            {pipeNumber: '', heatNumber: ''},
            pipeFields);

        let error = false;
        if (pipeNameCheck(data.pipeNumber) === true) {
            error = true;
        }

        if (data.pipeNumber) {
            if (data.pipeNumber.length <= 0) {
                error = true;
            }
        } else {
            error = true;
        }

        // check scan list
        let errorScans = false;
        // if (scanListA.length <= 0 || scanListB.length <= 0) {
        //     if (singleEnd === true) {
        //         if (scanListA.length == 0 && scanListB.length == 0) {
        //             errorScans = true;
        //         }
        //     } else {
        //         errorScans = true;
        //     }
        // }
        if (scanListA.length == 0 && scanListB.length == 0) {
            errorScans = true;
        }

        return (
            <div className="pipeContainer">
                <Group label="New Pipe">
                    <InputText
                        ref="pipeNumber"
                        label="Pipe Number"
                        keyName="pipeNumber"
                        value={data.pipeNumber}
                        onChange={v => pipeFieldUpdatePipeNumber(v)}
                    />
                    <InputText
                        ref="heatNumber"
                        label="Heat Number"
                        keyName="heatNumber"
                        value={data.heatNumber}
                        onChange={v => pipeFieldUpdateHeatNumber(v)}
                    />
                    {manualFieldsFormShow ? <ManualInputTextList fields={manualField}/> : null}
                    <div className="pipeOptions">
                        <CheckBox
                            label="Auto Archive Scans"
                            onChange={v => projectPipeOptionsAutoArchive(v)}
                            checked={autoArchive}
                        />
                        <CheckBox
                            label="Auto Generate Pipe Number"
                            onChange={v => projectPipeOptionsAutoGenerate(v)}
                            checked={autoGenerate}
                        />
                        <CheckBox
                            label="Save Single Pipe End"
                            onChange={v => projectPipeOptionsSingleEnd(v)}
                            checked={singleEnd}
                        />
                    </div>
                    <div className="pipeActions">
                        <Button
                            ref="saveButton"
                            label="Save scan"
                            onClick={handleSave}
                            disabled={Boolean(error | errorScans)}/>

                    </div>
                </Group>
            </div>
        );
    }
}


function mapStateToProps(state) {
    const {
        pipeFields,
        pipeList,
        scanListA,
        scanListB,
        projectFields,
        projectPipeOptions,
        manualField,
        manualFieldsFormShow
    } = state;

    return {
        pipeFields,
        pipeList,
        scanListA,
        scanListB,
        projectFields,
        projectPipeOptions,
        manualField,
        manualFieldsFormShow
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        ...PipeActions,
        ...ProjectActions,
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Pipe);
