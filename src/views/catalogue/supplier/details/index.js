import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { ErpDetails } from '../../../../utility/custom/ErpDetails';
import FormContentLayout from '../../../../utility/custom/FormContentLayout';
import FormLayout from '../../../../utility/custom/FormLayout';
import SupplierTabs from './SupplierTab';

const SupplierDetails = () => {
    const location = useLocation();
    const { state } = location;
    const navigate = useNavigate();

    const [active, setActive] = useState( '1' );

    const toggleTab = tab => {
        if ( active !== tab ) {
            setActive( tab );
        }
    };

    const handleCancelButton = () => {
        navigate( "/catalogue/supplier/list" );
    };

    return (
        <>
            <Row>
                <Col>
                    <Button className='float-end' size='sm' color='info' onClick={() => { handleCancelButton(); }}>Back</Button>
                </Col>
            </Row>
            <FormLayout>

                <div className='px-2'>

                    <FormContentLayout title="Supplier Details">
                        <Col xs={8} className="">
                            <div className="text-black">
                                <ErpDetails label="Name" value={state?.name} />
                                <ErpDetails
                                    label="Business Name"
                                    value={state?.business_name}
                                />
                                <ErpDetails label="Mobile" value={state?.mobile} />
                                <ErpDetails label="Email" value={state?.email} />
                                <ErpDetails label="TAX Number" value={state?.tax_number} />
                                <ErpDetails label="Address" value={state?.address} />
                                <ErpDetails label="Pay Term" value={state?.pay_term} />
                            </div>
                        </Col>
                    </FormContentLayout>
                </div>
                <Row>
                    <Col sm={12} className="pb-3">
                        <div className="py-2 text-black">
                            <SupplierTabs state={state} active={active} toggleTab={toggleTab} />
                        </div>
                    </Col>
                </Row>
            </FormLayout>
        </>

    );
};

export default SupplierDetails;