import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Table, Column, Cell} from 'fixed-data-table';
import Modal from '../components/modal';
import * as ProjectActions from '../actions/project';
import '../styles/projectDialog.scss';
import '../styles/fixed-data-table.scss';

class ProjectDialog extends Component {
    static propTypes = {
        projectDialogShow: PropTypes.bool.isRequired,
        projectList: PropTypes.array.isRequired,
        projectDialogShowFunc: PropTypes.func.isRequired,
        selectProject: PropTypes.func.isRequired,
        getProjectList: PropTypes.func.isRequired,
        projectTableShow: PropTypes.bool.isRequired
    };

    componentDidMount() {
        this.props.getProjectList();
    }

    // componentWillUpdate() {
    //   this.props.getProjectList();
    // }
    //
    // handleProjectSelect = (key, value) => {
    //   //
    // }

    handleClose = () => {
        this.props.projectDialogShowFunc(false);
    };

    handleRowClick = (e, i) => {
        const {
            projectList,
            selectProject,
            projectDialogShowFunc,
        } = this.props;

        // console.log('Rowclick',e,i)

        // Lookup rows
        const {keyProject} = projectList[i];
        selectProject(keyProject);
        projectDialogShowFunc(false);
    };

    render() {
        const {props, handleClose, handleRowClick} = this;
        const {
            projectDialogShow,
            projectList,
            projectTableShow
        } = props;

        const rows = projectList.map(v => {
            const {projectName} = v;
            return [projectName];
        });

        return (
            <div className="projectDialogContainer">
                <Modal
                    title="Select Project"
                    isOpen={projectDialogShow}
                    onRequestClose={handleClose}>
                    {
                        projectTableShow ?
                            <Table
                                rowHeight={50}
                                rowsCount={rows.length}
                                height={500}
                                width={900}
                                headerHeight={50}
                                onRowClick={handleRowClick}>

                                <Column
                                    header={<Cell>Project Name</Cell>}
                                    cell={({ rowIndex, ...props }) => (
                                        <Cell {...props}>
                                            {rows[rowIndex][0]}
                                        </Cell>
                                    )}
                                    width={600}/>

                                <Column
                                    header={<Cell>Date Created</Cell>}
                                    cell={({ rowIndex, ...props }) => (
                                        <Cell {...props}>
                                            {rows[rowIndex][1]}
                                        </Cell>
                                    )}
                                    width={300}/>

                            </Table>
                            : null
                    }


                </Modal>
            </div>
        );
    }
}


function mapStateToProps(state) {
    const {
        projectList,
        projectDialogShow,
        projectTableShow
    } = state;

    return {
        projectList,
        projectDialogShow,
        projectTableShow
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(ProjectActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectDialog);
