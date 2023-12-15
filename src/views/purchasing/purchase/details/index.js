import _ from 'lodash';
import moment from 'moment';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Col, NavItem, Row } from 'reactstrap';
import ActionMenu from '../../../../@core/layouts/components/ActionMenu';
import { ErpDetails } from '../../../../utility/custom/ErpDetails';
import FormContentLayout from '../../../../utility/custom/FormContentLayout';
import FormLayout from '../../../../utility/custom/FormLayout';
import { bindPurchaseInfo, getPurchaseById } from '../store';
import { initialPurchaseData } from '../store/model';

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
    const { purchaseData } = useSelector( ( { purchase } ) => purchase );
    const location = useLocation();
    const dispatch = useDispatch()
    const purchaseId = location.state;
    const navigate = useNavigate();
    useEffect( () => {
        dispatch( getPurchaseById( purchaseId ) )
        return () => {
            dispatch( bindPurchaseInfo( initialPurchaseData ) )
        }
    }, [purchaseId] )

    const items = purchaseData?.items
    console.log( items );

    const handleEdit = () => {
        navigate( '/edit-purchase', { state: purchaseId } );
        dispatch( getPurchaseById( purchaseId ) );
    };

    const handleAddNew = () => {
        dispatch( bindPurchaseInfo( initialPurchaseData ) )
        navigate( '/add-purchase' )
    }

    return (
        <>
            <ActionMenu
                title="Purchase Details"
                breadcrumb={breadcrumb}
            >
                <NavItem className="me-1" >
                    <Button
                        size="sm"
                        color="info"
                        onClick={() => { navigate( '/purchase-list' ) }}
                    >List</Button>
                </NavItem>
                <NavItem className="me-1" >
                    <Button
                        size="sm"
                        color="success"
                        onClick={() => { handleEdit() }}
                    >Edit</Button>
                </NavItem>
                <NavItem className="me-1" >
                    <Button
                        size="sm"
                        color="primary"
                        onClick={() => { handleAddNew() }}
                    >Add New</Button>
                </NavItem>
            </ActionMenu>
            <div className='mt-3'>
                <FormLayout>
                    <div className='p-2'>
                        <FormContentLayout title="Purchase Details">
                            <Col xs={6} className="">
                                <div className="text-black">
                                    <ErpDetails label="PO Number" value={purchaseData?.name} />
                                    <ErpDetails label="Supplier Name" value={purchaseData?.supplierName} />
                                    <ErpDetails label="Currency" value={purchaseData?.currency} />
                                    <ErpDetails label="Currency Rate" value={purchaseData?.currencyRate} />
                                    <ErpDetails label="Pay Term" value={purchaseData?.payTerm?.label} />
                                    <ErpDetails label="Trade Term" value={purchaseData?.tradeTerm?.label} />
                                </div>
                            </Col>
                            <Col xs={6} className="">
                                <div className="text-black">
                                    <ErpDetails label="PO Date" value={moment( purchaseData?.date ).format( 'DD-MMM-YY' )} />
                                    <ErpDetails label="Last Date of Shipment" value={purchaseData?.lastDateOfShipment ? moment( purchaseData?.lastDateOfShipment ).format( 'DD-MMM-YY' ) : null} />
                                    <ErpDetails label="Receive Point" value={purchaseData?.receivePoint?.label} />
                                    {/* <ErpDetails label="Type" value={purchaseData?.type?.label} /> */}
                                    {/* <ErpDetails label="Status" value={purchaseData?.status?.label} /> */}
                                    <ErpDetails label="Shipment Mode" value={purchaseData?.shipmentMode?.label} />
                                    <ErpDetails label="Remarks" value={purchaseData?.note} />
                                </div>
                            </Col>
                        </FormContentLayout>
                    </div>
                    <Row className='mt-2'>
                        <Col>
                            <p className='text-center'>All Items for this Purchase Order</p>
                            <table className='table w-100'>
                                <thead className='bg-light'>
                                    <tr>
                                        <th>#SL</th>
                                        <th>Item Name</th>
                                        <th>Unit Price</th>
                                        <th>Quantity</th>
                                        <th>Unit</th>
                                        <th>Total ({purchaseData?.currency === "USD" ? '$' : purchaseData?.currency === "BDT" ? '৳' : purchaseData?.currency === "EURO" ? '€' : ''})</th>
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
                                                    <td>{item.uoM}</td>
                                                    <td>{item.total}</td>
                                                </tr>
                                            )
                                        } )
                                    }
                                    <tr>
                                        <td colSpan={4}></td>
                                        <td className='fw-bolder'>Total</td>
                                        <td className='fw-bolder'>{purchaseData?.items ? _.sum( purchaseData?.items?.map( dd => dd?.total ) ) : ""}</td>
                                    </tr>

                                </tbody>
                            </table>
                        </Col>
                    </Row>
                </FormLayout>
            </div>

        </>

    );
};

export default PurchaseDetails;