
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
const CustomModal = ( props ) => {
    const { isOpen, onClosed, toggle, title, children, ...rest } = props;


    return (
        <Modal
            isOpen={isOpen}
            onClosed={onClosed}
            toggle={toggle}
            {...rest}
        >
            <ModalHeader
                className=""
                style={{
                    backgroundColor: "#DCE0DD"
                }}
                toggle={toggle}
            >
                {title}
            </ModalHeader>
            <ModalBody className="px-5 pb-5">
                {children}
            </ModalBody>
        </Modal>
    );
};

export default CustomModal;