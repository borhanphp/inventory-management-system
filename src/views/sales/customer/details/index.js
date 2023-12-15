import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { ErpDetails } from '../../../../utility/custom/ErpDetails';
import ErpSelect from '../../../../utility/custom/ErpSelect';
import FormContentLayout from '../../../../utility/custom/FormContentLayout';
import FormLayout from '../../../../utility/custom/FormLayout';
import CustomerTab from './CustomerTab';

const CustomerDetails = () => {
    const [customerSearchData, setCustomerSearchData] = useState( null );
    const location = useLocation();
    const { state } = location;
    const [singleData, setSingleData] = useState( state );
    const navigate = useNavigate();
    const customerDataOption = data?.map( d => ( { label: d.name, value: d.name } ) );

    const [active, setActive] = useState( '1' );

    const toggleTab = tab => {
        if ( active !== tab ) {
            setActive( tab );
        }
    };

    const handleCancelButton = () => {
        navigate( "/sales/customer/list" );
    };
    const handleDetailsSearch = () => {
        const filteredData = data.find( d => d.name === customerSearchData.label );
        setSingleData( filteredData );
    };

    return (
        <>

            <FormLayout>
                <Row className='mb-1'>
                    <Col>
                        <ErpSelect
                            placeholder="Choose or Type to Search Another Customer Details Here..."
                            options={customerDataOption}
                            value={customerSearchData}
                            onChange={( data, e ) => { setCustomerSearchData( data ); }}
                            sideBySide={false}
                        />
                    </Col>
                    <Col>
                        <Button className='float-end  ms-1' size='sm' color='info' onClick={() => { handleCancelButton(); }}>Back</Button>
                        <Button className='float-end' size='sm' color='success' onClick={() => { handleDetailsSearch(); }}>Search</Button>
                    </Col>
                </Row>
                <div className='px-2'>
                    <FormContentLayout title="Customer Details">

                        <Col xs={8} className="">
                            <div className="text-black">
                                <ErpDetails label="Name" value={singleData?.name} />
                                <ErpDetails label="Mobile" value={singleData?.mobile} />
                                <ErpDetails label="Email" value={singleData?.email} />
                                <ErpDetails label="Address" value={singleData?.address} />
                            </div>
                        </Col>
                    </FormContentLayout>
                </div>
                <Row>
                    <Col sm={12} className="pb-3">
                        <div className="py-2 text-black">
                            <CustomerTab state={singleData} active={active} toggleTab={toggleTab} />
                        </div>
                    </Col>
                </Row>
            </FormLayout>
        </>

    );
};

export default CustomerDetails;