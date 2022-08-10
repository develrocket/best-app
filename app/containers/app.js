import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Topbar from './topbar';
import DockRight from '../components/dockRight';
import DockLeft from '../components/dockLeft';
import Scans from './scans';
import Settings from './settings'
import ManualFields from './manualFields'
import ProjectDialog from './projectDialog';
import ProjectCreateDialog from './createProjectDialog';
import classNames from 'classnames';
import '../styles/home.scss'; // TODO merge into app.scss

class App extends Component {
    static propTypes = {
        projectDisabled: PropTypes.bool.isRequired,
    };

    render() {
        const {projectDisabled} = this.props;
        const classProjectView = classNames({
            projectView: true,
            projectDisabledOverlay: projectDisabled
        });

        return (
            <div className="container">
                <Topbar />
                <div className={classProjectView}>
                    <DockLeft />
                    <Scans />
                    <DockRight />
                </div>
                <Settings />
                <ManualFields />
                <ProjectDialog />
                <ProjectCreateDialog />
            </div>
        );
    }
}

function mapStateToProps(state) {
    const {projectDisabled} = state;
    return {
        projectDisabled
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
