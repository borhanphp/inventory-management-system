import React, { useEffect, useState } from 'react';
import { Button, Col, Modal, ModalBody, ModalHeader, Row } from 'reactstrap';
import ErpInput from '../../../../utility/custom/ErpInput';
import InSelect from '../../../../utility/custom/InSelect';

const PaymentMethod = ( { openPaymentMethodModal, handlePaymentModalClosed, paymentMethodToggle, paymentMethodTypeData, totalAmount } ) => {

    const methodType = [
        { label: "Cash", value: "Cash" },
        { label: "Cheque", value: "Cheque" },
        { label: "Credit", value: "Credit" }
    ];

    const [formData, setFormData] = useState( {
        amount: '',
        chequeNo: '',
        methodType: null
    } )

    useEffect( () => {
        setFormData( {
            ...formData,
            amount: totalAmount,
            methodType: { label: "Cash", value: "Cash" }
        } )
    }, [totalAmount] )

    const handleInputOnChange = ( e ) => {
        const { name, value } = e.target;
        setFormData( { ...formData, [name]: value } )
    }
    const handleDropDownOnChange = ( data, e ) => {
        const { name } = e;
        setFormData( { ...formData, [name]: data } )
    }

    const handleOnSubmit = () => {
        paymentMethodTypeData( formData );
        paymentMethodToggle()
    }
    return (
        <div>
            <Modal
                isOpen={openPaymentMethodModal}
                onClosed={handlePaymentModalClosed}
                toggle={paymentMethodToggle}
                className="modal-dialog-centered modal-sm"
            >
                <ModalHeader
                    className="bg-light"
                    toggle={paymentMethodToggle}
                >
                    Payment Method

                </ModalHeader>
                <ModalBody className="px-5 pb-5">
                    <Row>
                        <Col md={12}>
                            <InSelect
                                label="Payment Method"
                                options={methodType}
                                name="methodType"
                                value={formData.methodType}
                                onChange={( data, e ) => handleDropDownOnChange( data, e )}
                            />
                        </Col>
                        {( formData?.methodType?.label === 'Cash' || formData?.methodType?.label === 'Credit' ) ?
                            <Col md={12}>
                                <ErpInput
                                    classNames="mt-1"
                                    label="Cash Amount"
                                    placeholder="Discount Amount"
                                    sideBySide={false}
                                    name="amount"
                                    value={formData.amount}
                                    disabled={true}
                                    onChange={handleInputOnChange}
                                />
                            </Col>
                            : ""}

                        {formData?.methodType?.label === 'Cheque' ?
                            <>
                                <Col md={12}>
                                    <ErpInput
                                        classNames="mt-1"
                                        label="Cheque Number"
                                        placeholder="Cheque Number"
                                        sideBySide={false}
                                        name="chequeNo"
                                        value={formData.chequeNo}
                                        onChange={handleInputOnChange}
                                    />
                                </Col>
                                <Col md={12}>
                                    <ErpInput
                                        classNames="mt-1"
                                        label="Account Number"
                                        placeholder="Acc. Number"
                                        sideBySide={false}
                                        name="accountNo"
                                        value={formData.accountNo}
                                        onChange={handleInputOnChange}
                                    />
                                </Col>
                                <Col md={12}>
                                    <ErpInput
                                        classNames="mt-1"
                                        label="Bank Name"
                                        placeholder="Bank Name"
                                        sideBySide={false}
                                        name="bankName"
                                        value={formData.bankName}
                                        onChange={handleInputOnChange}
                                    />
                                </Col>
                                <Col md={12}>
                                    <ErpInput
                                        classNames="mt-1"
                                        label="Date"
                                        type="date"
                                        placeholder="Bank Name"
                                        sideBySide={false}
                                        name="chequeDate"
                                        value={formData.chequeDate}
                                        onChange={handleInputOnChange}
                                    />
                                </Col>
                                <Col md={12}>
                                    <ErpInput
                                        classNames="mt-1"
                                        label="Amount"
                                        placeholder="Discount Amount"
                                        sideBySide={false}
                                        name="amount"
                                        value={formData.amount}
                                        disabled={true}
                                        onChange={handleInputOnChange}
                                    />
                                </Col>
                            </>
                            : ""}

                        <Col className="text-center mt-2 float-end" xs={12}>
                            <div className="float-end">
                                <Button type="submit" color="primary" className="me-1" size="sm" onClick={() => { handleOnSubmit() }}>
                                    Done
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

export default PaymentMethod;