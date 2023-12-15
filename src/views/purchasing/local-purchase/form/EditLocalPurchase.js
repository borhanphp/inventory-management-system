import { yupResolver } from '@hookform/resolvers/yup';
import classNames from "classnames";
import _ from 'lodash';
import moment from 'moment';
import { useEffect, useState } from "react";
import { MinusSquare } from "react-feather";
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
    Button,
    Col, FormGroup, Input, Modal, ModalBody, ModalHeader, NavItem
} from "reactstrap";
import * as yup from 'yup';
import ActionMenu from '../../../../@core/layouts/components/ActionMenu';
import '../../../../assets/scss/item/item-style.scss';
import { getAllItemsCm, getAllSupplierCm } from "../../../../redux/common/store";
import ErpInput from '../../../../utility/custom/ErpInput';
import ErpSelect from "../../../../utility/custom/ErpSelect";
import FormContentLayout from '../../../../utility/custom/FormContentLayout';
import FormLayout from '../../../../utility/custom/FormLayout';
import InInput from '../../../../utility/custom/InInput';
import { getPurchaseByFilter, getPurchaseById } from '../../purchase/store';
import { bindLocalPurchaseInfo, getLocalPurchaseById, updateLocalPurchase } from "../store";
import { initialLocalPurchaseData } from "../store/model";
const breadcrumb = [
    {
        id: 'home',
        name: 'Home',
        link: "/",
        isActive: false,
        hidden: false
    }
];

