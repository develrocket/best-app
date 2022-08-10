import React, {Component, PropTypes} from 'react';
import ReactModal from 'react-modal';
import '../styles/reactModal.scss';

export default class Modal extends Component {
    static propTypes = {
        onRequestClose: PropTypes.func.isRequired,
        isOpen: PropTypes.bool.isRequired,
        children: PropTypes.any,
        title: PropTypes.string
    };

    static defaultProps = {
        title: 'Dialog'
    };

    render() {
        const {
            onRequestClose,
            isOpen,
            children,
            title,
        } = this.props;

        return (
            <ReactModal
                className="modalContent"
                overlayClassName="modalOverlay"
                isOpen={isOpen}
                onRequestClose={onRequestClose}>
                <div className="modalHeader">
                    {title}
                    <button
                        className="modalCloseButton"
                        onClick={onRequestClose}>
                        X
                    </button>
                </div>
                <div className="modalBlock">
                    { children }
                </div>
            </ReactModal>
        );
    }
}
