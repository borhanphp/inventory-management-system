import _ from 'lodash'
import React, { Fragment, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Col, Row } from 'reactstrap'
import ActionMenu from '../../../../@core/layouts/components/ActionMenu'
import { getAllCiCm, getAllWarehouseCm } from '../../../../redux/common/store'
import ErpInput from '../../../../utility/custom/ErpInput'
import ErpSelect from '../../../../utility/custom/ErpSelect'
import FormContentLayout from '../../../../utility/custom/FormContentLayout'
import FormLayout from '../../../../utility/custom/FormLayout'
import { addNewApproval, bindApprovalData, fetchItemForApproval } from '../store'
import { initialApprovalData } from '../store/model'


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

const ReceiveApproval = () => {
    const { warehouseDataCm, ciDataCm } = useSelector( ( { commons } ) => commons );
    const { allReceiving } = useSelector( ( { itemForApprove } ) => itemForApprove );
    const [formData, setFormData] = useState( {
        ciId: null,
        warehouseId: null
    } )
    const dispatch = useDispatch()


    useEffect( () => {
        return () => {
            dispatch( bindApprovalData( initialApprovalData ) )
        }
    }, [] )

    const handleDropDownChange = ( data, e ) => {
        const { name } = e;
        setFormData( { ...formData, [name]: data } )
    }

    const handleSearch = () => {
        dispatch( fetchItemForApproval( formData ) )
            .then( ( res ) => {
                if ( !res.payload.length ) {
                    toast.error( 'There are no records for this query' );
                }
            } )
    }


    const handleRowInputChange = ( e, item, parent ) => {
        const { name, value, type } = e.target;

        const currAvg = item?.currentStock * item?.previousPurchasePrice;
        const rcvAvg = item?.quantity * item?.modifiedUnitCost || item?.approximateCosting;
        const factor = item?.currentStock + item?.quantity;
        const finalCount = ( currAvg + rcvAvg ) / factor;

        const updatedItems = allReceiving?.map( ( group ) => {
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
        dispatch( bindApprovalData( updatedItems ) );
    };

    const handleApproval = ( piId ) => {
        const setData = allReceiving?.filter( d => d.piGroupId === piId );
        const submittedData = {
            warehouseId: setData[0]?.warehouseId,
            mrrId: setData[0]?.receivingId,
            ciId: setData[0]?.ciId,
            scId: setData[0]?.scId,
            items: setData[0]?.items?.map( item => ( {
                id: item?.id,
                itemId: item?.itemId,
                scItemId: item?.scItemId,
                modifiedUnitCost: item?.modifiedUnitCost,
                modifiedPurchasePrice: item?.modifiedEstimatedPrice
            } ) )
        }
        console.log( 'submittedData', JSON.stringify( submittedData, null, 2 ) )
        dispatch( addNewApproval( submittedData ) )
            .then( ( res ) => {
                console.log( res );
                dispatch( fetchItemForApproval( formData ) )
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
    const ciOnFocus = () => {
        if ( !ciDataCm.length ) {
            dispatch( getAllCiCm( paramObj ) )
        }
    }


    const getApprovedItems = ( data ) => {
        const resFunc = data?.items?.map( ( item, i ) => {
            return item;
        } )
        const approvingData = resFunc?.filter( nested => nested.isApproved );
        return (
            <div>
                {approvingData?.length ?
                    <>
                        <Button
                            className=''
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
                        onClick={() => { handleApproval( data?.piGroupId ) }}
                    >Approve</Button>
                }
            </div>
        )

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
                                        label="CI Number"
                                        name="ciId"
                                        sideBySide={false}
                                        options={ciDataCm}
                                        value={formData.ciId}
                                        onFocus={() => { ciOnFocus() }}
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
                                                    <th>Item Name</th>
                                                    <th>Specification</th>
                                                    <th>Unit</th>
                                                    <th>Quantity</th>
                                                    <th>Price</th>
                                                    <th>Est. Group Cost</th>
                                                    <th>Est. Group Price</th>
                                                    <th>Total</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            {/* PI group list start here */}
                                            <tbody>
                                                {allReceiving?.length &&
                                                    allReceiving?.map( ( row, i ) => (
                                                        <Fragment key={i}>
                                                            <tr
                                                                style={{ backgroundColor: "#FBF1E6", fontWeight: "bold", border: "1px solid #FCA130" }}>
                                                                <td className='text-center'>{i + 1}</td>
                                                                <td className='text-center'>{row.name}</td>
                                                                <td className='text-center'>{row.specification}</td>
                                                                <td className='text-center'>{row.unit}</td>
                                                                <td className='text-center'>{row.quantity}</td>
                                                                <td className='text-center'>{row.price}</td>
                                                                <td className='text-center'>{row.estimatedTotalGroupCost}</td>
                                                                <td className='text-center'>{row?.estimatedAverageGroupPurchasePrice?.toFixed( 2 )}</td>
                                                                <td className='text-center'>{( row.quantity * row.price ).toFixed( 2 )}</td>
                                                                <td>
                                                                    {getApprovedItems( row )}
                                                                </td>
                                                            </tr>

                                                            {/* nested groups items small table start */}
                                                            <tr>
                                                                <td colSpan={9}>
                                                                    {

                                                                        <table className='w-100 border m-2 responsive'>
                                                                            <thead>
                                                                                <tr
                                                                                    className='text-center '
                                                                                    style={{ backgroundColor: "#E1FEEB", border: "1px solid #49CC90" }}
                                                                                >
                                                                                    <th className='text-nowrap px-1'>SL</th>
                                                                                    <th className='text-nowrap px-1'></th>
                                                                                    <th className='text-nowrap px-1'>Mrr No.</th>
                                                                                    <th className='text-nowrap px-1'>Item</th>
                                                                                    <th className='text-nowrap px-1'>Curr. Stock</th>
                                                                                    <th className='text-nowrap px-1'>Curr. Pur. Price</th>
                                                                                    <th className='text-nowrap px-1'>Rcv. Quantity</th>
                                                                                    <th className='text-nowrap px-1'>Approx Costing</th>
                                                                                    <th className='text-nowrap px-1'>Modified Costing</th>
                                                                                    <th className='text-nowrap px-1'>Approx Pur. Price</th>
                                                                                    <th className='text-nowrap px-1'>Modified pur. Price</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody>
                                                                                {row?.items?.map( ( item, ii ) => {
                                                                                    return (
                                                                                        <tr key={ii}>
                                                                                            <Td>{ii + 1}</Td>
                                                                                            <Td>
                                                                                                {
                                                                                                    item?.isApproved ?
                                                                                                        <span className="badge bg-success">A</span>
                                                                                                        :
                                                                                                        <span className="badge bg-primary">P</span>
                                                                                                }
                                                                                            </Td>
                                                                                            <Td>{item?.mrrNo}</Td>
                                                                                            <Td>{item?.description}</Td>
                                                                                            <Td>{item?.currentStock}</Td>
                                                                                            <Td>{item?.previousPurchasePrice}</Td>
                                                                                            <Td>{item?.quantity}</Td>
                                                                                            <Td>{item?.approximateCosting}</Td>
                                                                                            <Td>
                                                                                                <ErpInput
                                                                                                    sideBySide={false}
                                                                                                    name="modifiedUnitCost"
                                                                                                    type="number"
                                                                                                    disabled={item.isApproved}
                                                                                                    className="text-end"
                                                                                                    value={item.modifiedUnitCost}
                                                                                                    onChange={( e ) => { handleRowInputChange( e, item, row ) }}
                                                                                                />
                                                                                            </Td>
                                                                                            <Td>{item?.approximateNewPurchasePrice}</Td>
                                                                                            <Td>
                                                                                                <ErpInput
                                                                                                    sideBySide={false}
                                                                                                    name="modifiedEstimatedPrice"
                                                                                                    type="number"
                                                                                                    disabled={item.isApproved}
                                                                                                    className="text-end"
                                                                                                    value={item.modifiedEstimatedPrice}
                                                                                                    onChange={( e ) => { handleRowInputChange( e, item, row ) }}
                                                                                                />
                                                                                            </Td>
                                                                                        </tr>
                                                                                    )
                                                                                } )}

                                                                            </tbody>
                                                                        </table>

                                                                    }
                                                                </td>
                                                            </tr>
                                                            {/* nested groups items small table end*/}

                                                        </Fragment>
                                                    ) )
                                                }
                                            </tbody>
                                            {/* PI group list start here */}

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

export default ReceiveApproval