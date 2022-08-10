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

class HistoryDialog extends Component {
    static propTypes = {
        scanData: PropTypes.object,
        projectFields: PropTypes.object.isRequired,
        historyDialogOpen:PropTypes.bool.isRequired,
        historyDialogShowFunc: PropTypes.func.isRequired,
        inch: PropTypes.bool,
        variance: PropTypes.bool,
        limitType: PropTypes.number,
        projectMeter: PropTypes.func.isRequired,
        projectActual: PropTypes.func.isRequired,
        projectLimitTypeFunc: PropTypes.func.isRequired
    };

    static defaultProps = {
        inch: false,
        variance: false,
        reloadGraph: true,
        limitType: 0
    };

    handleClose = () => {
        this.props.historyDialogShowFunc(false);
    };

    handleChangeUnit = unitType => {
        this.props.projectMeter(unitType);
    };

    handleChangeActual = actualType => {
        this.props.projectActual(actualType);
    };

    setLimitTypeToZero = () => {
        this.props.projectLimitTypeFunc(0);
    };
    setLimitTypeToOne = () => {
        this.props.projectLimitTypeFunc(1);
    };
    setLimitTypeToTwo = () => {
        this.props.projectLimitTypeFunc(2);
    };

    render() {
        const {
            handleClose,
            props,
        } = this;
        const {historyDialogOpen, scanData, projectFields, inch, variance, limitType} = props;

        return (
            <div className="graphDialogContainer">
                <Modal
                    title="Plots trending Variance from Nominal Tollerances per Pipe End"
                    isOpen={historyDialogOpen}
                    onRequestClose={handleClose}>

                    <div className="historyGraphBox">
                        <div className="detailGraphContainer">
                            <RadiusGraph
                                scanData={scanData}
                                projectFields={projectFields}
                                actual={!variance}
                                inch={inch}
                                limitType={limitType}
                            />
                        </div>
                        <div className="detailGraphContainer">
                            <BAGraph
                                scanData={scanData}
                                projectFields={projectFields}
                                actual={!variance}
                                inch={inch}
                                limitType={limitType}
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
                                <div className="buttonBox">
                                    <button onClick={this.setLimitTypeToZero} className="limitButton">1 to All</button>
                                </div>
                                <div className="buttonBox">
                                    <button onClick={this.setLimitTypeToOne} className="limitButton">1 and 20</button>
                                </div>
                                <div className="buttonBox">
                                    <button onClick={this.setLimitTypeToTwo} className="limitButton">1 and 50</button>
                                </div>
                            </div>
                        </div>
                        <div className="detailGraphContainer">
                            <LTGraph
                                scanData={scanData}
                                projectFields={projectFields}
                                actual={!variance}
                                inch={inch}
                                limitType={limitType}
                            />
                        </div>
                        <div className="detailGraphContainer">
                            <HBGraph
                                scanData={scanData}
                                projectFields={projectFields}
                                actual={!variance}
                                inch={inch}
                                limitType={limitType}
                            />
                        </div>
                        <div className="detailGraphContainer">
                            <WTGraph
                                scanData={scanData}
                                projectFields={projectFields}
                                actual={!variance}
                                inch={inch}
                                limitType={limitType}
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
        historyDialogOpen,
        inch,
        variance,
        limitType
    } = state;

    return {
        historyDialogOpen,
        inch,
        variance,
        limitType
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        ...scanActions,
        ...ProjectActions,
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(HistoryDialog);
