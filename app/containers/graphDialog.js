import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
// import Modal from 'react-modal';
import Modal from '../components/modal';
import * as scanActions from '../actions/scans';
import '../styles/graphDialog.scss';
import * as ProjectActions from '../actions/project';
import RadiusGraph from '../components/radiusGraph';
import BAGraph from '../components/baGraph';
import LTGraph from '../components/ltGraph';
import HBGraph from '../components/hbGraph';
import WTGraph from '../components/wtGraph';
import ToggleUnit from '../components/toggleUnit';
import ToggleActual from '../components/toggleActual';

class GraphDialog extends Component {
    static propTypes = {
        scanData: PropTypes.array,
        projectFields: PropTypes.object.isRequired,
        graphDialogOpen:PropTypes.bool.isRequired,
        graphDialogShowFunc: PropTypes.func.isRequired,
        inch: PropTypes.bool,
        variance: PropTypes.bool,
        projectMeter: PropTypes.func.isRequired,
        projectActual: PropTypes.func.isRequired,
        reloadGraphFunc: PropTypes.func.isRequired,
        reloadGraph: PropTypes.bool.isRequired,
    };

    static defaultProps = {
        inch: false,
        variance: false,
        reloadGraph: true
    };

    handleClose = () => {
        this.props.graphDialogShowFunc(false);
    };

    handleChangeUnit = unitType => {
        this.props.projectMeter(unitType);
    };

    handleChangeActual = actualType => {
        this.props.projectActual(actualType);
    };


    render() {
        const {
            handleClose,
            props,
        } = this;
        const {graphDialogOpen, scanData, projectFields, inch, reloadGraph, variance} = props;

        return (
            <div className="graphDialogContainer">
                <Modal
                    title="Graph For Each Dimensions"
                    isOpen={graphDialogOpen}
                    onRequestClose={handleClose}>

                    <div className="graphBox">
                        <div className="detailGraphContainer">
                            <RadiusGraph
                                scanData={scanData}
                                projectFields={projectFields}
                                actual={!variance}
                                inch={inch}
                            />
                        </div>
                        <div className="detailGraphContainer">
                            <BAGraph
                                scanData={scanData}
                                projectFields={projectFields}
                                actual={!variance}
                                inch={inch}
                            />
                        </div>
                        <div className="detailGraphContainer">
                            <div className="controlBox">
                                <div className="inputNumberUnitToggle">
                                    <ToggleUnit
                                        onChange={this.handleChangeUnit}
                                        toggled={inch}
                                    />
                                </div>
                                <div className="inputNumberUnitToggle">
                                    <ToggleActual
                                        onChange={this.handleChangeActual}
                                        toggled={variance}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="detailGraphContainer">
                            <LTGraph
                                scanData={scanData}
                                projectFields={projectFields}
                                actual={!variance}
                                inch={inch}
                            />
                        </div>
                        <div className="detailGraphContainer">
                            <HBGraph
                                scanData={scanData}
                                projectFields={projectFields}
                                actual={!variance}
                                inch={inch}
                            />
                        </div>
                        <div className="detailGraphContainer">
                            <WTGraph
                                scanData={scanData}
                                projectFields={projectFields}
                                actual={!variance}
                                inch={inch}
                            />
                        </div>
                    </div>
                </Modal>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const {
        graphDialogOpen,
        inch,
        reloadGraph,
        variance
    } = state;

    return {
        graphDialogOpen,
        inch,
        reloadGraph,
        variance
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        ...scanActions,
        ...ProjectActions,
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(GraphDialog);
