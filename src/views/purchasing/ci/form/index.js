import { yupResolver } from '@hookform/resolvers/yup';
import classNames from 'classnames';
import _ from 'lodash';
import { useEffect, useState } from "react";
import { Plus } from "react-feather";
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
import { getAllBanksCm, getAllBuyersCm, getAllCurrencyCm, getAllItemsCm, getAllUnitCm } from "../../../../redux/common/store";
import ErpInput from '../../../../utility/custom/ErpInput';
import ErpSelect from "../../../../utility/custom/ErpSelect";
import FormContentLayout from '../../../../utility/custom/FormContentLayout';
import FormLayout from '../../../../utility/custom/FormLayout';
import InInput from "../../../../utility/custom/InInput";
import { addNewCi, bindCiInfo, fetchAllPiFoCi, getPiForCiById } from "../store";
import { initialCiData } from "../store/model";


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


const initialCiSearchData = {
    ciSearch: "",
    hsCode: "",
    itemPrice: "",
    itemTax: ""
}

const CiForm = () => {
    const { itemsDataCm, currencyDataCm, unitDataCm, buyersDataCm, banksDataCm } = useSelector( ( { commons } ) => commons )
    const { ciData, piForCi, piData } = useSelector( ( { ci } ) => ci );
    const [selectedData, setSelectedData] = useState( [] );
    const [poModalOpen, setPoModalOpen] = useState( false );
    const [checkAll, setCheckAll] = useState( false )
    const [checkAllSearchData, setCheckAllSearchData] = useState( false )
    const [selectedSearchData, setSelectedSearchData] = useState( [] );
    const [ciSearchData, setCiSearchData] = useState( initialCiSearchData );
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const location = useLocation()
    const selectedItems = piData?.groups?.filter( item => selectedData.some( selectedItem => selectedItem === item.id ) );

    const purchaseId = location.state

    const scSchema = yup.object().shape( {
        ciCode: ciData?.ciCode?.length ? yup.string() : yup.string().required( 'PO Code is Required!!!' ),
        globalTaxBdt: ciData?.globalTaxBdt ? yup.string() : yup.string().required( 'PO Code is Required!!!' ),
        ciDate: ciData?.ciDate ? yup.string() : yup.string().required( 'PO Code is Required!!!' ),
        currencyId: ciData?.currencyId ? yup.string() : yup.string().required( 'PO Code is Required!!!' ),
        currencyRate: ciData?.currencyRate ? yup.string() : yup.string().required( 'PO Code is Required!!!' ),
        grossWeight: ciData?.items?.map( d => d?.grossWeight ) ? yup.string() : yup.string().required( 'PO Code is Required!!!' ),
    } );
    const { reset, handleSubmit, formState: { errors } } = useForm( {
        mode: 'onChange',
        resolver: yupResolver( scSchema )
    } );

    const calculateFunction = () => {
        const subAmount = _.sum( ciData?.items?.map( item => +item?.itemTax ) );
        dispatch( bindCiInfo( {
            ...ciData,
            totalItemTaxBdt: subAmount
        } ) )
    }


    useEffect( () => {
        calculateFunction();
        return () => {
            dispatch( bindCiInfo( initialCiData ) )
        }
    }, [ciData?.items] )



    const handleDropDownChange = ( data, e ) => {
        const { name } = e
        if ( name === "piId" ) {
            dispatch( getPiForCiById( data.value ) )
                .then( ( res ) => {
                    dispatch( bindCiInfo( {
                        ...ciData,
                        piId: { label: res.payload.piCode, value: res.payload.id },
                        currencyId: res.payload.currencyId,
                        currencyRate: res.payload.currencyRate
                    } ) )
                } )
        }
        const updatedObj = {
            ...ciData,
            [name]: data
        };
        dispatch( bindCiInfo( updatedObj ) )

    }

    const handleInputOnChange = ( e ) => {
        const { name, value, type } = e.target;
        const updatedObj = {
            ...ciData,
            [name]: type === "number" ? Number( value ) : value
        };
        dispatch( bindCiInfo( updatedObj ) )
    }

    const handleCheckAll = () => {
        setCheckAll( !checkAll );
        if ( !checkAll ) {
            const allItemIds = piData?.groups?.map( ( row ) => row.id ) || [];
            setSelectedData( allItemIds );
        } else {
            setSelectedData( [] );
        }
    };

    const handleSelectedRows = ( e, id ) => {
        if ( piData?.items?.length === selectedData.length ) {
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
        dispatch( bindCiInfo( {
            ...ciData,
            items: selectedItems.map( d => ( { ...d, uoMId: { label: d.uoM, value: d.uoMId } } ) ),
            subTotalAmount: ciData?.subTotalAmount
        } ) )
        setPoModalOpen( false )
    }

    const handleModalOpen = () => {
        if ( !ciData?.piId ) {
            toast.error( 'Select a PI please' )
            return;
        } else {
            setPoModalOpen( true )
        }
    }
    const handleModalClosed = () => {
        setPoModalOpen( false )
    }

    const handleItemsEditControl = rowId => {
        const { items } = ciData;
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
            ...ciData,
            items: updatedItems
        }
        dispatch( bindCiInfo( updatedBasicInfo ) )
    };


    const handleItemsSubmitControl = rowId => {
        const { items } = ciData;
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
            ...ciData,
            items: updatedItems
        }
        dispatch( bindCiInfo( updateBasicInfo ) )
    };

















    // searching ci and changing item price and item tax
    const handleCiSearch = ( e ) => {
        const { name, value, type } = e.target;
        setCiSearchData( { ...ciSearchData, [name]: type === "number" ? Number( value ) : value } );
    }

    const handleApplyNewData = () => {
        const updatedItems = ciData?.items?.map( ( item ) =>
            selectedSearchItems.map( d => d.id ).includes( item.id ) ? {
                ...item,
                itemPrice: ( ciSearchData?.itemPrice / selectedSearchItems?.length ).toFixed( 2 ),
                itemTax: ( ciSearchData?.itemTax / selectedSearchItems?.length ).toFixed( 2 ),
            }
                : item
        );

        dispatch( bindCiInfo( {
            ...ciData,
            items: updatedItems,
        } ) )
            .then( () => {
                const subAmount = _.sum( ciData?.items?.map( item => +item?.itemTax ) );
                dispatch( bindCiInfo( {
                    ...ciData,
                    totalItemTaxBdt: subAmount,
                } ) )
            } )
        setCiSearchData( initialCiSearchData )
        setCheckAll( false );
    }

    const filteredCiItems = ciData?.items?.filter( item =>
        item.name.toLowerCase().includes( ciSearchData?.ciSearch?.toLowerCase() ) &&
        item.hsCode.toLowerCase().includes( ciSearchData?.hsCode?.toLowerCase() )
    );
    const selectedSearchItems = filteredCiItems?.filter( item => selectedSearchData.some( selectedItem => selectedItem === item.id ) );

    const handleCheckAllSearchData = () => {
        setCheckAllSearchData( !checkAllSearchData );
        if ( !checkAllSearchData ) {
            const allItemIds = filteredCiItems?.map( ( row ) => row.id ) || [];
            setSelectedSearchData( allItemIds );
        } else {
            setSelectedSearchData( [] );
        }
    };

    const handleSelectedRowsSearchData = ( e, id ) => {
        if ( filteredCiItems?.length === selectedSearchData.length ) {
            setCheckAllSearchData( true )
        } else {
            setCheckAllSearchData( false )
        }
        if ( selectedSearchData.includes( id ) ) {
            setSelectedSearchData( selectedSearchData.filter( item => item !== id ) );
        } else {
            setSelectedSearchData( [...selectedSearchData, id] );

        }
    };















    const handleItemInputChange = ( itemId, e ) => {
        const { type, name, value } = e.target;
        const updatedItems = ciData?.items?.map( ( item ) =>
            item?.id === itemId ? { ...item, [name]: type === "number" ? Number( value ) : value } : item
        );
        dispatch( bindCiInfo( {
            ...ciData,
            items: updatedItems
        } ) )
    };

    const handleItemDropDownChange = ( itemId, data, e ) => {
        const { name } = e;
        const updatedItems = ciData?.items?.map( ( item ) =>
            item?.id === itemId ? { ...item, [name]: data } : item
        );
        dispatch( bindCiInfo( {
            ...ciData,
            items: updatedItems
        } ) )
    };

    const handleOnSubmit = () => {

        const itemP = ciData?.items?.every( d => d.itemPrice !== undefined && d.itemPrice !== 0 );
        const itemT = ciData?.items?.every( d => d.itemTax !== undefined && d.itemTax !== 0 );


        if ( !ciData?.items?.length ) {
            toast.error( 'At least one item is required' );
        } else {
            const {
                piId,
                ciCode,
                ciDate,
                customsReference,
                customsReferenceDate,
                globalTaxBdt,
                totalItemTaxBdt,
                note,
                currencyId,
                currencyRate,
            } = ciData;
            const submittedData = {
                piId: piId?.value,
                ciCode: ciCode,
                ciDate: ciDate,
                customsReference: customsReference,
                customsReferenceDate: customsReferenceDate,
                globalTaxBdt: +globalTaxBdt ? +globalTaxBdt : 0,
                totalItemTaxBdt: totalItemTaxBdt ? totalItemTaxBdt : 0,
                note: note,
                currencyId: currencyId?.value,
                currencyRate: +currencyRate,
                items: ciData?.items.map( item => ( {
                    piGroupId: item?.id,
                    grossWeight: +item?.grossWeight ? +item?.grossWeight : 0,
                    netWeight: +item?.netWeight ? +item?.netWeight : 0,
                    weightUnit: +item?.weightUnit?.value ? +item?.weightUnit?.value : 0,
                    itemQuantity: +item?.quantity ? +item?.quantity : 0,
                    quantityUnit: +item?.quantityUnit?.value ? +item?.quantityUnit?.value : 0,
                    itemPrice: +item?.itemPrice ? +item?.itemPrice : 0,
                    itemTax: +item?.itemTax ? +item?.itemTax : 0
                } ) )
            }

            console.log( 'submittedData', JSON.stringify( submittedData, null, 2 ) )
            dispatch( addNewCi( submittedData ) )
                .then( ( res ) => {
                    if ( res.error ) {
                        return;
                    } else {
                        dispatch( bindCiInfo( initialCiData ) )
                        toast.success( 'CI created successfully' )
                    }

                } )
        }


    }



    const handleRowsDelete = ( id ) => {
        const filteredData = ciData?.items?.filter( d => d.id !== id )
        dispatch( bindCiInfo( { ...ciData, items: filteredData } ) )
    }

    const handleClear = () => {
        dispatch( bindCiInfo( initialCiData ) )
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

    const handleItemsOnFocus = () => {
        if ( !itemsDataCm.length ) {
            dispatch( getAllItemsCm() )
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

    const handlePiOnFocus = () => {
        if ( !piForCi.length ) {
            dispatch( fetchAllPiFoCi( paramsObj ) );
        }
    };

    console.log( 'ciData?.items', ciData?.items )

    return (
        <>
            <ActionMenu
                title='New CI'
                breadcrumb={breadcrumb}
            >
                <NavItem className="me-1" >
                    <Button
                        size="sm"
                        color="primary"
                        onClick={handleSubmit( handleOnSubmit )}
                    // onClick={() => { handleOnSubmit(); }}
                    >Submit</Button>
                </NavItem>
                {/* <NavItem className="me-1" >
                    <Button
                        size="sm"
                        color="success"
                        onClick={handleSubmit( () => { handleOnSubmit( 'draft' ) } )}
                    // onClick={() => { handleOnSubmit( 'draft' ); }}
                    >Save as Draft</Button>
                </NavItem> */}
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
                        onClick={() => { navigate( -1 ) }}
                    >
                        Back
                    </Button>
                </NavItem>
            </ActionMenu>

            <div className='mt-3'>

                <FormLayout>
                    <div >
                        <FormContentLayout title="CI Information">
                            <Col md={3} xl={3} xxl={3}>
                                <ErpSelect
                                    label="PI Number"
                                    name="piId"
                                    sideBySide={false}
                                    classNames="mt-1"
                                    value={ciData.piId}
                                    options={piForCi}
                                    onFocus={() => { handlePiOnFocus() }}
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
                                            >
                                                <Plus size={16} />
                                            </Button.Ripple>
                                        </div>
                                    }
                                />
                            </Col>
                            <Col md={3} xl={3} xxl={3}>
                                <ErpInput
                                    sideBySide={false}
                                    classNames="mt-1"
                                    label="CI Number"
                                    placeholder="CI101"
                                    name="ciCode"
                                    value={ciData.ciCode ?? ""}
                                    onChange={( e ) => { handleInputOnChange( e ) }}
                                    className={classNames( `erp-dropdown-select ${( errors && errors?.ciCode && !ciData?.ciCode ) && 'is-invalid'}` )}

                                />
                            </Col>
                            <Col md={3} xl={3} xxl={3}>
                                <ErpInput
                                    sideBySide={false}
                                    classNames="mt-1"
                                    label="CI Date"
                                    placeholder="CI Date"
                                    type="date"
                                    name="ciDate"
                                    value={ciData.ciDate ?? ""}
                                    onChange={( e ) => { handleInputOnChange( e ) }}
                                    className={classNames( `erp-dropdown-select ${( errors && errors?.ciDate && !ciData?.ciDate ) && 'is-invalid'}` )}

                                />
                            </Col>
                            <Col md={3} xl={3} xxl={3}>
                                <ErpInput
                                    sideBySide={false}
                                    classNames="mt-1"
                                    label="Customs Reference"
                                    name="customsReference"
                                    value={ciData.customsReference ?? ""}
                                    onChange={( e ) => { handleInputOnChange( e ) }}
                                />
                            </Col>
                            <Col md={3} xl={3} xxl={3}>
                                <ErpInput
                                    sideBySide={false}
                                    classNames="mt-1"
                                    label="Customs Reference Date"
                                    placeholder="CI Date"
                                    type="date"
                                    name="customsReferenceDate"
                                    value={ciData.customsReferenceDate ?? ""}
                                    onChange={( e ) => { handleInputOnChange( e ) }}
                                />
                            </Col>
                            <Col md={3} xl={3} xxl={3}>
                                <ErpInput
                                    sideBySide={false}
                                    classNames="mt-1"
                                    label="Global Tax (BDT)"
                                    name="globalTaxBdt"
                                    type="number"
                                    value={ciData.globalTaxBdt ?? ""}
                                    onFocus={( e ) => { e.target.select() }}
                                    onChange={( e ) => { handleInputOnChange( e ) }}
                                    className={classNames( `text-end erp-dropdown-select ${( errors && errors?.globalTaxBdt && !ciData?.globalTaxBdt ) && 'is-invalid'}` )}
                                />
                            </Col>

                            <Col md={3} xl={3} xxl={3}>
                                <ErpInput
                                    sideBySide={false}
                                    classNames="mt-1"
                                    label="Total Item Tax (BDT)"
                                    name="totalItemTaxBdt"
                                    type="number"
                                    className="text-end"
                                    disabled
                                    value={ciData.totalItemTaxBdt}
                                    onFocus={( e ) => { e.target.select() }}
                                    onChange={( e ) => { handleInputOnChange( e ) }}
                                />
                            </Col>

                            <Col md={3} xl={3} xxl={3}>
                                <ErpSelect
                                    label="Currency"
                                    sideBySide={false}
                                    isDisabled={true}
                                    name="currencyId"
                                    classNames="mt-1"
                                    value={ciData.currencyId}
                                    options={currencyDataCm}
                                    onFocus={() => { handleCurrencyOnFocus() }}
                                    onChange={( data, e ) => { handleDropDownChange( data, e ); }}
                                    className={classNames( `erp-dropdown-select ${( errors && errors?.currencyId && !ciData?.currencyId ) && 'is-invalid'}` )}

                                />
                            </Col>

                            <Col md={3} xl={3} xxl={3}>
                                <InInput
                                    label="Currency Rate"
                                    placeholder="Currency Rate"
                                    name="currencyRate"
                                    type="number"
                                    onFocus={( e ) => e.target.select()}
                                    value={ciData.currencyRate ?? ""}
                                    onChange={( e ) => { handleInputOnChange( e ) }}
                                    className={classNames( `text-end erp-dropdown-select ${( errors && errors?.currencyRate && !ciData?.currencyRate ) && 'is-invalid'}` )}

                                />
                            </Col>
                            <Col md={3} xl={3} xxl={3}>
                                <InInput
                                    label="Remarks"
                                    type="textarea"
                                    placeholder="Write a note"
                                    name="note"
                                    value={ciData.note ?? ""}
                                    onChange={( e ) => { handleInputOnChange( e ) }}
                                />
                            </Col>

                        </FormContentLayout>
                    </div>
                    <div className='mt-2'>
                        <div className='d-flex content-items-center'>
                            <div style={{ width: "160vh" }}>
                                <ErpInput
                                    sideBySide={false}
                                    label="Search By Name"
                                    name="ciSearch"
                                    value={ciSearchData?.ciSearch}
                                    onChange={( e ) => { handleCiSearch( e ) }}
                                />
                            </div>
                            <div>
                                <ErpInput
                                    sideBySide={false}
                                    label="HS Code"
                                    name="hsCode"
                                    value={ciSearchData?.hsCode}
                                    onChange={( e ) => { handleCiSearch( e ) }}
                                />
                            </div>
                            <div>
                                <ErpInput
                                    sideBySide={false}
                                    label="Item Price"
                                    name="itemPrice"
                                    type="number"
                                    value={ciSearchData?.itemPrice}
                                    onChange={( e ) => { handleCiSearch( e ) }}
                                />
                            </div>
                            <div>
                                <ErpInput
                                    sideBySide={false}
                                    label="Item Tax"
                                    name="itemTax"
                                    type="number"
                                    value={ciSearchData?.itemTax}
                                    onChange={( e ) => { handleCiSearch( e ) }}
                                />
                            </div>
                            <div
                                style={{
                                    marginTop: "25px"
                                }}
                            >
                                <Button
                                    size='sm'
                                    color='success'
                                    onClick={() => { handleApplyNewData() }}
                                >Apply</Button>
                            </div>
                        </div>

                        {
                            ciSearchData?.ciSearch?.length || ciSearchData?.hsCode?.length ? (
                                <div className="">

                                    <div className="">
                                        <table className='w-100 border'>
                                            <thead>
                                                <tr className='text-center' style={{ backgroundColor: "#f0f1f2" }}>
                                                    <th>SL</th>
                                                    <th style={{ width: "5px" }}>
                                                        <FormGroup check
                                                            className="text-center mx-1"
                                                        >
                                                            <Input
                                                                className="text-center"
                                                                type="checkbox"
                                                                name="checkAll"
                                                                checked={( filteredCiItems?.length && ( filteredCiItems?.length === selectedSearchData?.length ) )}
                                                                onChange={handleCheckAllSearchData}
                                                            />
                                                        </FormGroup>
                                                    </th>
                                                    <th>Item</th>
                                                    <th>HS Code</th>
                                                    <th>Item Price</th>
                                                    <th>Item Tax</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    filteredCiItems?.map( ( row, i ) => (
                                                        <tr key={i}>
                                                            <td
                                                                className="text-center"
                                                                style={{
                                                                    border: "1px solid #edebeb"
                                                                }}>
                                                                {i + 1}
                                                            </td>
                                                            <td style={{
                                                                border: "1px solid #edebeb"
                                                            }}>
                                                                <FormGroup check
                                                                    className="text-center mx-1"
                                                                >
                                                                    <Input
                                                                        className="text-center"
                                                                        type="checkbox"
                                                                        name="checkAll"
                                                                        checked={selectedSearchData.includes( row.id )}
                                                                        onChange={( e ) => handleSelectedRowsSearchData( e, row.id )}
                                                                    />
                                                                </FormGroup>
                                                            </td>

                                                            <td style={{
                                                                border: "1px solid #edebeb"
                                                            }}>
                                                                <span className="ms-1">
                                                                    {row.name}
                                                                </span>
                                                            </td>
                                                            <td style={{
                                                                border: "1px solid #edebeb"
                                                            }}>
                                                                <span className="ms-1">
                                                                    {row.hsCode}
                                                                </span>
                                                            </td>
                                                            <td
                                                                className="text-center"
                                                                style={{
                                                                    border: "1px solid #edebeb",
                                                                    width: "100px",
                                                                    height: "33px"
                                                                }}>

                                                                <CustomInput
                                                                    className="text-end"
                                                                    name="itemPrice"
                                                                    type="number"
                                                                    value={selectedSearchItems.map( d => d.id ).includes( row.id ) ?
                                                                        ( ciSearchData?.itemPrice / selectedSearchItems?.length ).toFixed( 2 )
                                                                        : row.itemPrice
                                                                    }
                                                                    onChange={() => { }}
                                                                />


                                                            </td>
                                                            <td
                                                                className="text-center"
                                                                style={{
                                                                    border: "1px solid #edebeb",
                                                                    width: "100px",
                                                                    height: "33px"
                                                                }}>

                                                                <CustomInput
                                                                    className="text-end"
                                                                    name="itemTax"
                                                                    type="number"
                                                                    value={selectedSearchItems.map( d => d.id ).includes( row.id ) ?
                                                                        ( ciSearchData?.itemTax / selectedSearchItems?.length ).toFixed( 2 )
                                                                        : row.itemTax
                                                                    }
                                                                    onChange={() => { }}
                                                                />

                                                            </td>

                                                        </tr>
                                                    ) )
                                                }
                                            </tbody>
                                        </table>
                                    </div>

                                </div>
                            ) : ""
                        }
                    </div>
                    {
                        ciData?.items?.length ? (
                            <div className="mt-2">
                                <FormContentLayout title="Items">
                                    <div className="">
                                        <table className='w-100 border'>
                                            <thead>
                                                <tr className='text-center' style={{ backgroundColor: "#f0f1f2" }}>
                                                    <th>SL</th>
                                                    <th>Item Name</th>
                                                    <th>HS Code</th>
                                                    <th>Gross Weight</th>
                                                    <th>Net Weight</th>
                                                    <th>Weight Unit</th>
                                                    <th>Item Quantity</th>
                                                    <th>Quantity Unit</th>
                                                    <th>Item Price</th>
                                                    <th>Item Tax</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    ciData?.items?.map( ( row, i ) => (
                                                        <tr key={i}>
                                                            <td
                                                                className="text-center"
                                                                style={{
                                                                    border: "1px solid #edebeb"
                                                                }}>
                                                                {i + 1}
                                                            </td>

                                                            <td style={{
                                                                border: "1px solid #edebeb"
                                                            }}>
                                                                <span className="ms-1">
                                                                    {row.name}
                                                                </span>
                                                            </td>

                                                            <td style={{
                                                                border: "1px solid #edebeb"
                                                            }}>
                                                                <span className="ms-1">
                                                                    {row.hsCode}
                                                                </span>
                                                            </td>

                                                            <td
                                                                className="text-center"
                                                                style={{
                                                                    border: "1px solid #edebeb",
                                                                    width: "100px"
                                                                }}>
                                                                {/* {
                                                            row?.isEdit ? */}
                                                                <ErpInput
                                                                    sideBySide={false}
                                                                    name="grossWeight"
                                                                    type="number"
                                                                    className="text-end"
                                                                    value={row.grossWeight ?? ""}
                                                                    onChange={( e ) => { handleItemInputChange( row.id, e ); }}
                                                                    classNames={classNames( `text-end erp-dropdown-select ${( errors && errors?.grossWeight && !row?.grossWeight ) && 'is-invalid'}` )}

                                                                />
                                                                {/* } */}

                                                            </td>
                                                            <td
                                                                className="text-center"
                                                                style={{
                                                                    border: "1px solid #edebeb",
                                                                    width: "100px"
                                                                }}>
                                                                {/* {
                                                            row?.isEdit ? */}
                                                                <CustomInput
                                                                    // className="text-end"
                                                                    name="netWeight"
                                                                    type="number"
                                                                    className="text-end"
                                                                    value={row.netWeight ?? ""}
                                                                    onChange={( e ) => { handleItemInputChange( row.id, e ); }}
                                                                />
                                                                {/* } */}

                                                            </td>
                                                            <td
                                                                className="text-center"
                                                                style={{
                                                                    border: "1px solid #edebeb",
                                                                    width: "150px"
                                                                }}>

                                                                <ErpSelect
                                                                    sideBySide={false}
                                                                    name="weightUnit"
                                                                    isClearable
                                                                    options={unitDataCm}
                                                                    value={row.weightUnit ?? ""}
                                                                    onFocus={() => { handleUnitOnFocus() }}
                                                                    onChange={( data, e ) => { handleItemDropDownChange( row.id, data, e ); }}
                                                                //
                                                                />

                                                            </td>
                                                            <td
                                                                className="text-center"
                                                                style={{
                                                                    border: "1px solid #edebeb",
                                                                    width: "100px"
                                                                }}>

                                                                <CustomInput
                                                                    className="text-end"
                                                                    name="quantity"
                                                                    type="number"
                                                                    value={row.quantity ?? ""}
                                                                    onChange={( e ) => { handleItemInputChange( row.id, e ); }}
                                                                />


                                                            </td>
                                                            <td
                                                                className="text-center"
                                                                style={{
                                                                    border: "1px solid #edebeb",
                                                                    width: "150px"
                                                                }}>

                                                                <ErpSelect
                                                                    sideBySide={false}
                                                                    name="quantityUnit"
                                                                    isClearable
                                                                    options={unitDataCm}
                                                                    value={row.quantityUnit ?? ""}
                                                                    onFocus={() => { handleUnitOnFocus() }}
                                                                    onChange={( data, e ) => { handleItemDropDownChange( row.id, data, e ); }}
                                                                //
                                                                />

                                                            </td>
                                                            <td
                                                                className="text-center"
                                                                style={{
                                                                    border: "1px solid #edebeb",
                                                                    width: "100px",
                                                                    height: "33px"
                                                                }}>

                                                                <ErpInput
                                                                    sideBySide={false}
                                                                    className="text-end"
                                                                    name="itemPrice"
                                                                    type="number"
                                                                    value={row.itemPrice ?? ""}
                                                                    onChange={( e ) => { handleItemInputChange( row.id, e ); }}
                                                                />

                                                            </td>
                                                            <td
                                                                className="text-center"
                                                                style={{
                                                                    border: "1px solid #edebeb",
                                                                    width: "100px",
                                                                    height: "33px"
                                                                }}>

                                                                <CustomInput
                                                                    className="text-end"
                                                                    name="itemTax"
                                                                    type="number"
                                                                    value={row.itemTax ?? ""}
                                                                    onChange={( e ) => { handleItemInputChange( row.id, e ); }}
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
                        ) : ""
                    }

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
                    Select Items for CI
                </ModalHeader>
                <ModalBody className="px-5 pb-5" >
                    <div>
                        <div style={{ height: "80vh", overflowY: "auto" }}>
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
                                                    checked={piData?.groups?.length === selectedData?.length}
                                                    onChange={handleCheckAll}
                                                />
                                            </FormGroup>
                                        </th>
                                        <th>Item Name</th>
                                        <th>HS Code</th>
                                        <th>Unit</th>
                                        <th>Quantity</th>
                                        <th>Price</th>
                                    </tr>
                                </thead>
                                <tbody>

                                    {
                                        piData?.groups?.map( ( row, i ) => (

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
                                                        {row.name}
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
                                                            : row.hsCode
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
                        </div>
                        <Button.Ripple
                            // disabled={!piData?.items?.length}
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

export default CiForm;