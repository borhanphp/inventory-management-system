import moment from 'moment';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Col, NavItem, Row } from 'reactstrap';
import ActionMenu from '../../../../@core/layouts/components/ActionMenu';
import { ErpDetails } from '../../../../utility/custom/ErpDetails';
import FormContentLayout from '../../../../utility/custom/FormContentLayout';
import FormLayout from '../../../../utility/custom/FormLayout';
import { bindPiInfo, getPiById } from '../store';
import { initialPiData } from '../store/model';

const breadcrumb = [
    {
        id: 'home',
        name: 'Home',
        link: "/",
        isActive: false,
        hidden: false
    }
];

const PiDetails = () => {
    const { piData } = useSelector( ( { pi } ) => pi );
    const location = useLocation();
    const dispatch = useDispatch()
    const piId = location.state;
    const navigate = useNavigate();
    useEffect( () => {
        dispatch( getPiById( piId ) )
        return () => {
            dispatch( bindPiInfo( initialPiData ) )
        }
    }, [piId] )



    const items = piData?.groups
    console.log( piData )

    const handleAddNew = () => {
        dispatch( bindPiInfo( initialPiData ) )
        navigate( '/create-pi' )
    }

    const handleEdit = () => {
        navigate( '/pi-edit', { state: piId } );
        dispatch( getPiById( piId ) )
            .then( res => {
                dispatch( getScById( res.payload.scId.value ) )
            } )
    };


    return (
        <>
            <ActionMenu
                title="PI Details"
                breadcrumb={breadcrumb}
            >
                <NavItem className="me-1" >
                    <Button
                        size="sm"
                        color="info"
                        onClick={() => { navigate( '/pi-list' ) }}
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
                        <FormContentLayout title="Proforma Invoices ( PI ) Details">
                            <Col xs={6} className="">
                                <div className="text-black">
                                    <ErpDetails label="SC Number" value={piData?.salesContractCode} />
                                    <ErpDetails label="Latest Shipment Date" value={moment( piData?.latestShipmentDate ).format( 'DD-MMM-YY' )} />
                                    <ErpDetails label="Insurance" value={piData?.insurance} />
                                    <ErpDetails label="Buyer" value={piData?.buyerName} />
                                    <ErpDetails label="Buyer Address" value={piData?.buyerAddress} />
                                    <ErpDetails label="Currency" value={piData?.currency} />
                                    <ErpDetails label="Currency Rate" value={piData?.currencyRate} />
                                    <ErpDetails label="Purchase Date" value={moment( piData?.date ).format( 'DD-MMM-YY' )} />
                                    <ErpDetails label="Remarks" value={piData?.note} />
                                </div>
                            </Col>
                            <Col xs={6}>
                                <div className="text-black">
                                    <ErpDetails label="Supplier" value={piData?.supplier} />
                                    <ErpDetails label="Supplier Bank Name" value={piData?.sellerBankName} />
                                    <ErpDetails label="Supplier Bank Address" value={piData?.sellerBankAddress} />
                                    <ErpDetails label="Supplier Bank Swift Code" value={piData?.sellerBankSwiftCode} />
                                    <ErpDetails label="Supplier Bank Account No." value={piData?.sellerBankAccountNo} />
                                    <ErpDetails label="Supplier Bank Beneficiary Name" value={piData?.sellerBankBeneficiaryName} />
                                    <ErpDetails label="Supplier Bank Beneficiary Address" value={piData?.sellerBankBeneficiaryAddress} />
                                    <ErpDetails label="Total Amount" value={piData?.totalAmount} />
                                </div>
                            </Col>
                        </FormContentLayout>
                    </div>
                    <Row className='mt-2'>
                        <Col>
                            <p className='text-center'>All Items for this PI</p>
                            <table className='table w-100'>
                                <thead className='bg-light'>
                                    <tr>
                                        <th>#SL</th>
                                        <th>Item Name</th>
                                        <th>Price</th>
                                        {/* <th>HS Code</th> */}
                                        <th>Specification</th>
                                        <th>Quantity</th>
                                        <th>Total ({piData?.currency === "USD" ? '$' : piData?.currency === "BDT" ? '৳' : piData?.currency === "EURO" ? '€' : ''})  </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items &&
                                        items?.map( ( item, i ) => {
                                            return (
                                                <tr key={i}>
                                                    <td>{i + 1}</td>
                                                    <td>{item.name}</td>
                                                    <td>{item.price}</td>
                                                    {/* <td>{item.hsCode}</td> */}
                                                    <td>{item.specification}</td>
                                                    <td>{item.quantity}</td>
                                                    <td>{item.total}</td>
                                                </tr>
                                            )
                                        } )
                                    }
                                    <tr>
                                        <td colSpan={4}></td>
                                        <td className='fw-bolder'>Total</td>
                                        <td className='fw-bolder'>{piData?.totalAmount}</td>
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

export default PiDetails;