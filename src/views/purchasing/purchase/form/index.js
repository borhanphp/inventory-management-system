import { yupResolver } from '@hookform/resolvers/yup';
import classNames from "classnames";
import _ from 'lodash';
import moment from 'moment';
import { useEffect } from "react";
import { MinusSquare } from "react-feather";
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
    Button,
    Col, NavItem
} from "reactstrap";
import * as yup from 'yup';
import ActionMenu from '../../../../@core/layouts/components/ActionMenu';
import '../../../../assets/scss/item/item-style.scss';
import { getAllCurrencyCm, getAllItemsCm, getAllSupplierCm, getAllUnitCm, getAllWarehouseCm } from "../../../../redux/common/store";
import { confirmDialog } from '../../../../utility/custom/ConfirmDialog';
import ErpInput from '../../../../utility/custom/ErpInput';
import ErpSelect from "../../../../utility/custom/ErpSelect";
import FormContentLayout from '../../../../utility/custom/FormContentLayout';
import FormLayout from '../../../../utility/custom/FormLayout';
import InInput from '../../../../utility/custom/InInput';
import { payTerms, shipmentModes, tradeTerms, typeOptions } from '../../../../utility/enums';
import { initialPurchaseData } from "../../purchase/store/model";
import { addNewPurchase, bindPurchaseInfo, getPoCodeById } from "../store";
const breadcrumb = [
    {
        id: 'home',
        name: 'Home',
        link: "/",
        isActive: false,
        hidden: false
    }
];

