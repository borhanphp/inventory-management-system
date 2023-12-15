import moment from 'moment';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Col, NavItem, Row } from 'reactstrap';
import ActionMenu from '../../../../@core/layouts/components/ActionMenu';
import { ErpDetails } from '../../../../utility/custom/ErpDetails';
import FormContentLayout from '../../../../utility/custom/FormContentLayout';
import FormLayout from '../../../../utility/custom/FormLayout';
import { bindScInfo, getScById } from '../store';
import { initialScData } from '../store/model';

const breadcrumb = [
    {
        id: 'home',
        name: 'Home',
        link: "/",
        isActive: false,
        hidden: false
    }
];

const ScLcDetails = () => {
    const { scData } = useSelector( ( { sc } ) => sc );
    const location = useLocation();
    const dispatch = useDispatch()
    const purchaseId = location.state;
    const navigate = useNavigate();
    useEffect( () => {
        dispatch( getScById( purchaseId ) )
        return () => {
            dispatch( bindScInfo( initialScData ) )
        }
    }, [purchaseId] )

    const items = scData?.items
    console.log( scData )

    const handleEdit = () => {
        navigate( '/edit-sc', { state: purchaseId } );
        dispatch( getScById( purchaseId ) );
    };
    const handleAddNew = () => {
        dispatch( bindScInfo( initialScData ) )
        navigate( '/create-sc' )
    };


    return (
        <>
            <ActionMenu
                title="SC Details"
                breadcrumb={breadcrumb}
            >
                <NavItem className="me-1" >
                    <Button
                        size="sm"
                        color="info"
                        onClick={() => { navigate( "/sc-lc-list" ) }}
                    >View List</Button>
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
                        <FormContentLayout title="Sales Contract Details">
                            <Col xs={6} className="">
                                <div className="text-black">
                                    <ErpDetails label="Po Number" value={scData?.poCode} />
                                    <ErpDetails label="SC Number" value={scData?.salesContractCode} />
                                    <ErpDetails label="SC Date" value={moment( scData?.date ).format( 'DD-MMM-YY' )} />
                                    <ErpDetails label="Last Date Of Shipment" value={scData?.lastDateOfShipment} />
                                    <ErpDetails label="Loading Port Destination" value={scData?.loadingPortDestination} />
                                    <ErpDetails label="Insurance" value={scData?.insurance} />
                                    <ErpDetails label="Consignee" value={scData?.consigneeName} />
                                    <ErpDetails label="TermsPayment" value={scData?.termsPayment?.label} />
                                    <ErpDetails label="Consignee Address" value={scData?.consigneeAddress} />
                                    <ErpDetails label="Consignee Commission" value={scData?.consigneeCommission} />
                                    <ErpDetails label="Currency" value={scData?.currency} />
                                    <ErpDetails label="Currency Rate" value={scData?.currencyRate} />
                                    <ErpDetails label="PO Date" value={moment( scData?.date ).format( 'DD-MMM-YY' )} />
                                    <ErpDetails label="Remarks" value={scData?.note} />
                                </div>
                            </Col>
                            <Col xs={6} className="">
                                <div className="text-black">
                                    <ErpDetails label="Buyer" value={scData?.buyerName} />
                                    <ErpDetails label="Buyer Address" value={scData?.buyerAddress} />
                                    <ErpDetails label="Buyer Bank Name" value={scData?.buyerBankName} />
                                    <ErpDetails label="Buyer Bank Address" value={scData?.buyerBankAddress} />
                                    <ErpDetails label="Buyer Bank Swift Code" value={scData?.buyerBankSwiftCode} />
                                    <ErpDetails label="Buyer Bank Account No." value={scData?.buyerBankAccountNo} />
                                    <ErpDetails label="Buyer Bank Beneficiary Name" value={scData?.buyerBankBeneficiaryName} />
                                    <ErpDetails label="Buyer Bank Beneficiary Address" value={scData?.buyerBankBeneficiaryAddress} />
                                </div>
                            </Col>
                            <hr className='my-2' />
                            <Col xs={6}>
                                <div className="text-black">
                                    <ErpDetails label="Supplier" value={scData?.supplier} />
                                    <ErpDetails label="Supplier Bank Name" value={scData?.sellerBankName} />
                                    <ErpDetails label="Supplier Bank Address" value={scData?.sellerBankAddress} />
                                    <ErpDetails label="Supplier Bank Swift Code" value={scData?.sellerBankSwiftCode} />
                                    <ErpDetails label="Supplier Bank Account No." value={scData?.sellerBankAccountNo} />
                                    <ErpDetails label="Supplier Bank Beneficiary Name" value={scData?.sellerBankBeneficiaryName} />
                                    <ErpDetails label="Supplier Bank Beneficiary Address" value={scData?.sellerBankBeneficiaryAddress} />
                                </div>
                            </Col>

                            <Col xs={6}>
                                <div className="text-black">
                                    <ErpDetails label="Discount Percentage" value={scData?.discountPercentage} />
                                    <ErpDetails label="Discount Amount" value={scData?.discountedAmount} />
                                    <ErpDetails label="Discount Amount" value={scData?.totalAmount} />
                                    <ErpDetails label="Sub Total" value={scData?.subTotalAmount} />


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
                                        <th>Units</th>
                                        <th>Total ({scData?.currency === "USD" ? '$' : scData?.currency === "BDT" ? '৳' : scData?.currency === "EURO" ? '€' : ''})  </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items &&
                                        items?.map( ( item, i ) => {
                                            return (
                                                <tr key={i}>
                                                    <td style={{ width: '5px' }}>{i + 1}</td>
                                                    <td>{item.description}</td>
                                                    <td>{item.price}</td>
                                                    <td>{item.quantity}</td>
                                                    <td>{item.uom}</td>
                                                    <td>{item.total}</td>
                                                </tr>
                                            )
                                        } )
                                    }

                                    <tr>
                                        <td colSpan={4}></td>
                                        <td className='fw-bolder'>Total</td>
                                        <td className='fw-bolder'>{scData?.subTotalAmount}</td>
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

export default ScLcDetails;