import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Col, NavItem } from 'reactstrap';
import ActionMenu from '../../../../@core/layouts/components/ActionMenu';
import { ErpDetails } from '../../../../utility/custom/ErpDetails';
import FormContentLayout from '../../../../utility/custom/FormContentLayout';
import FormLayout from '../../../../utility/custom/FormLayout';
import { getPartnerById } from '../store';

const PartnerDetails = () => {
    const location = useLocation();
    const { state } = location;
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [active, setActive] = useState( '1' );

    const toggleTab = tab => {
        if ( active !== tab ) {
            setActive( tab );
        }
    };

    const handleEdit = () => {
        dispatch( getPartnerById( state?.id ) );
        navigate( '/edit-partner-form', {
            state: {
                partnerId: state?.id
            }
        } );

    };

    const handleAddNew = () => {
        navigate( "/add-new-partner" );
    };



    return (
        <>
            <ActionMenu
                title='Partner Details'
            // breadcrumb={breadcrumb}
            >
                <NavItem className="me-1" >
                    <Button
                        size="sm"
                        color="success"
                        onClick={() => { handleEdit(); }}
                    >Edit</Button>
                </NavItem>
                <NavItem className="me-1" >
                    <Button
                        color='primary'
                        size='sm'
                        onClick={() => { handleAddNew(); }}
                    >Add New</Button>
                </NavItem>
                <NavItem className="" >
                    <Button
                        color='info'
                        size='sm'
                        onClick={() => { navigate( '/partner-list' ) }}
                    >View List</Button>
                </NavItem>
            </ActionMenu>
            <div className='mt-3'>
                <FormLayout>

                    <div className='px-2'>

                        <FormContentLayout title="Partner Details">
                            <Col xs={6} className="">
                                <div className="text-black">
                                    <ErpDetails label="Name" value={state?.name} />
                                    <ErpDetails label="Short Code" value={state?.code} />
                                    <ErpDetails label="Business Type" value={state?.businessType} />
                                    <ErpDetails
                                        label="Partner Category"
                                        value={state?.isSupplier ? "Supplier" : state?.isCustomer ? "Customer" : state?.isRepresentative ? "Representative" : ""} />
                                    <ErpDetails label="Mobile" value={state?.mobileNo} />
                                    <ErpDetails label="Email" value={state?.email} />
                                    <ErpDetails label="Fax" value={state?.fax} />
                                    <ErpDetails label="TAX Number" value={state?.tax_number} />
                                    <ErpDetails label="Pay Term" value={`${state?.paymentTerm} days`} />
                                    <ErpDetails label="Note" value={`${state?.note}`} />
                                </div>
                            </Col>
                            <Col xs={6} className="">
                                <div className="text-black">
                                    <ErpDetails label="Address" value={state?.address} />
                                    <ErpDetails label="Area" value={`${state?.area}`} />
                                    <ErpDetails label="Zone" value={`${state?.zoneName}`} />
                                    <ErpDetails label="City" value={`${state?.city}`} />
                                    <ErpDetails label="State" value={`${state?.division}`} />
                                    <ErpDetails label="Postal Code" value={`${state?.postalCode}`} />
                                    <ErpDetails label="Country" value={`${state?.countryName}`} />
                                </div>
                            </Col>
                        </FormContentLayout>
                    </div>
                    {/* <Row>
                    <Col sm={12} className="pb-3">
                        <div className="py-2 text-black">
                            <SupplierTabs state={state} active={active} toggleTab={toggleTab} />
                        </div>
                    </Col>
                </Row> */}
                </FormLayout>
            </div>
        </>

    );
};

export default PartnerDetails;