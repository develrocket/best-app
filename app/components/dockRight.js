import React, {Component} from 'react';
import Projects from '../containers/project';

import '../styles/dockRight.scss';

export default class DockRight extends Component {
    render() {
        return (
            <div className="dockRightContainer">
                <Projects />
            </div>
        );
    }
}
