import React from 'react';
import { Button, Col, Modal, ModalBody, ModalHeader, Row } from 'reactstrap';
import InInput from '../../../../utility/custom/InInput';
import InSelect from '../../../../utility/custom/InSelect';

const ShippingForm = ( { openShippingModal, handleShippingModalClosed, shippingToggle } ) => {

    const shipStatus = [
        { label: "Ordered", value: "Ordered" },
        { label: "Packed", value: "Packed" },
        { label: "Shipped", value: "Shipped" },
        { label: "Delivered", value: "Delivered" },
        { label: "Canceled", value: "Canceled" }
    ];
    return (
        <div>
            <Modal
                isOpen={openShippingModal}
                onClosed={handleShippingModalClosed}
                toggle={shippingToggle}
                className="modal-dialog-centered modal-lg"
            >
                <ModalHeader
                    className="bg-light"
                    toggle={shippingToggle}
                >
                    Shipping
                </ModalHeader>
                <ModalBody className="px-5 pb-5">
                    <Row>
                        <Col md={6}>
                            <InInput label="Shipping Details:*" type="textarea" />
                        </Col>

                        <Col md={6}>
                            <InInput label="Shipping Address:" type="textarea" />
                        </Col>
                        <Col md={6}>
                            <InInput label="Shipping Charges:*" />
                        </Col>
                        <Col md={6}>
                            <InSelect label="Shipping Status:" options={shipStatus} />
                        </Col>
                        <Col md={6}>
                            <InInput label="Delivered To:" />
                        </Col>

                        <Col className="text-center mt-2 float-end" xs={12}>
                            <div className="float-end">
                                <Button type="submit" color="primary" className="me-1">
                                    Update
                                </Button>
                                <Button type="reset" outline>
                                    Cancel
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </ModalBody>
            </Modal>
        </div>
    );
};

export default ShippingForm;