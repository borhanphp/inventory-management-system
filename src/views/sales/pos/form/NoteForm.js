import React, { useState } from 'react';
import { Button, Col, Modal, ModalBody, ModalHeader, Row } from 'reactstrap';
import ErpInput from '../../../../utility/custom/ErpInput';

const NoteForm = ( { openSuspendModal, handleSuspendModalClosed, suspendToggle, noteData } ) => {

    const [note, setNote] = useState( '' );

    const handleOnSubmit = () => {
        noteData( note )
        suspendToggle()
    };
    return (
        <Modal
            isOpen={openSuspendModal}
            onClosed={handleSuspendModalClosed}
            toggle={suspendToggle}
            className="modal-dialog-centered modal-md"
        >
            <ModalHeader
                className="bg-light"
                toggle={suspendToggle}
            >
                Note
            </ModalHeader>
            <ModalBody className="px-5 pb-5">

                <Row>
                    <Col md={12}>
                        <ErpInput
                            label="Note"
                            type="textarea"
                            sideBySide={false}
                            value={note}
                            onChange={( e ) => setNote( e.target.value )}
                        />
                    </Col>

                    <Col className="text-center mt-2 float-end" xs={12}>
                        <div className="float-end">
                            <Button
                                type="submit"
                                color="primary"
                                className="me-1"
                                size='sm'
                                onClick={() => { handleOnSubmit(); }}
                            >
                                Save
                            </Button>
                            <Button
                                type="reset"
                                outline
                                size='sm'
                                onClick={() => setNote( '' )}
                            >
                                Clear
                            </Button>
                        </div>
                    </Col>
                </Row>

            </ModalBody>
        </Modal>
    );
};

export default NoteForm;