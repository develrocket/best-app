import React, {Component, PropTypes} from 'react';
import Modal from '../components/modal';
import Button from './button';
import '../styles/confirmDialog.scss';

export default class Scan extends Component {
    static propTypes = {
        onOk: PropTypes.func.isRequired,
        title: PropTypes.string.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            open: false,
            message: '',
        };
    }

    toggle = (message) => {
        this.setState({message, open: true});
    };

    handleCancel = () => {
        this.setState({open: false});
    };

    handleOk = () => {
        this.props.onOk();
        this.setState({open: false});
    };

    render() {
        const {state, props, handleCancel, handleOk} = this;
        const {title} = props;
        const {message, open} = state;

        return (
            <Modal
                title={title}
                isOpen={open}
                onRequestClose={handleCancel}
            >
                <div>{message}</div>
                <div className="confirmDialogButtonContainer">
                    <Button
                        label="OK"
                        onClick={handleOk}
                    />
                    <Button
                        label="Cancel"
                        onClick={handleCancel}
                    />
                </div>
            </Modal>
        );
    }
}
