import moment from 'moment';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Col, NavItem, Row } from 'reactstrap';
import ActionMenu from '../../../../@core/layouts/components/ActionMenu';
import { ErpDetails } from '../../../../utility/custom/ErpDetails';
import FormContentLayout from '../../../../utility/custom/FormContentLayout';
import FormLayout from '../../../../utility/custom/FormLayout';
import { getReceivingById } from '../store';

const ReceivingDetails = () => {
    const { receivingData } = useSelector( ( { receivings } ) => receivings );
    const location = useLocation();
    const dispatch = useDispatch()
    const purchaseId = location.state;
    const navigate = useNavigate();
    useEffect( () => {
        dispatch( getReceivingById( purchaseId ) )
    }, [purchaseId] )

    const items = receivingData?.items
    // console.log( receivingData )


    return (
        <>
            <ActionMenu
                title="Item Receiving Details"
            >
                <NavItem className="me-1" >
                    <Button
                        size="sm"
                        color="info"
                        onClick={() => { navigate( -1 ) }}
                    >Back</Button>
                </NavItem>
            </ActionMenu>
            <div className='mt-3'>
                <FormLayout>
                    <div className='px-2'>
                        <FormContentLayout title="Receiving Details">
                            <Col xs={8} className="">
                                <div className="text-black">
                                    <ErpDetails label="MRR Code" value={receivingData?.name} />
                                    <ErpDetails label="CI Number" value={receivingData?.ciNumber} />
                                    <ErpDetails label="Receiving Date" value={moment( receivingData?.date ).format( 'DD-MMM-YY' )} />
                                    <ErpDetails label="Warehouse" value={receivingData?.warehouseId?.label} />
                                    <ErpDetails label="Note" value={receivingData?.note} />
                                </div>
                            </Col>
                        </FormContentLayout>
                    </div>
                    <Row className='mt-2'>
                        <Col>
                            <p className='text-center'>All Receiving Items</p>
                            <table className='table w-100'>
                                <thead className='bg-light'>
                                    <tr>
                                        <th>Item Name</th>
                                        <th>Quantity</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items &&
                                        items?.map( ( item, i ) => {
                                            return (
                                                <tr key={i}>
                                                    <td>{item.description}</td>
                                                    <td>{item.quantity}</td>
                                                </tr>
                                            )
                                        } )
                                    }

                                </tbody>
                            </table>
                        </Col>
                    </Row>
                </FormLayout>
            </div>

        </>

    );
};

export default ReceivingDetails;