const EditLocalPurchase = () => {
    const { itemsDataCm, currencyDataCm, supplierDataCm } = useSelector( ( { commons } ) => commons )
    const { basicLocalPurchaseData } = useSelector( ( { localPurchase } ) => localPurchase );
    const { allPurchase, purchaseData } = useSelector( ( { purchase } ) => purchase );
    const [selectedData, setSelectedData] = useState( [] );
    const [poModalOpen, setPoModalOpen] = useState( false );
    const [checkAll, setCheckAll] = useState( false )
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const location = useLocation()
    console.log( 'basicLocalPurchaseData', basicLocalPurchaseData )
    const localPurchaseId = location.state;

    const selectedItems = purchaseData?.items?.filter( item => selectedData.some( selectedItem => selectedItem === item.id ) );

    const purchaseSchema = yup.object().shape( {
        supplierInvoiceCode: basicLocalPurchaseData?.supplierInvoiceCode?.length ? yup.string() : yup.string().required( 'PO Code is Required!!!' ),
        supplier: basicLocalPurchaseData?.supplierId ? yup.string() : yup.string().required( 'Supplier is Required!!!' ),
        invoiceType: basicLocalPurchaseData?.invoiceType ? yup.string() : yup.string().required( 'Type is Required!!!' ),
        supplierInvoiceDate: basicLocalPurchaseData?.supplierInvoiceDate ? yup.string() : yup.string().required( 'Type is Required!!!' )

    } );
    const { reset, handleSubmit, formState: { errors } } = useForm( {
        mode: 'onChange',
        resolver: yupResolver( purchaseSchema )
    } );

    const calculateFunction = () => {
        const totalAmount = _.sum( basicLocalPurchaseData?.items?.map( item => item.price * item.quantity ) );
        dispatch( bindLocalPurchaseInfo( {
            ...basicLocalPurchaseData,
            totalAmount: totalAmount
        } ) )
    }

    useEffect( () => {
        dispatch( getLocalPurchaseById( localPurchaseId ) )
        return () => {
            dispatch( bindLocalPurchaseInfo() )
        }
    }, [] )

    useEffect( () => {
        calculateFunction();
    }, [basicLocalPurchaseData?.items] )

    const handleCancel = () => {
        navigate( '/purchase-list' )
    }

    const clearAllField = () => {
        reset();
        dispatch( bindLocalPurchaseInfo( initialLocalPurchaseData ) )
    }

    const handleInputOnChange = ( e ) => {
        const { name, value } = e.target;
        if ( name === 'receivePoint' ) {
            if ( value?.length > 25 ) {
                toast.error( 'Maximum 25 Character Allowed' )
                return;
            }
        }
        if ( name === 'currencyRate' ) {
            if ( value < 1 ) {
                toast.error( 'Currency Rate should be more then 1' )
                return;
            }
        }

        const updatedObj = {
            ...basicLocalPurchaseData,
            [name]: value
        };
        dispatch( bindLocalPurchaseInfo( updatedObj ) )
    }

    const handleDropDownChange = ( data, e ) => {
        const { name } = e;
        if ( name === "poId" ) {
            dispatch( getPurchaseById( data.value ) )
        }
        dispatch( bindLocalPurchaseInfo( { ...basicLocalPurchaseData, [name]: data } ) )

    }

    const handleItemInputChange = ( itemId, e ) => {
        const { name, value } = e.target;
        if ( value < 0 ) {
            toast.error( 'Value must be greater than 0' )
            return;
        }
        const updatedItems = basicLocalPurchaseData?.items?.map( ( item ) =>
            item?.id === itemId ? { ...item, [name]: value } : item
        );
        dispatch( bindLocalPurchaseInfo( {
            ...basicLocalPurchaseData,
            items: updatedItems
        } ) )
    };


    const handleItemChange = ( data, e ) => {
        const { name } = e;
        const newItem = {
            ...data,
            quantity: '',
            price: ''
        };

        const duplicateItems = basicLocalPurchaseData?.items?.map( dd => dd?.id || dd?.itemId ).includes( data?.id )
        if ( duplicateItems ) {
            toast.success( 'Item already added!' )
        } else {
            dispatch( bindLocalPurchaseInfo( {
                ...basicLocalPurchaseData,
                items: [...basicLocalPurchaseData?.items, newItem]
            } ) )
        }

    }


    const handleModalOpen = () => {
        if ( !basicLocalPurchaseData?.poId ) {
            toast.error( 'Select a PO please' )
            return;
        } else {
            setPoModalOpen( true )
        }
    }
    const handleModalClosed = () => {
        setPoModalOpen( false )
    }


    const handleCheckAll = () => {
        setCheckAll( !checkAll );
        if ( !checkAll ) {
            const allItemIds = purchaseData?.items?.map( ( row ) => row.id ) || [];
            setSelectedData( allItemIds );
        } else {
            setSelectedData( [] );
        }
    };

    const handleSelectedRows = ( e, id ) => {
        if ( purchaseData?.items?.length === selectedData.length ) {
            setCheckAll( true )
        } else {
            setCheckAll( false )
        }
        if ( selectedData.includes( id ) ) {
            setSelectedData( selectedData.filter( item => item !== id ) );
        } else {
            setSelectedData( [...selectedData, id] );

        }
    };


    const handleModalSubmit = () => {
        dispatch( bindLocalPurchaseInfo( {
            ...basicLocalPurchaseData,
            items: [...basicLocalPurchaseData?.items, ...selectedItems]
        } ) )

        setPoModalOpen( false )
    }

    const paramsObj = {
        page: 1,
        pageSize: 100000000
    }

    const handleSupplierOnFocus = () => {
        if ( !supplierDataCm.length ) {
            dispatch( getAllSupplierCm() )
        }
    }
    const handlePoOnFocus = () => {
        if ( !allPurchase.length ) {
            dispatch( getPurchaseByFilter( paramsObj ) );
        }
    };


    const handleItemsOnFocus = () => {
        if ( !itemsDataCm.length ) {
            dispatch( getAllItemsCm() )
        }
    }

    const handleOnSubmit = () => {
        const { id, poId, supplierInvoiceCode, supplierInvoiceDate, supplierId, invoiceType, totalAmount, items } = basicLocalPurchaseData;
        const submittedData = {
            id: id,
            poId: poId?.value ? poId?.value : 0,
            supplierInvoiceCode: supplierInvoiceCode,
            supplierInvoiceDate: moment( supplierInvoiceDate ).format( 'YYYY-MM-DD' ),
            supplierId: supplierId?.value,
            invoiceType: invoiceType?.value,
            totalAmount: totalAmount,
            note: "",
            items: items.map( ( item ) => ( {
                id: item?.itemId ? item?.id : 0,
                poItemId: item?.poItemId ? item?.poItemId : 0,
                itemId: item?.itemId ? item?.itemId : item?.id,
                quantity: +item?.quantity,
                price: +item?.price,
                total: item?.quantity * item?.price
            } ) )
        };

        console.log( 'submittedData', JSON.stringify( submittedData, null, 2 ) );
        dispatch( updateLocalPurchase( submittedData ) )
            .then( ( res ) => {
                if ( res.error ) {
                    return;
                } else {
                    toast.success( 'Purchase Successful' );
                    dispatch( bindLocalPurchaseInfo( initialLocalPurchaseData ) )
                    navigate( '/local-purchase-list' );
                }

            } )
            .catch( ( error ) => console.log( error ) )

    }



    const handleRowsDelete = ( id ) => {
        const filteredData = basicLocalPurchaseData?.items?.filter( d => d.id !== id )
        dispatch( bindLocalPurchaseInfo( { ...basicLocalPurchaseData, items: filteredData } ) )
    }

    const invoiceTypes = [
        { label: 'Inland Purchase', value: 'Inland_Purchase' },
        { label: 'D2D', value: 'D2D' }
    ]

    console.log( 'basicLocalPurchaseData', basicLocalPurchaseData );

    return (
        <>
            <ActionMenu
                title='Edit Purchase Invoice'
                breadcrumb={breadcrumb}
            >
                <NavItem className="me-1" >
                    <Button
                        size="sm"
                        color="primary"
                        // onClick={() => { handleOnSubmit(); }}
                        onClick={handleSubmit( handleOnSubmit )}
                    >Submit</Button>
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
                        onClick={() => { navigate( -1 ) }}
                    >
                        Back
                    </Button>
                </NavItem>
            </ActionMenu>

            <div className='mt-3'>
                <FormLayout>
                    <div >
                        <FormContentLayout title="Purchase Information">
                            <Col md={3} xl={3} xxl={3}>
                                <ErpSelect
                                    label="PO Number"
                                    classNames="mt-1"
                                    name="poId"
                                    isDisabled={true}
                                    sideBySide={false}
                                    options={allPurchase}
                                    value={basicLocalPurchaseData.poId}
                                    onFocus={() => { handlePoOnFocus() }}
                                    onChange={( data, e ) => { handleDropDownChange( data, e ); }}
                                // secondaryOption={
                                //     <div className="input-group-append" style={{ zIndex: 0 }}>
                                //         <Button.Ripple
                                //             onClick={() => {
                                //                 handleModalOpen();
                                //             }}
                                //             style={{ minHeight: "30px", minWidth: "35px" }}
                                //             className="btn-icon w-100 pt-0 p-0 h-100"
                                //             color="primary"
                                //         >
                                //             <Plus size={16} />
                                //         </Button.Ripple>
                                //     </div>
                                // }
                                />

                            </Col>

                            <Col md={3} xl={3} xxl={3}>
                                <ErpSelect
                                    label="Invoice Type"
                                    classNames="mt-1"
                                    name="invoiceType"
                                    sideBySide={false}
                                    isDisabled={true}
                                    options={invoiceTypes}
                                    value={basicLocalPurchaseData.invoiceType}
                                    onChange={( data, e ) => { handleDropDownChange( data, e ); }}
                                    className={classNames( `erp-dropdown-select ${( errors && errors?.invoiceType && !basicLocalPurchaseData?.invoiceType ) && 'is-invalid'}` )}

                                />
                            </Col>

                            <Col md={3} xl={3} xxl={3}>
                                <ErpSelect
                                    label="Supplier"
                                    classNames="mt-1"
                                    name="supplierId"
                                    sideBySide={false}
                                    options={supplierDataCm}
                                    value={basicLocalPurchaseData.supplierId}
                                    onFocus={() => { handleSupplierOnFocus() }}
                                    onChange={( data, e ) => { handleDropDownChange( data, e ); }}
                                    className={classNames( `erp-dropdown-select ${( errors && errors?.supplier && !basicLocalPurchaseData?.supplierId ) && 'is-invalid'}` )}
                                />

                            </Col>
                            <Col md={3} xl={3} xxl={3}>
                                <ErpInput
                                    classNames="mt-1"
                                    sideBySide={false}
                                    label="Supplier Invoice Code"
                                    placeholder="EX: PO10001"
                                    name="supplierInvoiceCode"
                                    value={basicLocalPurchaseData.supplierInvoiceCode}
                                    onChange={( e ) => { handleInputOnChange( e ) }}
                                    className={classNames( `erp-dropdown-select ${( errors && errors?.supplierInvoiceCode && !basicLocalPurchaseData?.supplierInvoiceCode ) && 'is-invalid'}` )}
                                />

                            </Col>
                            <Col md={3} xl={3} xxl={3}>
                                <ErpInput
                                    classNames="mt-1"
                                    sideBySide={false}
                                    label="Supplier Invoice Date"
                                    type="date"
                                    name="supplierInvoiceDate"
                                    value={basicLocalPurchaseData.supplierInvoiceDate}
                                    onChange={( e ) => { handleInputOnChange( e ) }}
                                    className={classNames( `erp-dropdown-select ${( errors && errors?.supplierInvoiceDate && !basicLocalPurchaseData?.supplierInvoiceDate ) && 'is-invalid'}` )}
                                />
                            </Col>

                            <Col md={3} xl={3} xxl={3}>
                                <InInput
                                    // classNames="mt-1"
                                    label="Total Amount"
                                    className="text-end"
                                    type="number"
                                    disabled
                                    placeholder="Total Amount"
                                    name="totalAmount"
                                    value={basicLocalPurchaseData.totalAmount}
                                    onChange={( e ) => { handleInputOnChange( e ) }}
                                />
                            </Col>
                            <Col md={3} xl={3} xxl={3}>
                                <InInput
                                    // classNames="mt-1"
                                    label="Note"
                                    placeholder="Write Description"
                                    name="note"
                                    type="textarea"
                                    value={basicLocalPurchaseData.note}
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
                                    value={null}
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
                                            <th>Quantity</th>
                                            <th>Price</th>
                                            <th>Total</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            basicLocalPurchaseData?.items?.map( ( row, i ) => (
                                                <tr key={i}>
                                                    <td className="text-center" style={{ border: "1px solid #edebeb" }}
                                                    >{i + 1}</td>

                                                    <td
                                                        style={{ width: "70%", border: "1px solid #edebeb" }}
                                                    >
                                                        <span className="ms-1">{row.description}</span>
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
                                                        // invalid={errors && errors?.quantity && !basicLocalPurchaseData?.items?.quantity}
                                                        />
                                                    </td>
                                                    {/* {errors?.quantity && !basicLocalPurchaseData?.items?.quantity && <small className="text-danger">Quantity is required.</small>} */}
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
                                                        // invalid={errors && errors?.price && !basicLocalPurchaseData?.items?.price}
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
                                                        // invalid={errors && errors?.price && !basicLocalPurchaseData?.items?.price}
                                                        />
                                                    </td>
                                                    {/* {errors?.price && !basicLocalPurchaseData?.items?.price && <small className="text-danger">Price is required.</small>} */}
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

            <Modal
                isOpen={poModalOpen}
                onClosed={handleModalClosed}
                toggle={() => setPoModalOpen( !poModalOpen )}
                className="modal-dialog-centered modal-xl"
            >
                <ModalHeader
                    className="bg-light"
                    toggle={() => setPoModalOpen( !poModalOpen )}
                >
                    Select Items for Local Purchase Invoice
                </ModalHeader>
                <ModalBody className="px-5 pb-5">
                    <div className="">
                        <table className='w-100 border'>
                            <thead>
                                <tr className='text-center' style={{ backgroundColor: "#f0f1f2" }}>
                                    <th>SL</th>
                                    <th>
                                        <FormGroup check
                                            className="text-center mx-1"
                                        >
                                            <Input
                                                className="text-center"
                                                type="checkbox"
                                                name="checkAll"
                                                checked={purchaseData?.items?.length === selectedData?.length}
                                                // checked={!!( purchaseData?.items?.length && ( purchaseData?.items?.length === selectedData?.length ) )}
                                                onChange={handleCheckAll}
                                            />
                                        </FormGroup>
                                    </th>
                                    <th>Item Name</th>
                                    <th>Unit</th>
                                    <th>Quantity</th>
                                    <th>Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    purchaseData?.items?.map( ( row, i ) => (

                                        <tr key={i}>
                                            <td
                                                className="text-center"
                                                style={{
                                                    border: "1px solid #edebeb"
                                                }}>
                                                {i + 1}
                                            </td>

                                            <td
                                                className="text-center"
                                                style={{
                                                    border: "1px solid #edebeb",
                                                    width: "10px"
                                                }}>

                                                <FormGroup check
                                                    className="text-center mx-1"
                                                >
                                                    <Input
                                                        className="text-center"
                                                        type="checkbox"
                                                        name="scitemcheck"
                                                        checked={selectedData.includes( row.id )}
                                                        onChange={( e ) => handleSelectedRows( e, row.id )}
                                                    />{" "}
                                                </FormGroup>
                                            </td>

                                            <td style={{
                                                border: "1px solid #edebeb"
                                            }}>
                                                <span className="ms-1">
                                                    {row.description}
                                                </span>
                                            </td>
                                            <td
                                                className="text-center"
                                                style={{
                                                    border: "1px solid #edebeb",
                                                    width: "100px"
                                                }}>
                                                {
                                                    row?.isEdit ?
                                                        <ErpSelect
                                                            sideBySide={false}
                                                            name="uoMId"
                                                            isClearable
                                                            options={unitDataCm}
                                                            value={row.uoMId}
                                                            onFocus={() => { handleUnitOnFocus() }}
                                                            onChange={( data, e ) => { handleItemDropDownChange( row.id, data, e ); }}
                                                        //
                                                        />
                                                        : row.uoM
                                                }
                                            </td>
                                            <td
                                                className="text-end"
                                                style={{
                                                    border: "1px solid #edebeb",
                                                    width: "100px"
                                                }}>
                                                {
                                                    row?.isEdit ?
                                                        <CustomInput
                                                            className="text-end"
                                                            name="quantity"
                                                            value={row.quantity}
                                                            onChange={( e ) => { handleItemInputChange( row.id, e ); }}
                                                        />
                                                        :
                                                        row.quantity

                                                }

                                            </td>
                                            <td
                                                className="text-end"
                                                style={{
                                                    border: "1px solid #edebeb",
                                                    width: "100px",
                                                    height: "33px"
                                                }}>
                                                {
                                                    row?.isEdit ?
                                                        <CustomInput
                                                            className="text-end"
                                                            name="price"
                                                            value={row.price}
                                                            onChange={( e ) => { handleItemInputChange( row.id, e ); }}
                                                        />
                                                        :
                                                        row.price
                                                }
                                            </td>
                                        </tr>
                                    ) )
                                }
                            </tbody>
                        </table>

                        <Button.Ripple
                            // disabled={rows.length === 1}
                            onClick={() => { handleModalSubmit() }}
                            className="btn-icon float-end mt-1"
                            color="primary"
                        >
                            Ok
                        </Button.Ripple>
                    </div>
                </ModalBody>
            </Modal>

        </ >
    );
};

export default EditLocalPurchase;