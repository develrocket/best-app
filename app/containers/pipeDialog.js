import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
// import Modal from 'react-modal';
import Modal from '../components/modal';
import * as PipeActions from '../actions/pipes';
import Button from '../components/button';
import Scan from './scan';
import ConfirmDialog from '../components/confirmDialog';
import '../styles/pipeDialog.scss';

class PipeDialog extends Component {
    static propTypes = {
        title: PropTypes.string.isRequired,
        pipeDialogData: PropTypes.object.isRequired,
        pipeDialogOpen: PropTypes.bool.isRequired,
        pipeDialogClose: PropTypes.func.isRequired,
        pipeDelete: PropTypes.func.isRequired,
        historyListA: PropTypes.array,
        historyListB: PropTypes.array,
    };

    handleClose = () => {
        this.props.pipeDialogClose();
    };

    handleDeletePipe = () => {
        this.props.pipeDelete();
        this.props.pipeDialogClose();
    };

    handleDeleteButton = () => {
        this.refs.confirmDialog.toggle('Are you sure you want to delete pipe: ' +
            this.props.pipeDialogData.pipeNumber);
    };

    changeScanDataType = v => {
        // console.log(v.wallThickness);
        v.wallThickness = JSON.parse(v.wallThickness);
        // console.log(v);
    };

    render() {
        const {
            handleClose,
            changeScanDataType,
            handleDeleteButton,
            props,
        } = this;
        const {pipeDialogOpen, pipeDialogData, historyListA, historyListB} = props;

        // console.log('=========================================');
        // console.log(pipeDialogData);
        // console.log('=========================================');

        if (typeof pipeDialogData.pipeData == "undefined" || typeof pipeDialogData.manualFields == "undefined") {
            return (
                <div className="pipeDialogContainer">
                    <Modal
                        isOpen={pipeDialogOpen}
                        onRequestClose={handleClose}>
                        Pipe Info
                    </Modal>
                    <ConfirmDialog
                        ref="confirmDialog"
                        title="Confirm Pipe Delete"
                        onOk={this.handleDeletePipe}/>
                </div>
            );
        }

        function buildPayload(rows) {
            return rows.map(v => {
                return {
                    keyScan: v.keyScan,
                    radius: JSON.parse(v.radius),
                    bevelAngle: JSON.parse(v.bevelAngle),
                    landThickness: JSON.parse(v.landThickness),
                    halfBevelGap: JSON.parse(v.halfBevelGap),
                    wallThickness: JSON.parse(v.wallThickness),
                    dateCreated: v.dateCreated,
                };
            });
        }

        console.log(pipeDialogData);

        var scanListA = [];
        if (pipeDialogData.pipeData.keyScanA != '') {
            scanListA.push(pipeDialogData.pipeDataA);
            if (typeof pipeDialogData.pipeDataA != "undefined") {
                scanListA = buildPayload(scanListA);
            }
        }



        var scanListB = [];
        if (pipeDialogData.pipeData.keyScanB != '') {
            scanListB.push(pipeDialogData.pipeDataB);
            if (typeof pipeDialogData.pipeDataB != "undefined") {
                scanListB = buildPayload(scanListB);
            }
        }


        // const actions = [
        //   <div>
        //     <Button
        //       label="Close"
        //       onClick={handleClose}
        //     />
        //   &nbsp;
        //     <Button
        //       label="Delete"
        //       onClick={handleDeleteButton}
        //     />
        // </div>
        // ];

        //

        var fields = pipeDialogData.manualFields.map(function(field, i) {
            return (
                <div>
                    {field.fieldName}: {field.fieldValue}
                </div>
            );
        });

        return (
            <div className="pipeDialogContainer">
                <Modal
                    isOpen={pipeDialogOpen}
                    onRequestClose={handleClose}>
                    Pipe Info

                    <div>
                        <div>
                            Pipe Number: {pipeDialogData.pipeData.pipeNumber}
                        </div>
                        <div>
                            Heat Number: {pipeDialogData.pipeData.heatNumber}
                        </div>
                        {fields}
                    </div>

                    <div className="pipeScanContainer">
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

                </Modal>
                <ConfirmDialog
                    ref="confirmDialog"
                    title="Confirm Pipe Delete"
                    onOk={this.handleDeletePipe}/>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const {
        pipeDialogData,
        pipeDialogOpen,
        historyListA,
        historyListB,
    } = state;

    return {
        pipeDialogData,
        pipeDialogOpen,
        historyListA,
        historyListB
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(PipeActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(PipeDialog);

/*
 <Dialog
 className={styles.dialog}
 title={this.props.title}
 actions={actions}
 modal={false}
 open={this.props.pipeDialogOpen}
 onRequestClose={this.handleConfirmClose}
 contentStyle={{ width: '1200px', maxWidth: 'none' }}
 >
 <div>
 <div className={stylesPipeDialog.header}>
 Pipe Number: {this.props.pipeDialogData.pipeNumber}
 </div>
 <div className={stylesPipeDialog.header}>
 Heat Number: {this.props.pipeDialogData.heatNumber}
 </div>
 </div>
 <div className={styles.container} style={{height: '700px'}}>
 <Scan
 scanData={this.props.pipeDialogData.scanA}
 typeLabel="A"
 bgcolor="#FF6347"
 preview={true}
 />
 <Scan
 scanData={this.props.pipeDialogData.scanB}
 typeLabel="B"
 bgcolor="#FF6347"
 preview={true}
 />
 </div>
 </Dialog>
 */
