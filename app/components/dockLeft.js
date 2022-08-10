import React, {Component} from 'react';
import Pipe from '../containers/pipe';
import PipeList from '../containers/pipeList';
import PipeDialog from'../containers/pipeDialog';
import '../styles/dockLeft.scss';

export default class DockLeft extends Component {
    render() {
        return (
            <div className="dockLeftContainer">
                <Pipe />
                <PipeList />
                <PipeDialog ref="pipeDialog" title=""/>
            </div>
        );
    }
}
