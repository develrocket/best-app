import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import HistoryDialog from '../containers/historyDialog';
import '../styles/scan.scss';
import '../styles/graphDialog.scss';
import RadiusGraph from '../components/radiusGraph';
import BAGraph from '../components/baGraph';
import LTGraph from '../components/ltGraph';
import HBGraph from '../components/hbGraph';
import WTGraph from '../components/wtGraph';
import ToggleUnit from '../components/toggleUnit';
import ToggleActual from '../components/toggleActual';
import * as ProjectActions from '../actions/project';
import * as scanActions from '../actions/scans';


class Scan extends Component {
    static propTypes = {
        scanData: PropTypes.array,
        historyData: PropTypes.array,
        projectFields: PropTypes.object.isRequired,
        typeLabel: PropTypes.string.isRequired,
        scanDiscard: PropTypes.func.isRequired,
        graphDialogShowFunc: PropTypes.func.isRequired,
        historyDialogShowFunc: PropTypes.func.isRequired,
        inch: PropTypes.bool,
        variance: PropTypes.bool,
        endBInch: PropTypes.bool,
        endBVariance: PropTypes.bool,
        projectMeter: PropTypes.func,
        projectActual: PropTypes.func,
        projectEndBMeter: PropTypes.func,
        projectEndBActual: PropTypes.func,
        reloadGraphFunc: PropTypes.func,
        reloadGraph: PropTypes.bool.isRequired,
        showScans: PropTypes.bool
    };

    static defaultProps = {
        inch: false,
        variance: false,
        endBInch: false,
        endBVariance: false,
        reloadGraph: true
    };

    handleOk = () => {
        const {scanDiscard, scanData} = this.props;
        var scanItem = scanData[scanData.length - 1];
        const {keyScan} = scanItem;

        scanDiscard(keyScan, scanItem.end);
    };

    handleDelete = () => {
        this.refs.confirmDialog.toggle('Are you sure you want to discard scan ' +
            this.props.typeLabel);
    };

    handleChangeUnit = unitType => {
        console.log(this.props.typeLabel);
        if (this.props.typeLabel == 'A') {
            this.props.projectMeter(unitType);
        }else {
            this.props.projectEndBMeter(unitType);
        }

    };

    handleChangeActual = actualType => {
        console.log(this.props.typeLabel);
        if (this.props.typeLabel == 'A') {
            this.props.projectActual(actualType);
        }else {
            this.props.projectEndBActual(actualType);
        }
    };

    handleShowHistory = () => {
        this.props.historyDialogShowFunc(true);
    };

