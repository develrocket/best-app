import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as scanActions from '../actions/scans';
import Scan from './scan';
import '../styles/scans.scss';

class Scans extends Component {
    static propTypes = {
        settingsWatchA: PropTypes.string.isRequired,
        settingsWatchB: PropTypes.string.isRequired,
        scanListA: PropTypes.array.isRequired,
        scanListB: PropTypes.array.isRequired,
        historyListA: PropTypes.array.isRequired,
        historyListB: PropTypes.array.isRequired,
        scanLoadList: PropTypes.func.isRequired,
        startWatch: PropTypes.func.isRequired,
        showScans: PropTypes.bool,
        showScansFunc: PropTypes.func.isRequired
    };

    static defaultProps = {
        showScans: true
    };

    componentDidMount() {
        const {
            scanLoadList,
            settingsWatchA,
            settingsWatchB,
            startWatch,
            showScansFunc
        } = this.props;

        // Commented by Jerome
        scanLoadList();
        showScansFunc(true);

        setTimeout(() => {
            // console.log('time start watch');
            startWatch(settingsWatchA, 'A');
            startWatch(settingsWatchB, 'B');
        }, 1000);

        setInterval(function() {
            // console.log('time start watch');
            startWatch(settingsWatchA, 'A');
            startWatch(settingsWatchB, 'B');
        }, 5000)
    }

    handleTabSelect = (index, last) => {
        // console.log('Selected tab: ' + index + ', Last tab: ' + last);
    };

    render() {
        const {scanListA, scanListB, showScans, historyListA, historyListB} = this.props;
        return (
            <div className="scansContainer">
                <Scan
                    scanData={scanListA}
                    historyData={historyListA}
                    typeLabel="A"
                />
                <Scan
                    scanData={scanListB}
                    historyData={historyListB}
                    typeLabel="B"
                />
            </div>
        );
    }
}

function mapStateToProps(state) {
    const {
        settingsWatchA,
        settingsWatchB,
        scanListA,
        scanListB,
        historyListA,
        historyListB,
        projectFields,
        showScans
    } = state;

    return {
        settingsWatchA,
        settingsWatchB,
        scanListA,
        scanListB,
        historyListA,
        historyListB,
        projectFields,
        showScans
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(scanActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Scans);
