import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { X } from 'react-feather';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Col, Row } from 'reactstrap';
import { getAllSupplierCm, getAllWarehouseCm } from '../../../../redux/common/store';
import CustomModal from '../../../../utility/custom/CustomModal';
import ErpInput from '../../../../utility/custom/ErpInput';
import ErpSelect from '../../../../utility/custom/ErpSelect';
import { getItemsByFilter } from '../../../catalogue/item/store';
import { bindSalesInfo } from '../../../sales/pos/store/actions';
import { addInstantPurchase, bindInstantPurchaseData } from '../store';
import { initialInstantPurchaseData } from '../store/model';

const Td = ( props ) => {
    const { children, ...rest } = props;
    return (
        <td style={{ border: "1px solid #edebeb" }} {...rest}>
            {children}
        </td>
    )
}
const InstantPurchase = ( { openInstantPurchaseModal, handleInstantPurchaseModalClosed, instantPurchaseToggle } ) => {
    const { warehouseDataCm, supplierDataCm } = useSelector( ( { commons } ) => commons )
    const { salesBasicInfo } = useSelector( ( { posReducer } ) => posReducer );
    const { basicInstantPurchaseInfo } = useSelector( ( { instantPurchase } ) => instantPurchase )
    const { allData, totalItems, loading } = useSelector( ( { items } ) => items );
    const dispatch = useDispatch()
    const [searchedData, setSearchedData] = useState( [] );
    const [searchValue, setSearchValue] = useState( '' );

    const existingItems = basicInstantPurchaseInfo?.items?.map( exItem => exItem.id );
    const searchedFilterData = searchedData?.filter( matchData => !existingItems.includes( matchData.id ) );

    console.log( 'basicInstantPurchaseInfo', basicInstantPurchaseInfo.id )
    useEffect( () => {
        return () => {
            dispatch( bindInstantPurchaseData( initialInstantPurchaseData ) )
        }
    }, [] )

    const handleDropDownOnChange = ( data, e ) => {
        const { name } = e;
        dispatch( bindInstantPurchaseData( { ...basicInstantPurchaseInfo, [name]: data } ) )
    }

    const handleInputOnChange = ( e ) => {
        const { name, value } = e.target;
        dispatch( bindInstantPurchaseData( { ...basicInstantPurchaseInfo, [name]: value } ) )
    }

    const handleGetItemDetails = ( data ) => {
        const newItem = {
            ...data,
            quantity: 0,
            price: 0,
            note: ""
        }
        dispatch( bindInstantPurchaseData(
            {
                ...basicInstantPurchaseInfo,
                items: [...basicInstantPurchaseInfo.items, newItem]
            } ) )
    }



    const handleItemSearchInput = ( e ) => {
        const { value } = e.target;
        setSearchValue( value )
        if ( value ) {
            const submittedData = {
                page: 1,
                pageSize: 1000000000
            }
            dispatch( getItemsByFilter( submittedData ) )
            const filteredData = allData?.filter( item => item?.description?.toLowerCase().includes( value?.toLowerCase() ) );
            setSearchedData( filteredData )

        } else {
            setSearchedData( [] )
        }

    }

    const handleItemOnChange = ( itemId, e ) => {
        const { name, value } = e.target;
        const updatedItems = basicInstantPurchaseInfo?.items.map( item => (
            item.id === itemId ? { ...item, [name]: Number( value ) } : item

        ) )
        dispatch( bindInstantPurchaseData(
            {
                ...basicInstantPurchaseInfo,
                items: updatedItems
            } ) )
    }
    const handleSelectedItemsDelete = ( id ) => {
        const updatedItems = basicInstantPurchaseInfo?.items.filter( item => (
            item.id !== id
        ) )
        dispatch( bindInstantPurchaseData(
            {
                ...basicInstantPurchaseInfo,
                items: updatedItems
            } ) )
    }

    const handleOnSubmit = () => {
        const { supplierId, warehouseId, note, items } = basicInstantPurchaseInfo;
        const itemQ = items?.every( d => d.quantity !== '' );
        const itemP = items?.every( d => d.price !== '' );
        if ( !warehouseId ) {
            toast.error( 'Warehouse is Required' );
        } else if ( !itemQ ) {
            toast.error( 'Item Quantity is Required' );
        } else if ( !itemP ) {
            toast.error( 'Item Price is Required' );
        } else {
            const submittedData = {
                supplierId: supplierId?.value,
                warehouseId: warehouseId?.value,
                note: note,
                total: _.sum( items?.map( d => d?.price ) ),
                items: items.map( item => ( {
                    itemId: item?.id,
                    quantity: item?.quantity,
                    price: item?.price,
                    total: item?.quantity * item?.price
                } ) )
            }
            console.log( 'submittedData', JSON.stringify( submittedData, null, 2 ) )
            dispatch( addInstantPurchase( submittedData ) )
                .then( ( res ) => {
                    if ( res.error ) {
                        return;
                    } else {
                        const paramObj = {
                            page: 1,
                            pageSize: 1000
                        }
                        dispatch( getItemsByFilter( paramObj ) )
                        instantPurchaseToggle()
                        toast.success( 'purchase successful' )
                        dispatch( bindSalesInfo( { ...salesBasicInfo, items: items } ) )

                    }
                } )
        }

    }


    const handleSupplierOnFocus = () => {
        if ( !supplierDataCm.length ) {
            dispatch( getAllSupplierCm() )
        }
    }
    const handleWarehouseOnFocus = () => {
        if ( !warehouseDataCm.length ) {
            dispatch( getAllWarehouseCm() )
        }
    }
    return (
        <div>
            <CustomModal
                title={basicInstantPurchaseInfo.id ? "Instant Purchase Return" : "Instant Purchase"}
                isOpen={openInstantPurchaseModal}
                onClosed={handleInstantPurchaseModalClosed}
                toggle={instantPurchaseToggle}
                className="modal-dialog-centered modal-lg"
            >
                <Row>
                    <Row>
                        <Col md={4}>
                            <ErpSelect
                                sideBySide={false}
                                label="Warehouse"
                                options={warehouseDataCm}
                                name="warehouseId"
                                onFocus={() => { handleWarehouseOnFocus() }}
                                value={basicInstantPurchaseInfo.warehouseId}
                                onChange={( data, e ) => handleDropDownOnChange( data, e )}
                            />
                        </Col>
                        <Col md={4}>
                            <ErpSelect
                                sideBySide={false}
                                label="Supplier"
                                options={supplierDataCm}
                                name="supplierId"
                                onFocus={() => { handleSupplierOnFocus() }}
                                value={basicInstantPurchaseInfo.supplierId}
                                onChange={( data, e ) => handleDropDownOnChange( data, e )}
                            />
                        </Col>
                        {basicInstantPurchaseInfo?.id ?
                            <Col md={4}>
                                <ErpInput
                                    label="Return Date"
                                    sideBySide={false}
                                    type="date"
                                    name="date"
                                    value={basicInstantPurchaseInfo.date}
                                    onChange={( e ) => { handleItemOnChange( data.id, e ) }}
                                />
                            </Col> : <Col md={4}>
                                <ErpInput
                                    label="Note"
                                    placeholder="Note"
                                    sideBySide={false}
                                    name="note"
                                    value={basicInstantPurchaseInfo.note}
                                    onChange={( e ) => { handleInputOnChange( e ) }}
                                />
                            </Col>
                        }


                    </Row>
                    <Row>
                        {!basicInstantPurchaseInfo?.id ?
                            <Col md={12}>
                                <ErpInput
                                    classNames="mt-1"
                                    label="Search Items"
                                    placeholder="Type to search here..."
                                    sideBySide={false}
                                    name="itemName"
                                    value={searchValue}
                                    onChange={( e ) => { handleItemSearchInput( e ) }}
                                    secondaryOption={
                                        <div className="input-group-append" style={{ zIndex: 0 }}>
                                            <Button.Ripple
                                                style={{ minHeight: "30px", minWidth: "70px" }}
                                                className="btn-icon w-100 pt-0 p-0 h-100"
                                                color="secondary"
                                                onClick={() => { setSearchedData( [] ), setSearchValue( '' ) }}
                                            >
                                                Clear
                                            </Button.Ripple>
                                        </div>
                                    }
                                />
                            </Col> : ''
                        }

                        {
                            searchedData?.length ?
                                <Col md={12}>
                                    <div style={{ height: "100px", overflowX: "auto" }}>
                                        <table className='border w-100' >
                                            <tbody >
                                                {searchedFilterData && searchedFilterData?.map( ( item, itemIndex ) => {
                                                    return (
                                                        <tr key={itemIndex} >
                                                            <td
                                                                className='cursor-pointer'
                                                                onClick={() => handleGetItemDetails( item )}
                                                            >{item?.description}</td>
                                                        </tr>
                                                    )
                                                } )}
                                            </tbody>
                                        </table>
                                    </div>

                                </Col> : ''
                        }
                        <Col xs={12}>
                            <div style={{ height: "400px", overflowX: "auto" }}>
                                <table className='w-100 mt-2'>
                                    <thead>
                                        <tr className='' style={{ backgroundColor: "#dce0dd" }}>
                                            <th style={{ width: "10px" }}>#SL</th>
                                            <th>Item</th>
                                            {basicInstantPurchaseInfo?.id ?
                                                <th className='text-center' style={{ width: "250px" }}>Note</th>
                                                : ""}
                                            <th className='text-center' style={{ width: "70px" }}>Quantity</th>
                                            <th className='text-center' style={{ width: "70px" }}>Price</th>
                                            <th className='text-center' style={{ width: "5px" }}>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            basicInstantPurchaseInfo?.items && basicInstantPurchaseInfo?.items?.map( ( data, dataIndex ) => {
                                                return (
                                                    <tr key={dataIndex}>
                                                        <Td className='text-center'>{dataIndex + 1}</Td>
                                                        <Td>{data.description}</Td>
                                                        {basicInstantPurchaseInfo?.id ?
                                                            <Td>
                                                                <ErpInput
                                                                    sideBySide={false}
                                                                    name="note"
                                                                    value={data.note}
                                                                    onChange={( e ) => { handleItemOnChange( data.id, e ) }}
                                                                />
                                                            </Td>
                                                            : ""}
                                                        <Td>
                                                            <ErpInput
                                                                sideBySide={false}
                                                                type="number"
                                                                className="text-end"
                                                                name="quantity"
                                                                value={data.quantity}
                                                                onFocus={( e ) => { e.target.select() }}
                                                                onChange={( e ) => { handleItemOnChange( data.id, e ) }}
                                                            />
                                                        </Td>
                                                        <Td>
                                                            <ErpInput
                                                                sideBySide={false}
                                                                type="number"
                                                                className="text-end"
                                                                name="price"
                                                                value={data.price}
                                                                onFocus={( e ) => { e.target.select() }}
                                                                onChange={( e ) => { handleItemOnChange( data.id, e ) }}
                                                            />
                                                        </Td>


                                                        <Td className='text-center'>
                                                            <X
                                                                size={18}
                                                                color="red"
                                                                className='cursor-pointer'
                                                                onClick={() => { handleSelectedItemsDelete( data.id ) }}
                                                            />
                                                        </Td>
                                                    </tr>
                                                )
                                            } )
                                        }

                                    </tbody>
                                </table>
                            </div>
                        </Col>
                        <Col className="text-center mt-2 float-end" xs={12}>
                            <div className="float-end">
                                <Button
                                    type="submit"
                                    color="primary"
                                    className=""
                                    size="sm"
                                    onClick={() => { handleOnSubmit() }}
                                >
                                    {basicInstantPurchaseInfo.id ? "Return" : "Submit"}
                                </Button>
                                {/* <Button type="reset" outline>
                                    Discard
                                </Button> */}
                            </div>
                        </Col>
                    </Row>



                </Row>
            </CustomModal>
        </div>
    );
};

export default InstantPurchase;