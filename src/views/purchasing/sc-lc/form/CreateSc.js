import { yupResolver } from '@hookform/resolvers/yup';
import classNames from 'classnames';
import { useEffect, useState } from "react";
import { CheckSquare, Delete, Edit, Plus } from "react-feather";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
    Button,
    Col, FormGroup, Input, Modal, ModalBody, ModalHeader, NavItem
} from "reactstrap";
import * as yup from 'yup';
import ActionMenu from '../../../../@core/layouts/components/ActionMenu';
import '../../../../assets/scss/item/item-style.scss';
import { getAllBanksCm, getAllBuyersCm, getAllCurrencyCm, getAllUnitCm } from "../../../../redux/common/store";
import { confirmDialog } from '../../../../utility/custom/ConfirmDialog';
import ErpSelect from "../../../../utility/custom/ErpSelect";
import FormContentLayout from '../../../../utility/custom/FormContentLayout';
import FormLayout from '../../../../utility/custom/FormLayout';
import GsTooltip from '../../../../utility/custom/GsTooltip';
import InInput from "../../../../utility/custom/InInput";
import { payTerms } from '../../../../utility/enums';
import { getPurchaseByFilter, getPurchaseById } from "../../purchase/store";
import { addNewSc, bindScInfo } from "../store";
import { initialScData } from "../store/model";



const breadcrumb = [
    {
        id: 'home',
        name: 'Home',
        link: "/",
        isActive: false,
        hidden: false
    }
];

const CustomInput = ( props ) => {
    const { type, value, onChange, name, ...rest } = props;
    return (
        <Input
            name={name}
            type={type ? type : 'text'}
            value={value}
            bsSize="sm"
            onChange={onChange}
            {...rest}
        />
    );
};

const Td = ( props ) => {
    const { children, ...rest } = props;
    return (
        <td
            className={`text-center`}
            style={{
                border: "1px solid #edebeb",
                width: "100px"
            }}
        >
            {children}
        </td>
    )
}




