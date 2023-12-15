import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Button, Col, Modal, ModalBody, ModalHeader, Row } from 'reactstrap';
import ErpInput from '../../../../utility/custom/ErpInput';
import InSelect from '../../../../utility/custom/InSelect';

const DiscountForm = ( { openDiscountModal, handleDiscountModalClosed, discountToggle, discountTypeData, discountOnType } ) => {

    const discountType = [
        { label: "Fixed", value: "Fixed" },
        { label: "Percentage", value: "Percentage" }
    ];

    const [formData, setFormData] = useState( {
        discountNumber: discountOnType ? discountOnType?.discountNumber : 0,
        discountType: discountOnType ? { label: discountOnType?.discountType?.label, value: discountOnType?.discountType?.value } : null
    } )

    const handleInputOnChange = ( e ) => {
        const { name, value } = e.target;
        if ( !formData?.discountType?.value ) {
            toast.error( 'Select a discount type first' );
            return;
        } else {
            setFormData( { ...formData, [name]: value } )
        }
    }
    const handleDropDownOnChange = ( data, e ) => {
        const { name } = e;
        setFormData( { ...formData, [name]: data } )

    }

    const handleOnSubmit = () => {
        discountTypeData( formData );
        discountToggle()
    }
    return (
        <div>
            <Modal
                isOpen={openDiscountModal}
                onClosed={handleDiscountModalClosed}
                toggle={discountToggle}
                className="modal-dialog-centered modal-sm"
            >
                <ModalHeader
                    className="bg-light"
                    toggle={discountToggle}
                >
                    Edit Discount
                </ModalHeader>
                <ModalBody className="px-5 pb-5">
                    <Row>
                        <Col md={12}>
                            <InSelect
                                label="Discount Type"
                                options={discountType}
                                name="discountType"
                                value={formData.discountType}
                                onChange={( data, e ) => handleDropDownOnChange( data, e )}
                            />
                        </Col>
                        <Col md={12}>
                            <ErpInput
                                classNames="mt-1"
                                label="Discount Percentage"
                                placeholder="Discount Percentage"
                                sideBySide={false}
                                name="discountNumber"
                                value={formData.discountNumber}
                                onChange={handleInputOnChange}
                            />
                        </Col>

                        <Col className="text-center mt-2 float-end" xs={12}>
                            <div className="float-end">
                                <Button type="submit" color="primary" className="me-1" size="sm" onClick={() => { handleOnSubmit() }}>
                                    Update
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

export default DiscountForm;