const PurchaseForm = () => {
    const { itemsDataCm, currencyDataCm, supplierDataCm, warehouseDataCm, unitDataCm } = useSelector( ( { commons } ) => commons )
    const { purchaseData } = useSelector( ( { purchase } ) => purchase );
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const purchaseSchema = yup.object().shape( {
        name: purchaseData?.name?.length ? yup.string() : yup.string().required( 'PO Code is Required!!!' ),
        supplier: purchaseData?.supplierId ? yup.string() : yup.string().required( 'Supplier is Required!!!' ),
        type: purchaseData?.type ? yup.string() : yup.string().required( 'Type is Required!!!' ),
        currency: purchaseData?.currencyId ? yup.string() : yup.string().required( 'Currency is Required!!!' ),
        currencyRate: purchaseData?.currencyRate?.length ? yup.string() : yup.string().required( 'Rate is Required!!!' ),

    } );
    const { reset, handleSubmit, formState: { errors } } = useForm( {
        mode: 'onChange',
        resolver: yupResolver( purchaseSchema )
    } );

    useEffect( () => {
        dispatch( getAllCurrencyCm() )
        dispatch( bindPurchaseInfo( {
            ...purchaseData,
            currencyId: { label: 'USD', value: 2 }
        } ) )
        return () => {
            dispatch( bindPurchaseInfo() )
        }
    }, [] )

    const handleCancel = () => {
        navigate( '/purchase-list' )
    }

    const clearAllField = () => {
        reset();
        dispatch( bindPurchaseInfo( initialPurchaseData ) )
    }

    const handleInputOnChange = ( e ) => {
        const { name, value } = e.target;
        // if ( name === "name" ) {
        //     const spl = value.split( '-' );
        //     if ( spl[2] ) {
        //         toast.error( 'you can edit only middle section' );
        //         return;
        //     } else if ( spl[1] ) {
        //         toast.error( 'you can edit' );
        //         return;
        //     }
        // }

        if ( name === 'currencyRate' ) {
            if ( value < 1 ) {
                toast.error( 'Currency Rate should be more then 1' )
                return;
            }
        }

        const updatedObj = {
            ...purchaseData,
            [name]: value
        };
        dispatch( bindPurchaseInfo( updatedObj ) )
    }

    const handleDropDownChange = ( data, e ) => {
        const { name } = e;
        if ( name === "supplierId" ) {
            dispatch( getPoCodeById( data?.value ) )
                .then( ( res ) => {
                    dispatch( bindPurchaseInfo( {
                        ...purchaseData,
                        [name]: data,
                        name: res.payload
                    } ) )
                } )
        } else {
            dispatch( bindPurchaseInfo( { ...purchaseData, [name]: data } ) )

        }

    }

    const handleItemInputChange = ( itemId, e ) => {
        const { name, value } = e.target;
        if ( value < 0 ) {
            toast.error( 'Value must be greater than 0' )
            return;
        }
        const updatedItems = purchaseData?.items?.map( ( item ) =>
            item?.id === itemId ? { ...item, [name]: value } : item
        );
        dispatch( bindPurchaseInfo( {
            ...purchaseData,
            items: updatedItems
        } ) )
    };

    const handleItemDropDownChange = ( itemId, data, e ) => {
        const { name } = e;
        const updatedItems = purchaseData?.items?.map( ( item ) =>
            item?.id === itemId ? { ...item, [name]: data } : item
        );
        dispatch( bindPurchaseInfo( {
            ...purchaseData,
            items: updatedItems
        } ) )
    };


    const handleItemChange = ( data, e ) => {
        const { name } = e;
        const newItem = {
            ...data,
            quantity: '',
            price: '',
            uomId: 0
        };

        const duplicateItems = purchaseData?.items?.map( dd => dd.id ).includes( data?.id )
        if ( duplicateItems ) {
            toast.success( 'Item already added!' )
        } else {
            dispatch( bindPurchaseInfo( {
                ...purchaseData,
                items: [...purchaseData?.items, newItem]
            } ) )
        }

    }

    const handleSupplierOnFocus = () => {
        if ( !supplierDataCm.length ) {
            dispatch( getAllSupplierCm() )
        }
    }
    const handleCurrencyOnFocus = () => {
        if ( !currencyDataCm.length ) {
            dispatch( getAllCurrencyCm() )
        }
    }

    const handleItemsOnFocus = () => {
        if ( !itemsDataCm.length ) {
            dispatch( getAllItemsCm() )
        }
    }

    const handleUnitOnFocus = () => {
        if ( !unitDataCm.length ) {
            dispatch( getAllUnitCm() )
        }
    }

    const handleOnSubmit = () => {

        const itemQ = purchaseData?.items?.every( d => d.quantity !== '' );
        const itemP = purchaseData?.items?.every( d => d.price !== '' );


        if ( purchaseData.expiryDate < purchaseData.date ) {
            toast.error( 'The expiry date should be after the purchase date' )
            return;
        }

        if ( !purchaseData?.items?.length ) {
            toast.error( 'At least one item is required' );
        } else if ( !itemQ ) {
            toast.error( 'Item Quantity is Required' );
        } else if ( !itemP ) {
            toast.error( 'Item Price is Required' );
        } else {
            const submittedData = {
                ...purchaseData,
                supplierId: purchaseData?.supplierId?.value,
                shipmentMode: purchaseData?.shipmentMode?.value,
                currencyId: purchaseData?.currencyId?.value,
                currencyRate: +purchaseData?.currencyRate,
                receivePoint: purchaseData?.receivePoint?.label,
                payTerm: purchaseData?.payTerm?.label,
                tradeTerm: purchaseData?.tradeTerm?.label,
                date: purchaseData.date ? moment( purchaseData.date ).format( 'YYYY-MM-DD' ) : moment( new Date() ).format( 'YYYY-MM-DD' ),
                type: purchaseData?.type?.value,
                isDraft: false,
                items: purchaseData?.items?.map( item => ( {
                    itemId: item.id,
                    uomId: item.uomId.value,
                    quantity: Number( item.quantity ),
                    price: Number( item.price )
                } ) )
            };
            console.log( 'submittedData', JSON.stringify( submittedData, null, 2 ) );
            dispatch( addNewPurchase( submittedData ) )
                .then( ( res ) => {
                    if ( res.error ) {
                        return;
                    } else {
                        toast.success( 'Purchase Successful' );
                        dispatch( bindPurchaseInfo( initialPurchaseData ) )
                    }

                } )
                .catch( ( error ) => console.log( error ) )
        }
    }

    const confirmObj = {
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        confirmButtonText: 'Yes!',
        cancelButtonText: 'No'
    };

    const handleRowsDelete = ( id ) => {
        confirmDialog( confirmObj ).then( ( e ) => {
            if ( e.isConfirmed ) {
                const filteredData = purchaseData?.items?.filter( d => d.id !== id )
                dispatch( bindPurchaseInfo( { ...purchaseData, items: filteredData } ) )
            }
        } );
    };


    const paymentTerm = [
        { value: 1, label: "FOB" },
        { value: 2, label: "CFR" },
        { value: 3, label: "CIF" },
        { value: 4, label: "Not Applicable" }
    ]


    const handleWarehouseOnFocus = () => {
        if ( !warehouseDataCm.length ) {
            dispatch( getAllWarehouseCm() )
        }
    }





    const updatedName = purchaseData.name.split( '-' );
    updatedName[1] = 'newMiddleValue';
    const newFullName = updatedName.join( '-' );

    console.log( 'newFullName', newFullName )

    return (
        <>
            <ActionMenu
                title='New Import Purchase'
                breadcrumb={breadcrumb}
            >
                <NavItem className="me-1" >
                    <Button
                        size="sm"
                        color="primary"
                        // onClick={() => { handleOnSubmit(); }}
                        onClick={handleSubmit( handleOnSubmit )}
                    >Save</Button>
                </NavItem>
                <NavItem className="me-1" >
                    <Button
                        color='secondary'
                        size='sm'
                        onClick={() => { clearAllField(); }}
                    >Clear</Button>
                </NavItem>
                <NavItem className="mr-1" >
                    <Button
                        size="sm"
                        color="info"
                        onClick={() => { handleCancel() }}
                    >
                        List
                    </Button>
                </NavItem>
            </ActionMenu>

            <div className='mt-3'>
                <FormLayout>
                    <div >
                        <FormContentLayout title="Purchase Information">
                            <Col md={3} xl={3} xxl={3}>
                                <ErpSelect
                                    label="Type"
                                    classNames="mt-1"
                                    name="type"
                                    sideBySide={false}
                                    isDisabled={true}
                                    options={typeOptions}
                                    value={purchaseData.type}
                                    onChange={( data, e ) => { handleDropDownChange( data, e ); }}
                                    className={classNames( `erp-dropdown-select ${( errors && errors?.type && !purchaseData?.type ) && 'is-invalid'}` )}

                                />
                            </Col>

                            <Col md={3} xl={3} xxl={3}>
                                <ErpSelect
                                    label="Supplier"
                                    classNames="mt-1"
                                    name="supplierId"
                                    sideBySide={false}
                                    options={supplierDataCm}
                                    value={purchaseData.supplierId}
                                    onFocus={() => { handleSupplierOnFocus() }}
                                    onChange={( data, e ) => { handleDropDownChange( data, e ); }}
                                    className={classNames( `erp-dropdown-select ${( errors && errors?.supplier && !purchaseData?.supplierId ) && 'is-invalid'}` )}
                                />

                            </Col>
                            <Col md={3} xl={3} xxl={3}>
                                <ErpInput
                                    // style={{
                                    //     borderRight: "none",
                                    //     borderRadius: "0px",
                                    //     width: "100px"
                                    // }}
                                    classNames="mt-1"
                                    sideBySide={false}
                                    label="PO Number"
                                    placeholder="EX: PO10001"
                                    name="name"
                                    // value={newFullName}
                                    // value={purchaseData.name.split( '-' )[0]}
                                    value={purchaseData.name}
                                    onChange={( e ) => { handleInputOnChange( e ) }}
                                    className={classNames( `erp-dropdown-select ${( errors && errors?.name && !purchaseData?.name ) && 'is-invalid'}` )}
                                // secondaryOption={
                                //     <div className='d-flex flex-items-center'>
                                //         <ErpInput
                                //             style={{
                                //                 borderRight: "none",
                                //                 borderLeft: "none",
                                //                 borderRadius: "0px",
                                //                 width: "40px"
                                //             }}
                                //             sideBySide={false}
                                //             value={purchaseData.name.split( '-' )[1]}
                                //             onChange={( e ) => { handleInputOnChange( e ) }}
                                //             className={classNames( `erp-dropdown-select ${( errors && errors?.name && !purchaseData?.name ) && 'is-invalid'}` )}
                                //         />
                                //         <ErpInput
                                //             style={{
                                //                 borderLeft: "none",
                                //                 borderRadius: "0px",
                                //                 width: "100px"

                                //             }}
                                //             sideBySide={false}
                                //             value={purchaseData.name.split( '-' )[2]}
                                //             onChange={( e ) => { handleInputOnChange( e ) }}
                                //             className={classNames( `erp-dropdown-select ${( errors && errors?.name && !purchaseData?.name ) && 'is-invalid'}` )}
                                //         />
                                //     </div>
                                // }
                                />

                            </Col>
                            <Col md={3} xl={3} xxl={3}>
                                <ErpInput
                                    classNames="mt-1"
                                    sideBySide={false}
                                    label="PO Date"
                                    placeholder="Purchase Date"
                                    type="date"
                                    name="date"
                                    value={purchaseData.date}
                                    onChange={( e ) => { handleInputOnChange( e ) }}
                                />
                            </Col>


                            <Col md={3} xl={3} xxl={3}>
                                <ErpSelect
                                    label="Currency"
                                    classNames="mt-1"
                                    name="currencyId"
                                    sideBySide={false}
                                    options={currencyDataCm}
                                    value={purchaseData.currencyId}
                                    onFocus={() => { handleCurrencyOnFocus() }}
                                    onChange={( data, e ) => { handleDropDownChange( data, e ); }}
                                    className={classNames( `erp-dropdown-select ${( errors && errors?.currency && !purchaseData?.currencyId ) && 'is-invalid'}` )}
                                />

                            </Col>

                            <Col md={3} xl={3} xxl={3}>
                                <ErpInput
                                    sideBySide={false}
                                    label="Currency Rate"
                                    classNames="mt-1"
                                    placeholder="Currency Rate"
                                    name="currencyRate"
                                    type="number"
                                    value={purchaseData.currencyRate}
                                    onFocus={( e ) => { e.target.select() }}
                                    onChange={( e ) => { handleInputOnChange( e ) }}
                                    className={classNames( `text-end erp-dropdown-select ${( errors && errors?.currencyRate && !purchaseData?.currencyRate ) && 'is-invalid'}` )}

                                />

                            </Col>




                            <Col md={3} xl={3} xxl={3}>
                                <ErpSelect
                                    label="Pay Term"
                                    classNames="mt-1"
                                    name="payTerm"
                                    sideBySide={false}
                                    options={payTerms}
                                    value={purchaseData.payTerm}
                                    onChange={( data, e ) => { handleDropDownChange( data, e ); }}
                                // className={classNames( `erp-dropdown-select ${( errors && errors?.currency && !purchaseData?.currencyId ) && 'is-invalid'}` )}
                                />


                            </Col>
                            <Col md={3} xl={3} xxl={3}>
                                <ErpSelect
                                    label="Trade Terms"
                                    classNames="mt-1"
                                    name="tradeTerm"
                                    sideBySide={false}
                                    options={tradeTerms}
                                    value={purchaseData.tradeTerm}
                                    onChange={( data, e ) => { handleDropDownChange( data, e ); }}
                                // className={classNames( `erp-dropdown-select ${( errors && errors?.currency && !purchaseData?.currencyId ) && 'is-invalid'}` )}
                                />


                            </Col>

                            <Col md={3} xl={3} xxl={3}>
                                <ErpInput
                                    classNames="mt-1"
                                    sideBySide={false}
                                    label="Last Date of Shipment"
                                    placeholder="Delivery Date"
                                    name="lastDateOfShipment"
                                    type="date"
                                    min={purchaseData?.date}
                                    disabled={!purchaseData?.date}
                                    value={purchaseData.lastDateOfShipment}
                                    onChange={( e ) => { handleInputOnChange( e ) }}
                                />
                            </Col>
                            <Col md={3} xl={3} xxl={3}>
                                <ErpInput
                                    classNames="mt-1"
                                    sideBySide={false}
                                    label="Expiry Date"
                                    placeholder="Expiry Date"
                                    name="expiryDate"
                                    type="date"
                                    min={purchaseData?.lastDateOfShipment ? purchaseData?.lastDateOfShipment : purchaseData?.date}
                                    disabled={!purchaseData.date}
                                    value={purchaseData.expiryDate}
                                    onChange={( e ) => { handleInputOnChange( e ) }}
                                />
                            </Col>



                            <Col md={3} xl={3} xxl={3}>

                                <ErpSelect
                                    label="Receive Point"
                                    classNames="mt-1"
                                    name="receivePoint"
                                    sideBySide={false}
                                    options={warehouseDataCm}
                                    value={purchaseData.receivePoint}
                                    onFocus={() => { handleWarehouseOnFocus() }}
                                    onChange={( data, e ) => { handleDropDownChange( data, e ); }}
                                    className={classNames( `erp-dropdown-select ${( errors && errors?.type && !purchaseData?.type ) && 'is-invalid'}` )}

                                />
                                {errors?.receivePoint && !purchaseData?.receivePoint && <small className="text-danger">Receive Point is required.</small>}

                            </Col>

                            <Col md={3} xl={3} xxl={3}>
                                <ErpSelect
                                    label="Shipment Mode"
                                    classNames="mt-1"
                                    name="shipmentMode"
                                    sideBySide={false}
                                    options={shipmentModes}
                                    value={purchaseData.shipmentMode}
                                    onChange={( data, e ) => { handleDropDownChange( data, e ); }}
                                // className={classNames( `erp-dropdown-select ${( errors && errors?.currency && !purchaseData?.currencyId ) && 'is-invalid'}` )}
                                />
                            </Col>

                            <Col md={3} xl={3} xxl={3}>
                                <ErpInput
                                    classNames="mt-1"
                                    sideBySide={false}
                                    label="Total Amount"
                                    disabled
                                    value={purchaseData?.items ? _.sum( purchaseData?.items?.map( dd => dd?.quantity * dd?.price ) ) : ""}
                                />
                            </Col>
                            <Col md={3} xl={3} xxl={3}>
                                <InInput
                                    // classNames="mt-1"
                                    label="Remarks"
                                    placeholder="Write Here..."
                                    name="note"
                                    type="textarea"
                                    value={purchaseData.note}
                                    onChange={( e ) => { handleInputOnChange( e ) }}
                                />
                            </Col>

                            <hr className="mt-2" />
                            <Col md={12} className="mb-2">
                                <ErpSelect
                                    sideBySide={false}
                                    classNames="mt-1"
                                    // options={productOptions}
                                    placeholder="Type Product Name to Search..."
                                    value={""}
                                    // onInputChange={( data, e ) => { handleItemChange( data, e ); }}
                                    options={itemsDataCm}
                                    onFocus={() => { handleItemsOnFocus() }}
                                    onChange={( data, e ) => { handleItemChange( data, e ); }}
                                    components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
                                    openMenuOnFocus={false}
                                    openMenuOnClick={false}
                                />
                            </Col>
                            <div className="">
                                <table className='w-100 border'>
                                    <thead>
                                        <tr className='' style={{ backgroundColor: "#f0f1f2" }}>
                                            <th>SL</th>
                                            <th>Item Name</th>
                                            <th>Unit</th>
                                            <th className='text-center'>Quantity</th>
                                            <th className='text-center'>Unit Price</th>
                                            <th className='text-center'>Total</th>
                                            <th className='text-center'>Remove</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            purchaseData?.items?.map( ( row, i ) => (
                                                <tr key={i}>
                                                    <td className="text-center" style={{ border: "1px solid #edebeb" }}
                                                    >{i + 1}</td>

                                                    <td
                                                        style={{ width: "70%", border: "1px solid #edebeb" }}
                                                    >
                                                        <span className="ms-1">{row.description}</span>
                                                    </td>
                                                    <td
                                                        className="text-center"
                                                        style={{
                                                            border: "1px solid #edebeb",
                                                            width: "150px"
                                                        }}>
                                                        <ErpSelect
                                                            sideBySide={false}
                                                            name="uomId"
                                                            isClearable
                                                            options={unitDataCm}
                                                            value={row.uomId}
                                                            onFocus={() => { handleUnitOnFocus() }}
                                                            onChange={( data, e ) => { handleItemDropDownChange( row.id, data, e ); }}
                                                        //
                                                        />
                                                    </td>
                                                    <td
                                                        style={{ border: "1px solid #edebeb" }}
                                                    >
                                                        <ErpInput
                                                            name="quantity"
                                                            className="text-end"
                                                            type="number"
                                                            sideBySide={false}
                                                            value={row.quantity}
                                                            onChange={( e ) => { handleItemInputChange( row.id, e ); }}
                                                        // invalid={errors && errors?.quantity && !purchaseData?.items?.quantity}
                                                        />
                                                    </td>
                                                    {/* {errors?.quantity && !purchaseData?.items?.quantity && <small className="text-danger">Quantity is required.</small>} */}
                                                    <td
                                                        style={{ border: "1px solid #edebeb" }}
                                                    >
                                                        <ErpInput
                                                            name="price"
                                                            className="text-end"
                                                            type="number"
                                                            sideBySide={false}
                                                            value={row.price}
                                                            onChange={( e ) => { handleItemInputChange( row.id, e ); }}
                                                        // invalid={errors && errors?.price && !purchaseData?.items?.price}
                                                        />
                                                    </td>
                                                    <td
                                                        style={{ border: "1px solid #edebeb" }}
                                                    >
                                                        <ErpInput
                                                            name="price"
                                                            className="text-end"
                                                            type="number"
                                                            sideBySide={false}
                                                            disabled
                                                            value={( row.quantity * row.price ).toFixed( 2 )}
                                                            onChange={( e ) => { handleItemInputChange( row.id, e ); }}
                                                        // invalid={errors && errors?.price && !purchaseData?.items?.price}
                                                        />
                                                    </td>
                                                    {/* {errors?.price && !purchaseData?.items?.price && <small className="text-danger">Price is required.</small>} */}
                                                    <td className='text-center' style={{ border: "1px solid #edebeb" }}>
                                                        <Button.Ripple
                                                            // disabled={rows.length === 1}
                                                            onClick={() => { handleRowsDelete( row.id ); }}
                                                            className="btn-icon"
                                                            color="flat-light"
                                                        >
                                                            <MinusSquare
                                                                className='cursor-pointer'
                                                                color='red'
                                                                size={18}
                                                            />
                                                        </Button.Ripple>
                                                    </td>
                                                </tr>
                                            ) )
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </FormContentLayout>
                    </div>

                </FormLayout >
            </div >

        </ >
    );
};

export default PurchaseForm;