import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Button, Col, Modal, ModalBody, ModalHeader, Row } from 'reactstrap';
import ErpInput from '../../../../utility/custom/ErpInput';

const VatForm = ( { openTaxModal, handleTaxModalClosed, vatToggle, vatNumberData, vatNumberAmount } ) => {

    const [formData, setFormData] = useState( {
        vatNumber: vatNumberAmount ? vatNumberAmount : 0
    } )

    const handleOnChange = ( e ) => {
        const { name, value, type } = e.target;
        if ( value > 99 ) {
            toast.error( 'Tax limit: 99%' )
            return;
        }
        setFormData( { ...formData, [name]: type === "number" ? Number( value ) : value } )
    }

    const handleOnSubmit = () => {
        vatNumberData( formData );
        vatToggle()
    }

    return (
        <div>
            <Modal
                isOpen={openTaxModal}
                onClosed={handleTaxModalClosed}
                toggle={vatToggle}
                className="modal-dialog-centered modal-sm"
            >
                <ModalHeader
                    className="bg-light"
                    toggle={vatToggle}
                >
                    Edit Order Tax
                </ModalHeader>
                <ModalBody className="px-5 pb-5">
                    <Row>
                        <Col md={12}>
                            <ErpInput
                                sideBySide={false}
                                placeholder="Text Percentage"
                                label="Order Tax:* ( Percentage )"
                                name="vatNumber"
                                type="number"
                                value={formData.vatNumber}
                                onChange={( e ) => { handleOnChange( e ) }}
                            />
                        </Col>

                        <Col className="text-center mt-2 float-end" md={12}>
                            <div className="float-end">
                                <Button
                                    type="submit"
                                    color="primary"
                                    className=""
                                    size="sm"
                                    onClick={() => { handleOnSubmit() }}
                                >
                                    Update
                                </Button>
                                {/* <Button type="reset" outline size="sm">
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

export default VatForm;