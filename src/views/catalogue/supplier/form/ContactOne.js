import React, { useState } from 'react';
import { Button, Col, Modal, ModalBody, ModalHeader, Row } from 'reactstrap';
import ErpInput from '../../../../utility/custom/ErpInput';

const ContactOne = ( { openContactOneModal, handleContactOneModalClosed, contactOneToggle, contactOneData } ) => {

    const [formData, setFormData] = useState( {
        name: '',
        mobileNo: '',
    } )

    const handleInputOnChange = ( e ) => {
        const { name, value } = e.target;
        setFormData( { ...formData, [name]: value } )
    }

    const handleOnSubmit = () => {
        contactOneData( formData );
        contactOneToggle()
    }
    return (
        <div>
            <Modal
                isOpen={openContactOneModal}
                onClosed={handleContactOneModalClosed}
                toggle={contactOneToggle}
                className="modal-dialog-centered modal-sm"
            >
                <ModalHeader
                    className="bg-light"
                    toggle={contactOneToggle}
                >
                    Contact Person One
                </ModalHeader>
                <ModalBody className="px-5 pb-5">
                    <Row>
                        <>
                            <Col md={12}>
                                <ErpInput
                                    classNames="mt-1"
                                    label="Name"
                                    placeholder="Name"
                                    sideBySide={false}
                                    name="name"
                                    value={formData.name}
                                    onChange={( e ) => { handleInputOnChange( e ) }}
                                />
                            </Col>
                            <Col md={12}>
                                <ErpInput
                                    classNames="mt-1"
                                    label="Mobile Number"
                                    placeholder="Mobile Number"
                                    sideBySide={false}
                                    name="mobileNo"
                                    value={formData.mobileNo}
                                    onChange={( e ) => { handleInputOnChange( e ) }}
                                />
                            </Col>
                        </>

                        <Col className="text-center mt-2 float-end" xs={12}>
                            <div className="float-end">
                                <Button type="submit" color="primary" className="me-1" size="sm" onClick={() => { handleOnSubmit() }}>
                                    Save
                                </Button>
                                {/* <Button type="reset" outline>
                                    Discard
                                </Button> */}
                            </div>
                        </Col>
                    </Row>
                </ModalBody>
            </Modal>
        </div>
    );
};

export default ContactOne;