    render() {
        const {handleDelete, props, refs, showScans} = this;
        const {
            typeLabel,
            projectFields,
            scanData,
            inch,
            variance,
            endBInch,
            endBVariance,
            historyData
        } = props;

        // console.log('Scan-Container:', showScans);

        // console.log('//////////////////////////////////');
        // console.log(scanItem);

        if (scanData.length == 0) {
            return (
                <div
                    className="scanContainer scanContainerNone"
                >
                    <div className="scanHeader">
                        Pipe End {typeLabel}: Waiting for scan.
                    </div>
                </div>
            );
        }

        const scanItem = scanData[0];

        var newScanData = {
            radius: [],
            bevelAngle: [],
            landThickness: [],
            halfBevelGap: [],
            wallThickness: []
        };

        for (var i = 0; i < historyData.length; i ++) {
            var item = historyData[i];
            var radius = 0;
            var bevelAngle = 0;
            var landThickness = 0;
            var halfBevelGap = 0;
            var wallThickness = 0;

            for (var j = 0; j < item.radius.length; j ++) { radius += item.radius[j]; }
            for (var j = 0; j < item.bevelAngle.length; j ++) { bevelAngle += item.bevelAngle[j]; }
            for (var j = 0; j < item.landThickness.length; j ++) { landThickness += item.landThickness[j]; }
            for (var j = 0; j < item.halfBevelGap.length; j ++) { halfBevelGap += item.halfBevelGap[j]; }
            for (var j = 0; j < item.wallThickness.length; j ++) { wallThickness += item.wallThickness[j]; }

            radius = item.radius.length == 0 ? radius : radius / item.radius.length;
            bevelAngle = item.bevelAngle.length == 0 ? bevelAngle : bevelAngle / item.bevelAngle.length;
            landThickness = item.landThickness.length == 0 ? landThickness : landThickness / item.landThickness.length;
            halfBevelGap = item.halfBevelGap.length == 0 ? halfBevelGap : halfBevelGap / item.halfBevelGap.length;
            wallThickness = item.wallThickness.length == 0 ? wallThickness : wallThickness / item.wallThickness.length;

            newScanData.radius.push(radius);
            newScanData.bevelAngle.push(bevelAngle);
            newScanData.landThickness.push(landThickness);
            newScanData.halfBevelGap.push(halfBevelGap);
            newScanData.wallThickness.push(wallThickness);
        }

        return (
            <div className="scanContainer">
                <div className="scanHeader">
                    Pipe Scan: {typeLabel} : {scanItem.keyScan}
                    <button onClick={this.handleShowHistory} className="detailButton">Show History</button>
                </div>
                <div className="graphBox">
                    <div className="detailGraphContainer">
                        <RadiusGraph
                            scanData={scanItem}
                            projectFields={projectFields}
                            actual={typeLabel == 'A' ? !variance : !endBVariance}
                            inch={typeLabel == 'A' ? inch : endBInch}
                            limitType={0}
                        />
                    </div>
                    <div className="detailGraphContainer">
                        <BAGraph
                            scanData={scanItem}
                            projectFields={projectFields}
                            actual={typeLabel == 'A' ? !variance : !endBVariance}
                            inch={typeLabel == 'A' ? inch : endBInch}
                            limitType={0}
                        />
                    </div>
                    <div className="detailGraphContainer">
                        <div className="controlBox">
                            <div className="inputNumberUnitToggle">
                                <ToggleUnit
                                    onChange={this.handleChangeUnit}
                                    toggled={typeLabel == 'A' ? inch : endBInch}
                                />
                            </div>
                            <div className="inputNumberUnitToggle">
                                <ToggleActual
                                    onChange={this.handleChangeActual}
                                    toggled={typeLabel == 'A' ? variance : endBVariance}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="detailGraphContainer">
                        <LTGraph
                            scanData={scanItem}
                            projectFields={projectFields}
                            actual={typeLabel == 'A' ? !variance : !endBVariance}
                            inch={typeLabel == 'A' ? inch : endBInch}
                            limitType={0}
                        />
                    </div>
                    <div className="detailGraphContainer">
                        <HBGraph
                            scanData={scanItem}
                            projectFields={projectFields}
                            actual={typeLabel == 'A' ? !variance : !endBVariance}
                            inch={typeLabel == 'A' ? inch : endBInch}
                            limitType={0}
                        />
                    </div>
                    <div className="detailGraphContainer">
                        <WTGraph
                            scanData={scanItem}
                            projectFields={projectFields}
                            actual={typeLabel == 'A' ? !variance : !endBVariance}
                            inch={typeLabel == 'A' ? inch : endBInch}
                            limitType={0}
                        />
                    </div>
                </div>
                <HistoryDialog
                    projectFields={projectFields}
                    scanData={newScanData}
                />
            </div>
        );
    }
}

function mapStateToProps(state) {
    const {
        projectFields,
        inch,
        reloadGraph,
        variance,
        showScans,
        endBInch,
        endBVariance
    } = state;
    return {
        projectFields,
        inch,
        reloadGraph,
        variance,
        showScans,
        endBInch,
        endBVariance
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        ...scanActions,
        ...ProjectActions,
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Scan);