const CreateScLcForm = () => {
    const { itemsDataCm, currencyDataCm, unitDataCm, buyersDataCm, banksDataCm } = useSelector( ( { commons } ) => commons )
    const { scData } = useSelector( ( { sc } ) => sc );
    const { allPurchase, purchaseData } = useSelector( ( { purchase } ) => purchase );
    const [selectedData, setSelectedData] = useState( [] );
    const [poModalOpen, setPoModalOpen] = useState( false );
    const [checkAll, setCheckAll] = useState( false )
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const location = useLocation()

    const selectedItems = purchaseData?.items?.filter( item => selectedData.some( selectedItem => selectedItem === item.id ) );
    console.log( 'scData', scData );

    const purchaseId = location.state

    const scSchema = yup.object().shape( {
        salesContractCode: scData?.salesContractCode?.length ? yup.string() : yup.string().required( 'PO Code is Required!!!' ),
        salesContractDate: scData?.salesContractDate ? yup.string() : yup.string().required( 'PO Code is Required!!!' ),
        lastDateOfShipment: scData?.lastDateOfShipment ? yup.string() : yup.string().required( 'PO Code is Required!!!' ),
        buyerId: scData?.buyerId ? yup.string() : yup.string().required( 'PO Code is Required!!!' ),
        consigneeId: scData?.consigneeId ? yup.string() : yup.string().required( 'PO Code is Required!!!' ),
        currencyId: scData?.currencyId ? yup.string() : yup.string().required( 'PO Code is Required!!!' ),
        currencyRate: scData?.currencyRate ? yup.string() : yup.string().required( 'PO Code is Required!!!' )
    } );
    const { reset, handleSubmit, formState: { errors } } = useForm( {
        mode: 'onChange',
        resolver: yupResolver( scSchema )
    } );

    const calculateFunction = () => {
        const subAmount = scData?.items?.map( item => item.price * item.quantity ).reduce( ( a, b ) => a + b, 0 );
        const discountAmount = ( subAmount * ( scData?.discountPercentage || 0 ) ) / 100;

        dispatch( bindScInfo( {
            ...scData,
            subTotalAmount: subAmount,
            discountedAmount: discountAmount
        } ) )
    }


    useEffect( () => {
        calculateFunction();
        return () => {
            dispatch( bindScInfo( initialScData ) )
        }
    }, [scData?.items, scData?.discountPercentage, scData?.subTotalAmount] )

    const handleDropDownChange = ( data, e ) => {
        const { name } = e
        if ( name === "poId" ) {
            dispatch( getPurchaseById( data.value ) )
                .then( ( res ) => {
                    const { currencyRate, currencyId, paymentTermId } = res.payload;
                    const updatedObj = {
                        ...scData,
                        [name]: data,
                        currencyRate: currencyRate,
                        currencyId: currencyId,
                        termsPayment: { label: paymentTermId.label, value: paymentTermId.label }
                    };
                    // console.log( 'paymentTermId from po', updatedObj )

                    dispatch( bindScInfo( updatedObj ) );
                } )
        } else if ( name === "buyerId" ) {
            const updatedObj = {
                ...scData,
                [name]: data,
                consigneeId: data
            };
            dispatch( bindScInfo( updatedObj ) )

        } else {
            const updatedObj = {
                ...scData,
                [name]: data
            };
            dispatch( bindScInfo( updatedObj ) )
        }

    }

    const handleInputOnChange = ( e ) => {
        const { name, value, type } = e.target;
        const updatedObj = {
            ...scData,
            [name]: type === "number" ? Number( value ) : value
        };
        dispatch( bindScInfo( updatedObj ) )
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
        dispatch( bindScInfo( {
            ...scData,
            items: selectedItems.map( d => ( { ...d, uoMId: { label: d.uoM, value: d.uoMId } } ) ),
            subTotalAmount: scData?.subTotalAmount
        } ) )
        setPoModalOpen( false )
    }


    // const handleSelectedRows = ( e, row ) => {
    //     if ( e.target.checked ) {
    //         setSelectedData( [...selectedData, row] );
    //     } else {
    //         setSelectedData( selectedData.filter( item => item.id !== row.id ) );
    //     }
    // };


    const handleModalOpen = () => {
        if ( !scData?.poId ) {
            toast.error( 'Select a PO please' )
            return;
        } else {
            setPoModalOpen( true )
        }
    }
    const handleModalClosed = () => {
        setPoModalOpen( false )
    }

    const handleItemsEditControl = rowId => {
        const { items } = scData;
        const updatedItems = items.map( row => {
            if ( row.id === rowId ) {
                return {
                    ...row,
                    isEdit: true
                }
            }
            return row;
        } )

        const updatedBasicInfo = {
            ...scData,
            items: updatedItems
        }
        dispatch( bindScInfo( updatedBasicInfo ) )
    };


    const handleItemsSubmitControl = rowId => {
        const { items } = scData;
        const updatedItems = items.map( row => {
            if ( row.id === rowId ) {
                return {
                    ...row,
                    isEdit: false,
                };
            }
            return row;
        } );
        const updateBasicInfo = {
            ...scData,
            items: updatedItems
        }
        dispatch( bindScInfo( updateBasicInfo ) )
    };




    const handleItemInputChange = ( itemId, e ) => {
        const { name, value } = e.target;
        if ( name === 'quantity' || name === 'price' ) {
            if ( value <= 0 ) {
                toast.error( 'Value should be more then 0' )
            } else {
                const updatedItems = scData?.items?.map( ( item ) =>
                    item?.id === itemId ? { ...item, [name]: value } : item
                );
                dispatch( bindScInfo( {
                    ...scData,
                    items: updatedItems
                } ) )
            }
        } else {
            const updatedItems = scData?.items?.map( ( item ) =>
                item?.id === itemId ? { ...item, [name]: value } : item
            );
            dispatch( bindScInfo( {
                ...scData,
                items: updatedItems
            } ) )
        }

    };

    const handleItemDropDownChange = ( itemId, data, e ) => {
        const { name } = e;
        const updatedItems = scData?.items?.map( ( item ) =>
            item?.id === itemId ? { ...item, [name]: data } : item
        );
        dispatch( bindScInfo( {
            ...scData,
            items: updatedItems
        } ) )
    };

    const handleItemChange = ( data, e ) => {
        const { name } = e;
        const newItem = {
            ...data,
            quantity: '',
            price: '',
            uoM: ''
        };

        const duplicateItems = scData?.items?.map( dd => dd.itemId ).includes( data?.id )
        if ( duplicateItems ) {
            toast.success( 'Item already added!' )
        } else {
            dispatch( bindScInfo( {
                ...scData,
                items: [...scData?.items, newItem]
            } ) )
        }
    }




    const handleOnSubmit = ( cb ) => {
        const {
            items,
            poId,
            buyerId,
            consigneeId,
            buyerBankId,
            sellerBankId,
            termsPayment,
            currencyId,
            discountedAmount,
            subTotalAmount
        } = scData;
        const submittedData = {
            ...scData,
            poId: poId?.value,
            buyerId: buyerId?.value,
            consigneeId: consigneeId?.value,
            buyerBankId: buyerBankId?.value,
            sellerBankId: sellerBankId?.value,
            termsPayment: termsPayment?.value,
            currencyId: currencyId?.value,
            discountedAmount: discountedAmount ? discountedAmount : 0,
            totalAmount: subTotalAmount - discountedAmount,
            isDraft: cb === "publish" ? false : true,
            items: items?.map( ( item ) => ( {
                poItemId: item?.id,
                itemId: item?.itemId,
                quantity: +item?.quantity,
                price: +item?.price,
                total: +item?.quantity * +item?.price,
                uomId: item?.uoMId?.id ? item?.uoMId?.id : item?.uoMId?.value
            } ) )
        }

        console.log( 'submittedData', JSON.stringify( submittedData, null, 2 ) )
        dispatch( addNewSc( submittedData ) )
            .then( ( res ) => {
                if ( res.error ) {
                    return;
                } else {
                    navigate( '/sc-details', { state: res.payload.id } );
                    dispatch( bindScInfo( initialScData ) )
                    toast.success( cb === "publish" ? 'SC Created Successfully' : 'SC Saved as Draft' )
                }

            } )

    }



    const handleRowsDelete = ( id ) => {
        const filteredData = scData?.items?.filter( d => d.id !== id )
        dispatch( bindScInfo( { ...scData, items: filteredData } ) )
    }

    const handleClear = () => {
        dispatch( bindScInfo( initialScData ) )
    }


    const paramsObj = {
        page: 1,
        pageSize: 100000000
    };


    const handleBuyersOnFocus = () => {
        if ( !buyersDataCm.length ) {
            dispatch( getAllBuyersCm( paramsObj ) )
        }
    }
    const handleCurrencyOnFocus = () => {
        if ( !currencyDataCm.length ) {
            dispatch( getAllCurrencyCm() )
        }
    }


    const handleBankOnFocus = () => {
        if ( !banksDataCm.length ) {
            dispatch( getAllBanksCm( paramsObj ) )
        }
    }

    const handleUnitOnFocus = () => {
        if ( !unitDataCm.length ) {
            dispatch( getAllUnitCm() )
        }
    }

    const handlePoOnFocus = () => {
        if ( !allPurchase.length ) {
            dispatch( getPurchaseByFilter( paramsObj ) );
        }
    };


    const confirmObj = {
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        confirmButtonText: 'Yes!',
        cancelButtonText: 'No'
    };

    //delete segment row
    const handleItemDeleteFromScItemList = ( itemId ) => {
        confirmDialog( confirmObj ).then( ( e ) => {
            if ( e.isConfirmed ) {
                const updatedRows = scData?.items?.filter( ( d ) => d.itemId !== itemId );
                dispatch( bindScInfo( { ...scData, items: updatedRows } ) )
            }
        } );
    };


    return (
        <>
            <ActionMenu
                title='New SC'
                breadcrumb={breadcrumb}
            >
                <NavItem className="me-1" >
                    <Button
                        size="sm"
                        color="primary"
                        onClick={handleSubmit( () => { handleOnSubmit( 'publish' ) } )}
                    // onClick={() => { handleOnSubmit( 'publish' ); }}
                    >Submit</Button>
                </NavItem>
                <NavItem className="me-1" >
                    <Button
                        size="sm"
                        color="success"
                        onClick={handleSubmit( () => { handleOnSubmit( 'draft' ) } )}
                    // onClick={() => { handleOnSubmit( 'draft' ); }}
                    >Save as Draft</Button>
                </NavItem>
                <NavItem className="me-1" >
                    <Button
                        size="sm"
                        color="secondary"
                        onClick={() => { handleClear() }}
                    >
                        Clear
                    </Button>
                </NavItem>
                <NavItem className="" >
                    <Button
                        size="sm"
                        color="info"
                        onClick={() => { navigate( '/sc-lc-list' ) }}
                    >
                        List
                    </Button>
                </NavItem>
            </ActionMenu>

            <div className='mt-3'>

                <FormLayout>
                    <div >
                        <FormContentLayout title="SC Information">
                            <Col md={3} xl={3} xxl={3}>
                                <ErpSelect
                                    label="PO Number"
                                    name="poId"
                                    sideBySide={false}
                                    classNames="mt-1"
                                    value={scData.poId}
                                    options={allPurchase}
                                    onFocus={() => { handlePoOnFocus() }}
                                    onChange={( data, e ) => { handleDropDownChange( data, e ); }}
                                    secondaryOption={
                                        <div className="input-group-append" style={{ zIndex: 0 }}>
                                            <Button.Ripple
                                                onClick={() => {
                                                    handleModalOpen();
                                                }}
                                                style={{ minHeight: "30px", minWidth: "35px" }}
                                                className="btn-icon w-100 pt-0 p-0 h-100"
                                                color="primary"
                                                id="toolid"
                                            >
                                                <Plus size={16} />
                                            </Button.Ripple>
                                            <GsTooltip
                                                id="toolid"
                                                text="Add PO Items"
                                            />
                                        </div>
                                    }
                                />
                            </Col>
                            <Col md={3} xl={3} xxl={3}>
                                <InInput
                                    label="SC Number"
                                    placeholder="SC101"
                                    name="salesContractCode"
                                    value={scData.salesContractCode}
                                    onChange={( e ) => { handleInputOnChange( e ) }}
                                    className={classNames( `erp-dropdown-select ${( errors && errors?.salesContractCode && !scData?.salesContractCode ) && 'is-invalid'}` )}

                                />
                            </Col>
                            <Col md={3} xl={3} xxl={3}>
                                <InInput
                                    // classNames="mt-1"
                                    label="SC Date"
                                    placeholder="SC Date"
                                    type="date"
                                    name="salesContractDate"
                                    value={scData.salesContractDate}
                                    onChange={( e ) => { handleInputOnChange( e ) }}
                                    className={classNames( `erp-dropdown-select ${( errors && errors?.salesContractDate && !scData?.salesContractDate ) && 'is-invalid'}` )}

                                />
                            </Col>
                            <Col md={3} xl={3} xxl={3}>
                                <InInput
                                    // classNames="mt-1"
                                    label="Last Date of Shipment"
                                    type="date"
                                    name="lastDateOfShipment"
                                    min={scData.salesContractDate}
                                    disabled={!scData.salesContractDate}
                                    value={scData.lastDateOfShipment}
                                    onChange={( e ) => { handleInputOnChange( e ) }}
                                    className={classNames( `erp-dropdown-select ${( errors && errors?.lastDateOfShipment && !scData?.lastDateOfShipment ) && 'is-invalid'}` )}

                                />
                            </Col>
                            <Col md={3} xl={3} xxl={3}>
                                <ErpSelect
                                    label="Buyer"
                                    name="buyerId"
                                    sideBySide={false}
                                    classNames="mt-1"
                                    value={scData.buyerId}
                                    options={buyersDataCm?.filter( d => d.type !== "Consignee" )}
                                    onFocus={() => { handleBuyersOnFocus() }}
                                    onChange={( data, e ) => { handleDropDownChange( data, e ); }}
                                    className={classNames( `erp-dropdown-select ${( errors && errors?.buyerId && !scData?.buyerId ) && 'is-invalid'}` )}

                                />
                            </Col>
                            <Col md={3} xl={3} xxl={3}>
                                <ErpSelect
                                    label="Consignee"
                                    name="consigneeId"
                                    sideBySide={false}
                                    classNames="mt-1"
                                    value={scData.consigneeId}
                                    options={buyersDataCm?.filter( d => d.type !== "Buyer" )}
                                    onFocus={() => { handleBuyersOnFocus() }}
                                    onChange={( data, e ) => { handleDropDownChange( data, e ); }}
                                    className={classNames( `erp-dropdown-select ${( errors && errors?.consigneeId && !scData?.consigneeId ) && 'is-invalid'}` )}
                                />
                            </Col>

                            <Col md={3} xl={3} xxl={3}>
                                <InInput
                                    label="Consignee Commission"
                                    placeholder="SC101"
                                    name="consigneeCommission"
                                    type="number"
                                    onFocus={( e ) => e.target.select()}
                                    className="text-end"
                                    value={scData.consigneeCommission}
                                    onChange={( e ) => { handleInputOnChange( e ) }}
                                />
                            </Col>

                            <Col md={3} xl={3} xxl={3}>
                                <ErpSelect
                                    label="Buyer Bank"
                                    name="buyerBankId"
                                    sideBySide={false}
                                    classNames="mt-1"
                                    value={scData.buyerBankId}
                                    options={banksDataCm}
                                    onFocus={() => { handleBankOnFocus() }}
                                    onChange={( data, e ) => { handleDropDownChange( data, e ); }}

                                />
                            </Col>
                            <Col md={3} xl={3} xxl={3}>
                                <ErpSelect
                                    label="Seller Bank"
                                    name="sellerBankId"
                                    sideBySide={false}
                                    classNames="mt-1"
                                    value={scData.sellerBankId}
                                    options={banksDataCm}
                                    onFocus={() => { handleBankOnFocus() }}
                                    onChange={( data, e ) => { handleDropDownChange( data, e ); }}

                                />
                            </Col>


                            <Col md={3} xl={3} xxl={3}>
                                <InInput
                                    // classNames="mt-1"
                                    label="Loading Port"
                                    name="loadingPortDestination"
                                    value={scData.loadingPortDestination}
                                    onChange={( e ) => { handleInputOnChange( e ) }}
                                />
                            </Col>


                            <Col md={3} xl={3} xxl={3}>
                                <ErpSelect
                                    label="Pay Term"
                                    sideBySide={false}
                                    classNames="mt-1"
                                    name="termsPayment"
                                    value={scData.termsPayment}
                                    options={payTerms}
                                    onFocus={() => { handlePoOnFocus() }}
                                    onChange={( data, e ) => { handleDropDownChange( data, e ); }}
                                />
                            </Col>
                            <Col md={3} xl={3} xxl={3}>
                                <InInput
                                    // classNames="mt-1"
                                    label="Insurance"
                                    name="insurance"
                                    value={scData.insurance}
                                    onChange={( e ) => { handleInputOnChange( e ) }}
                                />
                            </Col>

                            <Col md={3} xl={3} xxl={3}>
                                <ErpSelect
                                    label="Currency"
                                    sideBySide={false}
                                    name="currencyId"
                                    classNames="mt-1"
                                    value={scData.currencyId}
                                    options={currencyDataCm}
                                    onFocus={() => { handleCurrencyOnFocus() }}
                                    onChange={( data, e ) => { handleDropDownChange( data, e ); }}
                                    className={classNames( `erp-dropdown-select ${( errors && errors?.currencyId && !scData?.currencyId ) && 'is-invalid'}` )}

                                />
                            </Col>

                            <Col md={3} xl={3} xxl={3}>
                                <InInput
                                    label="Currency Rate"
                                    placeholder="Currency Rate"
                                    name="currencyRate"
                                    type="number"
                                    onFocus={( e ) => e.target.select()}
                                    value={scData.currencyRate}
                                    onChange={( e ) => { handleInputOnChange( e ) }}
                                    className={classNames( `text-end erp-dropdown-select ${( errors && errors?.currencyRate && !scData?.currencyRate ) && 'is-invalid'}` )}

                                />
                            </Col>
                            <Col md={3} xl={3} xxl={3}>
                                <InInput
                                    label="Subtotal Amount"
                                    placeholder="Subtotal Amount"
                                    name="subTotalAmount"
                                    type="number"
                                    disabled
                                    onFocus={( e ) => e.target.select()}
                                    className="text-end"
                                    value={scData?.subTotalAmount.toFixed( 2 )}
                                    onChange={( e ) => { handleInputOnChange( e ) }}
                                />
                            </Col>
                            <Col md={3} xl={3} xxl={3}>
                                <InInput
                                    label="Discount Percentage"
                                    placeholder="Discount"
                                    name="discountPercentage"
                                    type="number"
                                    onFocus={( e ) => e.target.select()}
                                    className="text-end"
                                    value={scData.discountPercentage}
                                    onChange={( e ) => { handleInputOnChange( e ) }}
                                />
                            </Col>
                            <Col md={3} xl={3} xxl={3}>
                                <InInput
                                    label="Discounted Amount"
                                    placeholder="discountedAmount"
                                    name="discountedAmount"
                                    type="number"
                                    disabled
                                    onFocus={( e ) => e.target.select()}
                                    className="text-end"
                                    value={( scData.discountedAmount ).toFixed( 2 )}
                                    onChange={( e ) => { handleInputOnChange( e ) }}
                                />
                            </Col>
                            <Col md={3} xl={3} xxl={3}>
                                <InInput
                                    label="Total Amount"
                                    placeholder="Total Amount"
                                    name="totalAmount"
                                    type="number"
                                    disabled
                                    onFocus={( e ) => e.target.select()}
                                    className="text-end"
                                    value={( scData?.subTotalAmount - scData?.discountedAmount ).toFixed( 2 )}
                                    onChange={( e ) => { handleInputOnChange( e ) }}
                                />
                            </Col>

                            <Col md={3} xl={3} xxl={3}>
                                <InInput
                                    label="Remarks"
                                    type="textarea"
                                    placeholder="Write a note"
                                    name="note"
                                    value={scData.note}
                                    onChange={( e ) => { handleInputOnChange( e ) }}
                                />
                            </Col>

                        </FormContentLayout>
                    </div>
                    <div className="mt-2">
                        <FormContentLayout title="Items">

                            {/* <Col md={12} className="mb-2">
                                <ErpSelect
                                    sideBySide={false}
                                    classNames="mt-1"
                                    // options={productOptions}
                                    placeholder="Type Product Name to Search and Select to add..."
                                    value={null}
                                    // onInputChange={( data, e ) => { handleItemChange( data, e ); }}
                                    options={itemsDataCm}
                                    onFocus={() => { handleItemsOnFocus() }}
                                    onChange={( data, e ) => { handleItemChange( data, e ); }}
                                    components={{ DropdownIndicator: () => null, IndicatorSeparator: () => null }}
                                    openMenuOnFocus={false}
                                    openMenuOnClick={false}
                                />
                            </Col> */}
                            <div className="">
                                <table className='w-100 border'>
                                    <thead>
                                        <tr className='text-center' style={{ backgroundColor: "#f0f1f2" }}>
                                            <th>SL</th>
                                            <th>Action</th>
                                            <th>Item Name</th>
                                            <th>Unit</th>
                                            <th>Quantity</th>
                                            <th>Unit Price</th>
                                            <th>Total</th>
                                            <th>Remove</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            scData?.items?.map( ( row, i ) => (
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
                                                            width: "5px"
                                                        }}>
                                                        <span className="d-flex justify-content-center">
                                                            {
                                                                row?.isEdit ?
                                                                    <Button.Ripple
                                                                        id="editRow"
                                                                        // tag={Label}
                                                                        onClick={() => { handleItemsSubmitControl( row.id ) }}
                                                                        className="btn-icon p-0"
                                                                        color="flat-success"
                                                                    >
                                                                        <CheckSquare
                                                                            size={16}
                                                                            id="editRow"
                                                                            color="purple"

                                                                        />
                                                                    </Button.Ripple>
                                                                    :
                                                                    <Button.Ripple
                                                                        id="editRow"
                                                                        // tag={Label}
                                                                        onClick={() => { handleItemsEditControl( row.id ); }}
                                                                        className="btn-icon p-0"
                                                                        color="flat-success"
                                                                    >

                                                                        <Edit
                                                                            size={16}
                                                                            id="editRow"
                                                                            color="green"

                                                                        />
                                                                    </Button.Ripple>
                                                            }


                                                        </span>
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
                                                            width: "150px"
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
                                                                : row?.uoMId?.name ? row?.uoMId?.name : row?.uoMId?.label
                                                        }
                                                    </td>
                                                    <td
                                                        className="text-center"
                                                        style={{
                                                            border: "1px solid #edebeb",
                                                            width: "100px"
                                                        }}>
                                                        {
                                                            row?.isEdit ?
                                                                <CustomInput
                                                                    className="text-end"
                                                                    name="quantity"
                                                                    type="number"

                                                                    value={row.quantity}
                                                                    onFocus={( e ) => { e.target.select() }}
                                                                    onChange={( e ) => { handleItemInputChange( row.id, e ); }}
                                                                />
                                                                :
                                                                row?.quantity

                                                        }

                                                    </td>
                                                    <td
                                                        className="text-center"
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
                                                                    type="number"
                                                                    value={row.price}
                                                                    onFocus={( e ) => { e.target.select() }}
                                                                    onChange={( e ) => { handleItemInputChange( row.id, e ); }}
                                                                />
                                                                :
                                                                row?.price
                                                        }
                                                    </td>
                                                    <td
                                                        className='text-center fw-bold'
                                                        style={{
                                                            border: "1px solid #edebeb",
                                                            width: "70px"
                                                        }}
                                                    >
                                                        {( row.quantity * row.price ).toFixed( 2 )}
                                                    </td>
                                                    <td
                                                        className='text-center fw-bold'
                                                        style={{
                                                            border: "1px solid #edebeb",
                                                            width: "70px"
                                                        }}>
                                                        <Delete
                                                            size={18}
                                                            className="cursor-pointer"
                                                            color="red"
                                                            onClick={() => { handleItemDeleteFromScItemList( row.itemId ) }}
                                                        />
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
                    Select Items for SC
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
                                    <th className='text-start'>Item Name</th>
                                    <th>Unit</th>
                                    <th>Quantity</th>
                                    <th>Unit Price</th>
                                    <th>Total</th>
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

                                            <td
                                                style={{
                                                    border: "1px solid #edebeb"
                                                }}>
                                                <span className="ms-1">
                                                    {row.description}
                                                </span>
                                            </td>
                                            <Td>{row.uoM}</Td>
                                            <Td>{row.quantity}</Td>
                                            <Td> {row.price}</Td>
                                            <Td>{( row.quantity * row.price ).toFixed( 2 )}</Td>
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

export default CreateScLcForm;