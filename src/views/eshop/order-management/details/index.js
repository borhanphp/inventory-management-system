import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Card, CardBody, Col, NavItem, Row } from 'reactstrap';
import ActionMenu from '../../../../@core/layouts/components/ActionMenu';
import { confirmDialog } from '../../../../utility/custom/ConfirmDialog';
import { ErpDetails } from '../../../../utility/custom/ErpDetails';
import ErpSelect from '../../../../utility/custom/ErpSelect';
import FormContentLayout from '../../../../utility/custom/FormContentLayout';
import FormLayout from '../../../../utility/custom/FormLayout';
import { getOrderById } from '../store';

const initialState = {
    status: null
}

const breadcrumb = [
    {
        id: 'home',
        name: 'Home',
        link: "/",
        isActive: false,
        hidden: false
    }
];

const OrderDetails = () => {
    const { orderInfo } = useSelector( ( { orders } ) => orders );
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const orderId = location.state;

    const [formData, setFormData] = useState( initialState );

    useEffect( () => {
        dispatch( getOrderById( orderId ) )
    }, [orderId] )

    const handleDropDownChange = ( data, e ) => {
        const { name } = e;
        setFormData( { ...formData, [name]: data } )
    }

    const confirmObj = {
        title: 'Are You Sure?',
        text: "You want to change order status!",
        confirmButtonText: 'Yes!',
        cancelButtonText: 'No'
    };

    //delete segment row
    const handleStatusConfirmation = ( data, eData ) => {
        confirmDialog( confirmObj ).then( ( e ) => {
            if ( e.isConfirmed ) {
                handleDropDownChange( data, eData )
            }
        } );
    };

    // console.log( orderInfo )
    const orderStatusOptions = [
        { label: 'Processing', value: 'Processing' },
        { label: 'Ready to Ship', value: 'Ready to Ship' },
        { label: 'On the Way', value: 'On the Way' },
        { label: 'Delivered', value: 'Delivered' },
        { label: 'Cancelled', value: 'Cancelled' }
    ]

    return (
        <div>
            <ActionMenu
                title={`Order ${orderInfo?.orderNo}`}
                breadcrumb={breadcrumb}
            >

                <NavItem className="mr-1" >
                    <Button
                        size="sm"
                        color="danger"
                        onClick={() => { navigate( -1 ); }}
                    >
                        Cancel
                    </Button>
                </NavItem>

            </ActionMenu>

            <Card className="mt-3">
                <CardBody>
                    <Row>
                        <Col md={9}>
                            <FormLayout>
                                <FormContentLayout>
                                    <Row className=''>
                                        <Col lg="3" className='border-end px-2 py-1' style={{}}>
                                            <p className='text-center border-bottom-2 fw-bold h4'>Order Details</p>
                                            <ErpDetails label="Order Number" value={orderInfo?.orderNo} />
                                            <ErpDetails label="Status" value={orderInfo?.orderStatus} />
                                            <ErpDetails label="Order Date" value={moment( orderInfo?.orderDate ).format( 'DD-MMM-YYYY' )} />
                                            <ErpDetails label="Customer " value={orderInfo?.username} />
                                        </Col>

                                        <Col lg="3" className='border-end px-2 py-1'>
                                            <p className='text-center border-bottom-2 fw-bold h4'>Customer/Shipping</p>
                                            <ErpDetails label="Name" value={orderInfo?.shippings?.map( d => d.firstName )} />
                                            <ErpDetails label="Phone" value={orderInfo?.shippings?.map( d => d.contactNo )} />
                                            <ErpDetails label="Email" value={orderInfo?.shippings?.map( d => d.email )} />
                                            <ErpDetails label="Address" value={orderInfo?.shippings?.map( d => d.addressLine )} />
                                            <ErpDetails label="City" value={orderInfo?.shippings?.map( d => d.city )} />
                                            <ErpDetails label="Country" value={orderInfo?.shippings?.map( d => d.countryName )} />
                                            <ErpDetails label="Postal Code" value={orderInfo?.shippings?.map( d => d.postalCode )} />
                                        </Col>

                                        <Col lg="3" className='border-end px-2 py-1'>
                                            <p className='text-center border-bottom-2 fw-bold h4'>Order Prices</p>
                                            <ErpDetails label="Sub Total" value={orderInfo?.subTotal} />
                                            <ErpDetails label="Shipping Charge" value={orderInfo?.shippingCharge} />
                                            <ErpDetails label="Total Amount" value={orderInfo?.totalAmount} />
                                            <ErpDetails label="Discount" value={orderInfo?.discountedAmount} />
                                        </Col>

                                        <Col lg="3" className='px-2 py-1'>
                                            <p className='text-center border-bottom-2 fw-bold h4'>Transactions</p>
                                            <ErpDetails label="Name" value={orderInfo?.payments?.map( d => d.paymentType )} />
                                            <ErpDetails label="Transaction Reference No." value={orderInfo?.payments?.map( d => d.transactionReferenceNo )} />
                                            <ErpDetails label="Transaction Amount" value={orderInfo?.payments?.map( d => d.transactionAmount )} />
                                            <ErpDetails label="Transaction Provider" value={orderInfo?.payments?.map( d => d.transactionProvider )} />
                                        </Col>
                                    </Row>


                                    <Row >
                                        <table className='table mt-2'>
                                            <thead>
                                                <tr>
                                                    <th>#SL</th>
                                                    <th>Product</th>
                                                    <th>Price</th>
                                                    <th>Quantity</th>
                                                    <th>Total</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    orderInfo?.items?.map( ( item, index ) => {
                                                        return (
                                                            <>
                                                                <tr>
                                                                    <td>{index + 1}</td>
                                                                    <td>{item?.description}</td>
                                                                    <td>{item?.price}</td>
                                                                    <td>{item?.quantity}</td>
                                                                    <td>{item?.total}</td>
                                                                </tr>
                                                            </>
                                                        )
                                                    } )
                                                }
                                            </tbody>
                                        </table>
                                    </Row>
                                </FormContentLayout>
                            </FormLayout>
                        </Col>
                        <Col md={3}>
                            <FormLayout>
                                <FormContentLayout>
                                    <ErpSelect
                                        sideBySide={false}
                                        label="Order Status"
                                        name="status"
                                        options={orderStatusOptions}
                                        value={formData.status}
                                        onChange={( data, e ) => { handleStatusConfirmation( data, e ); }}
                                    />
                                </FormContentLayout>
                            </FormLayout>

                        </Col>
                    </Row>
                </CardBody>
            </Card>
        </div>
    )
}

export default OrderDetails