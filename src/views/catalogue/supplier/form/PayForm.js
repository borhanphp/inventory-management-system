import React from 'react';
import { Button, Col, Modal, ModalBody, ModalHeader, Row } from 'reactstrap';
import { ErpDetails } from '../../../../utility/custom/ErpDetails';
import ErpInput from '../../../../utility/custom/ErpInput';
import InSelect from '../../../../utility/custom/InSelect';

const PayForm = ( { payModalOpen, handlePayModalClose, togglePay, supplierData } ) => {
    console.log( supplierData );
    const methodType = [
        { label: "Cash", value: "Cash" },
        { label: "Card", value: "Card" },
        { label: "Bkash", value: "Bkash" },
        { label: "Nagad", value: "Nagad" }
    ];
    return (
        <div>
            <Modal
                isOpen={payModalOpen}
                onClosed={handlePayModalClose}
                toggle={togglePay}
                className="modal-dialog-centered modal-lg"
            >
                <ModalHeader
                    className="bg-light"
                    toggle={togglePay}
                >
                    Pay Due Payments
                </ModalHeader>
                <ModalBody className="px-5 pb-5 text-black">
                    <Row>
                        <Col sm={6} >
                            <div className="bg-light p-1 h-100">
                                <p className='text-center fw-bolder'>Supplier Details</p>
                                <ErpDetails label="Name" value={supplierData?.name} />
                                <ErpDetails label="Business Name" value={supplierData?.business_name} />
                                <ErpDetails label="Mobile" value={supplierData?.mobile} />
                                <ErpDetails label="Email" value={supplierData?.email} />
                                <ErpDetails label="TAX Number" value={supplierData?.tax_number} />
                            </div>
                        </Col>
                        <Col sm={6}>
                            <div className="bg-light p-1 h-100">
                                <p className='text-center fw-bolder'>Due Details</p>
                                <ErpDetails label="Total Purchase" value="$ 0.00" />
                                <ErpDetails label="Total Paid" value="$ 0.00" />
                                <ErpDetails label="Total Purchase Due" value={`$ ${supplierData?.purchase_due}`} />
                                <ErpDetails label="Opening Balance" value={`$ ${supplierData?.opening_balance}`} />
                                <ErpDetails label="Opening Balance Due" value="$ 0.00" />
                            </div>
                        </Col>
                    </Row>
                    <div className="bg-light p-1 mt-2">
                        <Row>
                            <Col md={4}>
                                <ErpInput
                                    classNames="mt-1"
                                    label="Date"
                                    type="date"
                                    placeholder="Date"
                                    sideBySide={false}
                                />
                            </Col>
                            <Col md={4}>
                                <ErpInput
                                    classNames="mt-1"
                                    label="Amount"
                                    placeholder="Amount"
                                    sideBySide={false}
                                />
                            </Col>
                            <Col md={4}>
                                <InSelect label="Payment Method" options={methodType} />
                            </Col>
                            <Col md={12}>
                                <ErpInput
                                    classNames="mt-1"
                                    label="Pay Note"
                                    type="textarea"
                                    sideBySide={false}
                                />
                            </Col>
                        </Row>
                    </div>
                    <Row>
                        <Col className="text-center mt-2 float-end" xs={12}>
                            <div className="float-end">
                                <Button type="submit" size='sm' color="primary" className="me-1">
                                    Save
                                </Button>
                                <Button type="reset" size='sm' outline>
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

export default PayForm;