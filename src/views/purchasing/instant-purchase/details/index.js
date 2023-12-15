import moment from 'moment';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Col, NavItem, Row } from 'reactstrap';
import ActionMenu from '../../../../@core/layouts/components/ActionMenu';
import { ErpDetails } from '../../../../utility/custom/ErpDetails';
import FormContentLayout from '../../../../utility/custom/FormContentLayout';
import FormLayout from '../../../../utility/custom/FormLayout';
import { getInstantPurchaseById } from '../store';


const breadcrumb = [
    {
        id: 'home',
        name: 'Home',
        link: "/",
        isActive: false,
        hidden: false
    }
];

const PurchaseDetails = () => {
    const { basicInstantPurchaseInfo } = useSelector( ( { instantPurchase } ) => instantPurchase );
    const location = useLocation();
    const dispatch = useDispatch()
    const purchaseId = location.state;
    const navigate = useNavigate();
    useEffect( () => {
        dispatch( getInstantPurchaseById( purchaseId ) )
    }, [purchaseId] )

    const items = basicInstantPurchaseInfo?.items;
    const returnedItems = basicInstantPurchaseInfo?.returnedItems;
    return (
        <>
            <ActionMenu
                title="Instant Purchase Details"
                breadcrumb={breadcrumb}
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
                    <div className='p-2'>
                        <FormContentLayout title="Purchase Details">
                            <Col xs={6} className="">
                                <div className="text-black">
                                    <ErpDetails label="Purchase Invoice" value={basicInstantPurchaseInfo?.invoice} />
                                    <ErpDetails label="Supplier Name" value={basicInstantPurchaseInfo?.supplier} />
                                    <ErpDetails label="Purchase Date" value={moment( basicInstantPurchaseInfo?.date ).format( 'DD-MMM-YY' )} />
                                </div>
                            </Col>
                            <Col xs={6} className="">
                                <div className="text-black">

                                    <ErpDetails label="Warehouse" value={basicInstantPurchaseInfo?.warehouse} />
                                    <ErpDetails label="Note" value={basicInstantPurchaseInfo?.note} />
                                </div>
                            </Col>
                        </FormContentLayout>
                    </div>
                    <Row className='mt-2'>
                        <Col xs={12} md={6}>
                            <p className='text-center fw-bolder'>Instant Purchased Items</p>
                            <table className='table w-100'>
                                <thead className=''>
                                    <tr className=''>
                                        <th>#SL</th>
                                        <th>Item Name</th>
                                        <th>Price</th>
                                        <th>Quantity</th>
                                        <th>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items &&
                                        items?.map( ( item, i ) => {
                                            return (
                                                <tr key={i}>
                                                    <td>{i + 1}</td>
                                                    <td>{item.description}</td>
                                                    <td>{item.price}</td>
                                                    <td>{item.quantity}</td>
                                                    <td>{item.total}</td>
                                                </tr>
                                            )
                                        } )
                                    }

                                </tbody>
                            </table>
                        </Col>
                        <Col xs={12} md={6}>
                            <p className='text-center fw-bolder'>Returned Items</p>
                            <div >
                                <table className='table w-100'>
                                    <thead className='bg-light'>
                                        <tr className='py-0'>
                                            <th>#SL</th>
                                            <th>Item Name</th>
                                            <th>Price</th>
                                            <th>Quantity</th>
                                            <th>Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {returnedItems &&
                                            returnedItems?.map( ( item, i ) => {
                                                return (
                                                    <tr key={i}>
                                                        <td>{i + 1}</td>
                                                        <td>{item.description}</td>
                                                        <td>{item.price}</td>
                                                        <td>{item.returnedQuantity}</td>
                                                        <td>{item.total}</td>
                                                    </tr>
                                                )
                                            } )
                                        }

                                    </tbody>
                                </table>
                            </div>

                        </Col>
                    </Row>
                </FormLayout>
            </div>

        </>

    );
};

export default PurchaseDetails;