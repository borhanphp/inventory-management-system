import { yupResolver } from '@hookform/resolvers/yup';
import classNames from "classnames";
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
import { getAllCurrencyCm, getAllItemsCm, getAllSupplierCm } from "../../../../redux/common/store";
import ErpInput from '../../../../utility/custom/ErpInput';
import ErpSelect from "../../../../utility/custom/ErpSelect";
import FormContentLayout from '../../../../utility/custom/FormContentLayout';
import FormLayout from '../../../../utility/custom/FormLayout';
import InInput from '../../../../utility/custom/InInput';
import { initialPurchaseData } from "../../purchase/store/model";
import { addNewPurchase, bindPurchaseInfo } from "../store";

const breadcrumb = [
    {
        id: 'home',
        name: 'Home',
        link: "/",
        isActive: false,
        hidden: false
    }
];

const ScLcForm = () => {
    const { itemsDataCm, currencyDataCm, supplierDataCm } = useSelector( ( { commons } ) => commons )
    const { purchaseData } = useSelector( ( { purchase } ) => purchase );
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const purchaseSchema = yup.object().shape( {
        name: purchaseData?.name?.length ? yup.string() : yup.string().required( 'PO Code is Required!!!' ),
        supplier: purchaseData?.supplierId ? yup.string() : yup.string().required( 'Supplier is Required!!!' ),
        type: purchaseData?.type ? yup.string() : yup.string().required( 'Type is Required!!!' ),
        currency: purchaseData?.currencyId ? yup.string() : yup.string().required( 'Currency is Required!!!' ),
        currencyRate: purchaseData?.currencyRate?.length ? yup.string() : yup.string().required( 'Rate is Required!!!' ),
        // quantity: purchaseData?.items?.quantity?.length ? yup.string() : yup.string().required( 'Quantity is Required!!!' ),
        // price: purchaseData?.items?.price?.length ? yup.string() : yup.string().required( 'Price is Required!!!' ),
    } );
    const { reset, handleSubmit, formState: { errors } } = useForm( {
        mode: 'onChange',
        resolver: yupResolver( purchaseSchema )
    } );

    useEffect( () => {
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
        const updatedObj = {
            ...purchaseData,
            [name]: value
        };
        dispatch( bindPurchaseInfo( updatedObj ) )
    }

    const handleDropDownChange = ( data, e ) => {
        const { name } = e
        dispatch( bindPurchaseInfo( { ...purchaseData, [name]: data } ) )

    }

    const handleItemInputChange = ( itemId, e ) => {
        const { name, value } = e.target;
        const updatedItems = purchaseData?.items?.map( ( item ) =>
            item?.id === itemId ? { ...item, [name]: value } : item
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
            price: ''
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

    const handleOnSubmit = () => {
        if ( !purchaseData?.items?.length ) {
            toast.error( 'At Least one item is required' )
        } else {
            const submittedData = {
                ...purchaseData,
                supplierId: purchaseData.supplierId.value,
                currencyId: purchaseData.currencyId.value,
                currencyRate: Number( purchaseData.currencyRate ),
                type: purchaseData.type.value,
                status: "Open",
                items: purchaseData?.items.map( ( item ) => ( {
                    itemId: item.id,
                    quantity: Number( item.quantity ),
                    price: Number( item.price )
                } ) )
            }
            dispatch( addNewPurchase( submittedData ) )
                .then( () => {
                    toast.success( 'Purchase Successful' );
                    dispatch( bindPurchaseInfo( initialPurchaseData ) )
                } )
                .catch( ( error ) => console.log( error ) )
        }

    }

    const typeOptions = [
        { label: 'Import', value: 'Import' },
        { label: 'Inland_Purchase', value: 'Inland_Purchase' },
        { label: 'D2D', value: 'D2D' },
    ]

    const handleRowsDelete = ( id ) => {
        const filteredData = purchaseData?.items?.filter( d => d.id !== id )
        dispatch( bindPurchaseInfo( { ...purchaseData, items: filteredData } ) )
    }


    return (
        <>
            <ActionMenu
                title='New Purchase'
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
                        color="danger"
                        onClick={() => { handleCancel() }}
                    >
                        Cancel
                    </Button>
                </NavItem>
            </ActionMenu>

            <div className='mt-3'>
                <FormLayout>
                    <div >
                        <FormContentLayout title="Purchase Information">
                            <Col md={3} xl={3} xxl={3}>
                                <ErpInput
                                    classNames="mt-1"
                                    sideBySide={false}
                                    label="Purchase Order Code"
                                    placeholder="EX: PO10001"
                                    name="name"
                                    value={purchaseData.name}
                                    onChange={( e ) => { handleInputOnChange( e ) }}
                                    invalid={errors && errors?.name && !purchaseData?.name}
                                />
                                {errors?.name && !purchaseData?.name && <small className="text-danger">PO Code is required.</small>}

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
                                {errors?.supplier && !purchaseData?.supplierId && <small className="text-danger">Supplier is required.</small>}

                            </Col>
                            <Col md={3} xl={3} xxl={3}>
                                <ErpInput
                                    classNames="mt-1"
                                    sideBySide={false}
                                    label="Purchase Date"
                                    placeholder="Purchase Date"
                                    type="date"
                                    name="date"
                                    value={purchaseData.date}
                                    onChange={( e ) => { handleInputOnChange( e ) }}
                                />
                            </Col>
                            <Col md={3} xl={3} xxl={3}>
                                <ErpInput
                                    classNames="mt-1"
                                    sideBySide={false}
                                    label="Delivery Date"
                                    placeholder="Delivery Date"
                                    name="deliveryDate"
                                    type="date"
                                    value={purchaseData.deliveryDate}
                                    onChange={( e ) => { handleInputOnChange( e ) }}
                                />
                            </Col>
                            <Col md={3} xl={3} xxl={3}>
                                <ErpSelect
                                    label="Type"
                                    classNames="mt-1"
                                    name="type"
                                    sideBySide={false}
                                    options={typeOptions}
                                    value={purchaseData.type}
                                    onChange={( data, e ) => { handleDropDownChange( data, e ); }}
                                    className={classNames( `erp-dropdown-select ${( errors && errors?.type && !purchaseData?.type ) && 'is-invalid'}` )}

                                />
                                {errors?.type && !purchaseData?.type && <small className="text-danger">Type is required.</small>}
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
                                {errors?.currency && !purchaseData?.currencyId && <small className="text-danger">Currency is required.</small>}

                            </Col>
                            <Col md={3} xl={3} xxl={3}>
                                <ErpInput
                                    classNames="mt-1"
                                    sideBySide={false}
                                    label="Currency Rate"
                                    placeholder="Currency Rate"
                                    name="currencyRate"
                                    type="number"
                                    value={purchaseData.currencyRate}
                                    onChange={( e ) => { handleInputOnChange( e ) }}
                                    invalid={errors && errors?.currencyRate && !purchaseData?.currencyRate}

                                />
                                {errors?.currencyRate && !purchaseData?.currencyRate && <small className="text-danger">Rate is required.</small>}

                            </Col>

                            <Col md={3} xl={3} xxl={3}>
                                <ErpInput
                                    classNames="mt-1"
                                    sideBySide={false}
                                    label="Receive Point"
                                    placeholder="Receive Point"
                                    name="receivePoint"
                                    value={purchaseData.receivePoint}
                                    onChange={( e ) => { handleInputOnChange( e ) }}
                                    invalid={errors && errors?.receivePoint && !purchaseData?.receivePoint}
                                />
                                {errors?.receivePoint && !purchaseData?.receivePoint && <small className="text-danger">Receive Point is required.</small>}

                            </Col>
                            <Col md={3} xl={3} xxl={3}>
                                <InInput
                                    // classNames="mt-1"
                                    label="Note"
                                    placeholder="Write Description"
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
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            purchaseData?.items?.map( ( row, i ) => (
                                                <tr key={i}>
                                                    <td className="text-center" style={{ border: "1px solid #edebeb" }}>{i + 1}</td>

                                                    <td style={{ width: "70%", border: "1px solid #edebeb" }}>
                                                        <span className="ms-1">{row.description}</span>
                                                    </td>
                                                    <td style={{ border: "1px solid #edebeb" }}>
                                                        <ErpInput
                                                            name="quantity"
                                                            sideBySide={false}
                                                            value={row.quantity}
                                                            onChange={( e ) => { handleItemInputChange( row.id, e ); }}
                                                        // invalid={errors && errors?.quantity && !purchaseData?.items?.quantity}
                                                        />
                                                    </td>
                                                    {/* {errors?.quantity && !purchaseData?.items?.quantity && <small className="text-danger">Quantity is required.</small>} */}
                                                    <td style={{ border: "1px solid #edebeb" }}>
                                                        <ErpInput
                                                            name="price"
                                                            sideBySide={false}
                                                            value={row.price}
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

export default ScLcForm;