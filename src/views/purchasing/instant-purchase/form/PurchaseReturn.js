import moment from 'moment';
import React, { useEffect } from 'react';
import { X } from 'react-feather';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Col, Row } from 'reactstrap';
import { getAllSupplierCm, getAllWarehouseCm } from '../../../../redux/common/store';
import CustomModal from '../../../../utility/custom/CustomModal';
import ErpInput from '../../../../utility/custom/ErpInput';
import ErpSelect from '../../../../utility/custom/ErpSelect';
import { bindInstantPurchaseData, updateInstantPurchase } from '../store';
import { initialInstantPurchaseData } from '../store/model';
const Td = ( props ) => {
    const { children, ...rest } = props;
    return (
        <td style={{ border: "1px solid #edebeb" }} {...rest}>
            {children}
        </td>
    )
}
const PurchaseReturn = ( { openInstantPurchaseModal, handleInstantPurchaseModalClosed, instantPurchaseToggle } ) => {
    const { warehouseDataCm, supplierDataCm } = useSelector( ( { commons } ) => commons )
    const { basicInstantPurchaseInfo } = useSelector( ( { instantPurchase } ) => instantPurchase )
    const dispatch = useDispatch()

    useEffect( () => {
        return () => {
            dispatch( bindInstantPurchaseData( initialInstantPurchaseData ) )
        }
    }, [] )

    const handleDropDownOnChange = ( data, e ) => {
        const { name } = e;
        dispatch( bindInstantPurchaseData( { ...basicInstantPurchaseInfo, [name]: data } ) )
    }

    const handleItemOnChange = ( itemId, e ) => {
        const { name, value, type } = e.target;
        const updatedItems = basicInstantPurchaseInfo?.items.map( item => (
            item.id === itemId ? { ...item, [name]: type === "number" ? Number( value ) : value } : item

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
        const { id, items, date } = basicInstantPurchaseInfo;
        const itemQ = items?.every( d => d.quantity !== '' );
        const itemNote = items?.every( d => !d?.note?.length );
        const itemP = items?.every( d => d.price !== '' );

        if ( itemNote ) {
            toast.error( 'Write a Note Please' );
        }
        else if ( !itemQ ) {
            toast.error( 'Item Quantity is Required' );
        }
        else if ( !itemP ) {
            toast.error( 'Item Price is Required' );
        } else {
            const submittedData = {
                instantBuyId: id,
                returnDate: moment( date ).format( "YYYY-MM-DD" ),
                items: items.map( item => ( {
                    instantBuyItemId: item.id,
                    returnedQuantity: item?.quantity,
                    itemId: item?.itemId,
                    price: item?.price,
                    total: item?.quantity * item?.price,
                    note: item?.note
                } ) )
            }
            console.log( 'submittedData', JSON.stringify( submittedData, null, 2 ) )
            dispatch( updateInstantPurchase( submittedData ) )
                .then( ( res ) => {
                    if ( res.error ) {
                        return;
                    } else {
                        instantPurchaseToggle()
                        toast.success( 'Return successful' )

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
                title="Instant Purchase Return"
                isOpen={openInstantPurchaseModal}
                onClosed={handleInstantPurchaseModalClosed}
                toggle={instantPurchaseToggle}
                className="modal-dialog-centered modal-xl"
            >
                <Row>
                    <Row>
                        <Col md={4}>
                            <ErpSelect
                                sideBySide={false}
                                label="Warehouse"
                                options={warehouseDataCm}
                                name="warehouseId"
                                isDisabled={true}
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
                                isDisabled={true}
                                onFocus={() => { handleSupplierOnFocus() }}
                                value={basicInstantPurchaseInfo.supplierId}
                                onChange={( data, e ) => handleDropDownOnChange( data, e )}
                            />
                        </Col>

                        <Col md={4}>
                            <ErpInput
                                label="Return Date"
                                sideBySide={false}
                                type="date"
                                name="date"
                                value={basicInstantPurchaseInfo.date}
                                onChange={( e ) => { handleItemOnChange( data.id, e ) }}
                            />
                        </Col>



                    </Row>
                    <Row>

                        <Col xs={12}>
                            <div style={{ height: "400px", overflowX: "auto" }}>
                                <table className='w-100 mt-2'>
                                    <thead>
                                        <tr className='' style={{ backgroundColor: "#dce0dd" }}>
                                            <th style={{ width: "10px" }}>#SL</th>
                                            <th>Item</th>
                                            <th className='text-center' style={{ width: "250px" }}>Note</th>
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

                                                        <Td>
                                                            <ErpInput
                                                                sideBySide={false}
                                                                name="note"
                                                                value={data.note}
                                                                onChange={( e ) => { handleItemOnChange( data.id, e ) }}
                                                            />
                                                        </Td>

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
                                    Return
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

export default PurchaseReturn;