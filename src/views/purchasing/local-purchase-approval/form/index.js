import _ from 'lodash'
import React, { Fragment, useState } from 'react'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Col, Row } from 'reactstrap'
import ActionMenu from '../../../../@core/layouts/components/ActionMenu'
import { getAllWarehouseCm } from '../../../../redux/common/store'
import ErpSelect from '../../../../utility/custom/ErpSelect'
import FormContentLayout from '../../../../utility/custom/FormContentLayout'
import FormLayout from '../../../../utility/custom/FormLayout'
import { getLocalPurchaseByFilter } from '../../local-purchase/store'
import { addNewLocalApproval, bindLocalApprovalData, fetchLocalPurchaseApproval } from '../store'


const Td = ( props ) => {
    const { children } = props;
    return (
        <td
            className="text-center"
            style={{
                border: "1px solid #edebeb",
            }}
        >
            {children}
        </td>
    )
}

const LocalApproval = () => {
    const { warehouseDataCm, ciDataCm } = useSelector( ( { commons } ) => commons );
    const { allLocalPurchase } = useSelector( ( { localPurchase } ) => localPurchase );
    const { allLocalPurchaseForApproval } = useSelector( ( { localPurchaseApproval } ) => localPurchaseApproval );
    const [formData, setFormData] = useState( {
        piId: null,
        warehouseId: null
    } )
    const dispatch = useDispatch()

    const handleDropDownChange = ( data, e ) => {
        const { name } = e;
        setFormData( { ...formData, [name]: data } )
    }

    const handleSearch = () => {
        dispatch( fetchLocalPurchaseApproval( formData?.piId ) )
    }

    console.log( allLocalPurchaseForApproval )

    const handleRowInputChange = ( e, item, parent ) => {
        const { name, value, type } = e.target;

        const currAvg = item?.currentStock * item?.previousPurchasePrice;
        const rcvAvg = item?.quantity * item?.modifiedUnitCost || item?.approximateCosting;
        const factor = item?.currentStock + item?.quantity;
        const finalCount = ( currAvg + rcvAvg ) / factor;

        const updatedItems = allLocalPurchaseForApproval?.map( ( group ) => {
            const modifiedUnitCostData = Number( value ) + _.sum( group?.items.filter( i => i.itemId !== item.itemId )?.map( item => item?.modifiedUnitCost ) );

            if ( group.piGroupId === parent.piGroupId ) {
                if ( name === "modifiedUnitCost" ) {

                    if ( ( modifiedUnitCostData > group?.estimatedTotalGroupCost ) ) {
                        toast.error( 'Can not Exceed group cost value' );
                        return group;
                    } else {
                        return {
                            ...group,
                            items: group.items.map( ( res ) => {
                                return res.receivingId === parent.receivingId && res.itemId === item.itemId
                                    ? {
                                        ...res,
                                        modifiedEstimatedPrice: finalCount ? finalCount : item?.previousPurchasePrice,
                                        [name]: type === "number" ? Number( value ) : value,
                                    }
                                    : res;
                            } ),
                        };
                    }

                } else {
                    return {
                        ...group,
                        items: group.items.map( ( res ) => {
                            return res.receivingId === parent.receivingId && res.itemId === item.itemId
                                ? {
                                    ...res,
                                    modifiedEstimatedPrice: finalCount ? finalCount : item?.previousPurchasePrice,
                                    [name]: type === "number" ? Number( value ) : value,
                                }
                                : res;
                        } ),
                    };
                }
            } else {
                return group
            }

        } );
        dispatch( bindLocalApprovalData( updatedItems ) );
    };

    const handleApproval = ( id ) => {
        const setData = allLocalPurchaseForApproval?.filter( d => d.id === id );
        if ( !formData.piId && !formData.warehouseId ) {
            toast.error( 'Select warehouse and purchase invoice number' );
            return;
        }
        const submittedData = {
            invoiceId: setData[0]?.invoiceId,
            warehouseId: formData?.warehouseId?.value,
            items: [
                {
                    id: setData[0]?.id,
                    poItemId: setData[0]?.poItemId,
                    itemId: setData[0]?.itemId,
                    quantity: setData[0]?.quantity,
                    price: setData[0]?.price,
                    total: setData[0]?.total,
                    currentStock: setData[0]?.currentStock,
                    currentPrice: setData[0]?.currentPrice,
                    averagePrice: setData[0]?.averagePrice
                }
            ]
        }
        // console.log( 'submittedData', JSON.stringify( submittedData, null, 2 ) )
        dispatch( addNewLocalApproval( submittedData ) )
            .then( ( res ) => {
                dispatch( fetchLocalPurchaseApproval( formData?.piId ) )
                toast.success( 'Approved' )
            } )

    }


    const paramObj = {
        page: 1,
        pageSize: 1000000000
    }

    const warehouseOnFocus = () => {
        if ( !warehouseDataCm.length ) {
            dispatch( getAllWarehouseCm() )
        }
    }

    const localPurchaseOnFocus = () => {
        if ( !allLocalPurchase.length ) {
            dispatch( getLocalPurchaseByFilter( paramObj ) )
        }
    }


    return (
        <>
            <ActionMenu
                title='Item Receive Approval'
            >
                {/* <NavItem className="me-1" >
                    <Button
                        size="sm"
                        color="success"
                        onClick={() => { handleApproval(); }}
                    >Approve</Button>
                </NavItem> */}
            </ActionMenu>
            <Row className='mt-3'>
                <Col md={12}>
                    <Row>
                        <FormLayout>
                            <FormContentLayout title="Search By">
                                <Col md={4}>
                                    <ErpSelect
                                        label="Warehouse"
                                        name="warehouseId"
                                        sideBySide={false}
                                        options={warehouseDataCm}
                                        value={formData.warehouseId}
                                        onFocus={() => { warehouseOnFocus() }}
                                        onChange={( data, e ) => { handleDropDownChange( data, e ) }}
                                    />
                                </Col>
                                <Col md={4}>
                                    <ErpSelect
                                        label="Purchase Invoice Number"
                                        name="piId"
                                        sideBySide={false}
                                        options={allLocalPurchase}
                                        value={formData.piId}
                                        onFocus={() => { localPurchaseOnFocus() }}
                                        onChange={( data, e ) => { handleDropDownChange( data, e ) }}
                                    />
                                </Col>
                                <Col md={4}>
                                    <Button
                                        color="success"
                                        size="sm"
                                        className='mt-2 float-end'
                                        onClick={() => { handleSearch() }}
                                    >Search</Button>
                                </Col>

                            </FormContentLayout>

                            <div className="mt-2">
                                <div>
                                    <span className='me-2'>
                                        <span className="badge bg-success">A</span> Approved
                                    </span>

                                    <span>
                                        <span className="badge bg-primary">P</span> Pending
                                    </span>
                                </div>
                                <FormContentLayout title="Items with Group">
                                    <div className="">
                                        <table className='w-100 border'>
                                            <thead>
                                                <tr className='text-center' style={{ backgroundColor: "#f0f1f2" }}>
                                                    <th style={{ width: "5px" }}>SL</th>
                                                    <th></th>
                                                    <th>Item Name</th>
                                                    <th>Unit</th>
                                                    <th>Quantity</th>
                                                    <th>Price</th>
                                                    <th>Current Stock</th>
                                                    <th>Current Price</th>
                                                    <th>Average Price</th>
                                                    <th>Total</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            {/* PI group list start here */}
                                            <tbody>
                                                {
                                                    allLocalPurchaseForApproval?.map( ( row, i ) => (
                                                        <Fragment key={i}>
                                                            <tr
                                                                style={{ backgroundColor: "#FBF1E6", fontWeight: "bold", border: "1px solid #FCA130" }}>
                                                                <td className='text-center border-1'>{i + 1}</td>
                                                                <td className='text-center border-1'>
                                                                    {
                                                                        row?.isApproved ?
                                                                            <span className="badge bg-success">A</span>
                                                                            :
                                                                            <span className="badge bg-primary">P</span>
                                                                    }
                                                                </td>
                                                                <td className='text-center'>{row.description}</td>
                                                                <td className='text-center'>{row.itemUoM}</td>
                                                                <td className='text-center'>{row.quantity}</td>
                                                                <td className='text-center'>{row.price}</td>
                                                                <td className='text-center'>{row.currentStock}</td>
                                                                <td className='text-center'>{row?.currentPrice?.toFixed( 2 )}</td>
                                                                <td className='text-center'>{row?.averagePrice?.toFixed( 2 )}</td>
                                                                <td className='text-center'>{row?.total?.toFixed( 2 )}</td>
                                                                <td>
                                                                    {/* {getApprovedItems( row )} */}
                                                                    {row?.isApproved ?
                                                                        <>
                                                                            <Button
                                                                                className='w-100'
                                                                                color='success'
                                                                                size='sm'
                                                                                onClick={() => { }}
                                                                            >Approved</Button>
                                                                        </>
                                                                        :
                                                                        <Button
                                                                            className='w-100'
                                                                            color='primary'
                                                                            size='sm'
                                                                            onClick={() => { handleApproval( row?.id ) }}
                                                                        >Approve</Button>
                                                                    }
                                                                </td>
                                                            </tr>

                                                        </Fragment>
                                                    ) )
                                                }
                                            </tbody>

                                        </table>
                                    </div>
                                </FormContentLayout>
                            </div>

                        </FormLayout>
                    </Row>
                </Col>

            </Row>
        </>
    )
}

export default LocalApproval