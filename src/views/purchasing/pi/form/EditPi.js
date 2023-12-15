import { yupResolver } from '@hookform/resolvers/yup';
import classNames from 'classnames';
import { Fragment, useEffect, useState } from "react";
import { CheckSquare, ChevronDown, ChevronRight, Delete, Edit } from "react-feather";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
    Button,
    Col, FormGroup, Input, NavItem
} from "reactstrap";
import * as yup from 'yup';
import ActionMenu from '../../../../@core/layouts/components/ActionMenu';
import '../../../../assets/scss/item/item-style.scss';
import { getAllBanksCm, getAllBuyersCm, getAllCurrencyCm, getAllItemsCm, getAllUnitCm } from "../../../../redux/common/store";
import { confirmDialog } from '../../../../utility/custom/ConfirmDialog';
import ErpInput from '../../../../utility/custom/ErpInput';
import ErpSelect from "../../../../utility/custom/ErpSelect";
import FormContentLayout from '../../../../utility/custom/FormContentLayout';
import FormLayout from '../../../../utility/custom/FormLayout';
import InInput from "../../../../utility/custom/InInput";
import { randomIdGenerator } from '../../../../utility/Utils';
import { bindScInfo, fetchAllScByFilter, getScById } from "../../sc-lc/store";
import { initialScData } from '../../sc-lc/store/model';
import { bindPiInfo, deletePiGroup, getPiById, getUngroupedPiData, updatePi } from "../store";
import { initialPiData } from "../store/model";



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

const ChildTd = ( props ) => {
    const { children } = props;
    return (
        <td
            className='text-center'
            style={{
                border: "1px solid #edebeb"
            }}
        >
            {children}
        </td>
    )
}




const EditPiForm = () => {
    const { itemsDataCm, currencyDataCm, unitDataCm, buyersDataCm, banksDataCm } = useSelector( ( { commons } ) => commons )
    const { piData } = useSelector( ( { pi } ) => pi );
    const { allSc, scData } = useSelector( ( { sc } ) => sc );
    const [selectedData, setSelectedData] = useState( [] );
    const [checkAll, setCheckAll] = useState( false )
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const location = useLocation()
    // const selectedItems = scData?.items?.filter( item => selectedData.some( selectedItem => selectedItem === item.id ) );
    // const scItems = scData?.items?.filter( item => !piData?.groups?.map( d => d.items )?.some( selectedItem => selectedItem.id === item.id ) );
    const selectedItems = scData?.items?.filter( ( item ) => {
        return selectedData.some( ( selectedItem ) => selectedItem === item.id );
    } );




    // console.log( 'piDataItems', piDataItems )
    // console.log( 'scItems', scItems )
    // console.log( 'piData', piData )


    const piId = location.state

    const scSchema = yup.object().shape( {
        piCode: piData?.piCode?.length ? yup.string() : yup.string().required( 'PO Code is Required!!!' ),
        piDate: piData?.piDate ? yup.string() : yup.string().required( 'PO Code is Required!!!' ),
        latestShipmentDate: piData?.latestShipmentDate ? yup.string() : yup.string().required( 'PO Code is Required!!!' ),
        buyerId: piData?.buyerId ? yup.string() : yup.string().required( 'PO Code is Required!!!' ),
        currencyId: piData?.currencyId ? yup.string() : yup.string().required( 'PO Code is Required!!!' ),
        currencyRate: piData?.currencyRate ? yup.string() : yup.string().required( 'PO Code is Required!!!' )
    } );
    const { reset, handleSubmit, formState: { errors } } = useForm( {
        mode: 'onChange',
        resolver: yupResolver( scSchema )
    } );

    const initialDataFunction = () => {
        dispatch( getPiById( piId ) )
            .then( ( res ) => {
                const data = {
                    piId: piId,
                    scId: res.payload.scId.value
                }
                dispatch( getUngroupedPiData( data ) )
                    .then( ( response ) => {
                        console.log( 'ungrouped items', response.payload );
                        dispatch( bindScInfo( { ...scData, items: response.payload } ) )
                    } )
            } )
    }

    useEffect( () => {
        initialDataFunction();
        return () => {
            dispatch( bindPiInfo( initialPiData ) )
            dispatch( bindScInfo( initialScData ) )
        }
    }, [piId] )

    const piDataItems = piData?.groups?.map( ( group ) => group.items ).flat();
    const scItems = scData?.items?.filter( ( item ) => {
        return !piDataItems.some( ( piItem ) => piItem.itemId === item.itemId );
    } );

    console.log( 'piDapiDatataItems', piData )

    // console.log( 'pi data', piData )

    const handleDropDownChange = ( data, e ) => {
        const { name } = e
        if ( name === "scId" ) {
            dispatch( getScById( data.value ) )
        }
        const updatedObj = {
            ...piData,
            [name]: data
        };

        dispatch( bindPiInfo( updatedObj ) )
    }

    const handleInputOnChange = ( e ) => {
        const { name, value, type } = e.target;
        const updatedObj = {
            ...piData,
            [name]: type === "number" ? Number( value ) : value
        };
        dispatch( bindPiInfo( updatedObj ) )
    }

    const handleCheckAll = () => {
        setCheckAll( !checkAll );
        if ( !checkAll ) {
            const allItemIds = scData?.items?.map( ( row ) => row.id ) || [];
            setSelectedData( allItemIds );
        } else {
            setSelectedData( [] );
        }
    };

    const handleSelectedRows = ( e, id ) => {
        if ( scData?.items?.length === selectedData.length ) {
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

    const handleGroupSubmit = () => {
        const defaultData = selectedItems?.filter( item => item.isBase === true );

        const existingGroups = [...piData.groups];

        // Filter out selected items that are not in any existing group
        const newItems = selectedItems.filter( item => {
            return !existingGroups.some( group => group.items.some( existingItem => existingItem.id === item.id ) );
        } );
        const defaultCheck = newItems?.filter( item => item.isBase === true );
        if ( !defaultCheck?.length ) {
            toast.error( 'Please select an item as base item' );
            return;
        }

        if ( newItems.length > 0 ) {
            const newGroup = {
                ...( defaultData[0] ),
                items: newItems,
                isExpanded: false,
                rowId: randomIdGenerator()
            };

            existingGroups.push( newGroup );

            dispatch( bindPiInfo( {
                ...piData,
                groups: existingGroups
            } ) );
        }
    }


    // Opening a group
    const handleBlockOpen = ( id ) => {
        const updatedGroups = piData.groups.map( group => ( {
            ...group,
            isExpanded: group.id === id ? true : group.isExpanded
        } ) );

        dispatch( bindPiInfo( {
            ...piData,
            groups: updatedGroups
        } ) );
    }

    // Closing a group
    const handleBlockClose = ( id ) => {
        const updatedGroups = piData.groups.map( group => ( {
            ...group,
            isExpanded: group.id === id ? false : group.isExpanded
        } ) );

        dispatch( bindPiInfo( {
            ...piData,
            groups: updatedGroups
        } ) );
    }

    // console.log( 'piData.groups', piData?.groups );



    // before making group, this function will use for enabling editing functionality in sc data
    const handleScItemsEditControl = rowId => {
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


    const handleScItemsSubmitControl = rowId => {
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

    // single items without creating group item on change, which is basically changing sc data
    const handleScItemInputChange = ( itemId, e ) => {
        const { name, value, type, checked } = e.target;
        const updatedItems = scData?.items?.map( ( item ) =>
            item?.id === itemId ? { ...item, [name]: type === 'checkbox' ? checked : value } : type === "checkbox" ? { ...item, [name]: false } : item
        );
        dispatch( bindScInfo( {
            ...piData,
            items: updatedItems
        } ) )
    };


    const handleScItemDropDownChange = ( itemId, data, e ) => {
        const { name } = e;
        const updatedItems = scData?.items?.map( ( item ) =>
            item?.id === itemId ? { ...item, [name]: data } : item
        );
        dispatch( bindScInfo( {
            ...piData,
            items: updatedItems
        } ) )
    };



    // after making group, this function will use for enabling editing functionality
    const handleItemsEditControl = rowId => {
        const { groups } = piData;
        const updatedItems = groups.map( row => {
            if ( row.id === rowId ) {
                return {
                    ...row,
                    isEdit: true
                }
            }
            return row;
        } )

        const updatedBasicInfo = {
            ...piData,
            groups: updatedItems
        }
        dispatch( bindPiInfo( updatedBasicInfo ) )
    };


    const handleItemsSubmitControl = rowId => {
        const { groups } = piData;
        const updatedItems = groups.map( row => {
            if ( row.id === rowId ) {
                return {
                    ...row,
                    isEdit: false,
                };
            }
            return row;
        } );
        const updateBasicInfo = {
            ...piData,
            groups: updatedItems
        }
        dispatch( bindPiInfo( updateBasicInfo ) )
    };




    // grouped items editing functionality
    const handleItemInputChange = ( itemId, e ) => {
        const { name, value } = e.target;
        const updatedItems = piData?.groups?.map( ( item ) =>
            item?.id === itemId ? { ...item, [name]: value } : item
        );
        dispatch( bindPiInfo( {
            ...piData,
            groups: updatedItems
        } ) )
    };


    const handleItemDropDownChange = ( itemId, data, e ) => {
        const { name } = e;
        const updatedItems = piData?.groups?.map( ( item ) =>
            item?.id === itemId ? { ...item, [name]: data } : item
        );
        console.log( 'updatedItems', updatedItems )
        dispatch( bindPiInfo( {
            ...piData,
            groups: updatedItems
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

        const duplicateItems = piData?.items?.map( dd => dd.itemId ).includes( data?.id )
        if ( duplicateItems ) {
            toast.success( 'Item already added!' )
        } else {
            dispatch( bindPiInfo( {
                ...piData,
                items: [...piData?.items, newItem]
            } ) )
        }
    }




    const handleOnSubmit = ( cb ) => {
        const { id, scId, buyerId, sellerBankId, currencyId, piCode, piDate, from, to, latestShipmentDate, shipment, insurance, payment, note, currencyRate } = piData;
        const submittedData = {
            ...piData,
            id: id,
            scId: scId?.value,
            piCode: piCode,
            buyerId: buyerId?.value,
            sellerBankId: sellerBankId?.value,
            currencyId: currencyId?.value,
            totalAmount: 0,
            isDraft: cb === "publish" ? false : true,
            piDate: piDate,
            from: from,
            to: to,
            latestShipmentDate: latestShipmentDate,
            shipment: shipment,
            insurance: insurance,
            payment: payment,
            note: note,
            currencyRate: currencyRate
        }

        const scItemData = scItems?.map( groupItem => ( {
            id: 0,
            name: groupItem?.description,
            specification: groupItem?.segments,
            hsCode: groupItem?.hsCode,
            quantity: groupItem?.quantity,
            price: groupItem?.price,
            total: groupItem?.quantity * groupItem?.price,
            uomId: groupItem?.uoMId?.value,
            items: [{
                id: 0,
                scItemId: groupItem?.id,
                isBase: true,
            }]
        } ) );

        const piGroupsData = piData?.groups?.map( groupItem => ( {
            id: groupItem?.items?.some( dd => dd.scItemId ) ? groupItem?.id : 0,
            name: groupItem?.description ? groupItem?.description : groupItem?.name,
            specification: groupItem?.segments ? groupItem?.segments : groupItem?.specification,
            hsCode: groupItem?.hsCode,
            quantity: groupItem?.quantity,
            price: groupItem?.price,
            total: groupItem?.quantity * groupItem?.price,
            uomId: groupItem?.uoMId?.value,
            items: groupItem?.items?.map( gItem => ( {
                id: gItem?.scItemId ? gItem?.id : 0,
                scItemId: gItem?.scItemId ? gItem?.scItemId : gItem?.id,
                isBase: gItem?.isBase,
            } ) ),
        } ) ) || []

        const storeData = {
            data: submittedData,
            scItemData: scItemData,
            piGroupsData: piGroupsData
        }
        console.log( 'storeData', JSON.stringify( storeData, null, 2 ) )
        dispatch( updatePi( storeData ) )
            .then( ( res ) => {
                if ( res.error ) {
                    return;
                } else {
                    dispatch( bindPiInfo( initialPiData ) )
                    navigate( '/pi-details', { state: res.payload.id } );
                    toast.success( cb === "publish" ? 'PI updated Successfully' : 'PI Saved as Draft' )
                }

            } )

    }



    // const handleRowsDelete = ( id ) => {
    //     const filteredData = piData?.items?.filter( d => d.id !== id )
    //     dispatch( bindPiInfo( { ...piData, items: filteredData } ) )
    // }

    // const handleGroupDelete = ( row ) => {
    //     const filteredData = piData?.groups?.filter( d => d.id !== row.id )
    //     dispatch( bindPiInfo( { ...piData, groups: filteredData } ) )
    // }

    const confirmObj = {
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        confirmButtonText: 'Yes!',
        cancelButtonText: 'No'
    };

    const handleDelete = ( row ) => {
        confirmDialog( {
            ...confirmObj
        } ).then( async e => {
            if ( e.isConfirmed ) {
                dispatch( deletePiGroup( row ) )
                    .then( ( res ) => {
                        // dispatch( getPiById( row.piId ) )
                        initialDataFunction();
                    } )
            }
        } );
    };


    // const handleClear = () => {
    //     dispatch( bindPiInfo( initialPiData ) )
    //     dispatch( bindScInfo( initialScData ) )
    // }

    // console.log( 'scData', scData.items );
    // console.log( 'scItems', scItems );
    // console.log( 'scItems length', !scItems?.length );

    const paramsObj = {
        page: 1,
        pageSize: 1000000
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

    const handlePoOnFocus = () => {
        if ( !allSc.length ) {
            dispatch( fetchAllScByFilter( paramsObj ) );
        }
    };


    const payTermOption = [
        { label: 'TT', value: 'TT' },
        { label: 'Wire Transfer', value: 'Wire Transfer' }
    ]


    return (
        <>
            <ActionMenu
                title='Edit PI'
                breadcrumb={breadcrumb}
            >
                <NavItem className="me-1" >
                    <Button
                        size="sm"
                        color="primary"
                        onClick={handleSubmit( () => { handleOnSubmit( 'publish' ) } )}
                    // onClick={() => { handleOnSubmit( 'publish' ); }}
                    >Save</Button>
                </NavItem>
                {/* <NavItem className="me-1" >
                    <Button
                        size="sm"
                        color="success"
                        onClick={handleSubmit( () => { handleOnSubmit( 'draft' ) } )}
                    // onClick={() => { handleOnSubmit( 'draft' ); }}
                    >Save as Draft</Button>
                </NavItem> */}
                {/* <NavItem className="me-1" >
                    <Button
                        size="sm"
                        color="secondary"
                        onClick={() => { handleClear() }}
                    >
                        Clear
                    </Button>
                </NavItem> */}
                <NavItem className="" >
                    <Button
                        size="sm"
                        color="info"
                        onClick={() => { navigate( '/pi-list' ) }}
                    >
                        View List
                    </Button>
                </NavItem>
            </ActionMenu>

            <div className='mt-3'>

                <FormLayout>
                    <div >
                        <FormContentLayout title="PI Information">
                            <Col md={3} xl={3} xxl={3}>
                                <ErpSelect
                                    label="Sc Number"
                                    name="scId"
                                    sideBySide={false}
                                    classNames="mt-1"
                                    value={piData.scId}
                                    options={allSc}
                                    isDisabled={true}
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
                                <InInput
                                    label="PI Code"
                                    placeholder="PI101"
                                    name="piCode"
                                    value={piData.piCode}
                                    onChange={( e ) => { handleInputOnChange( e ) }}
                                    className={classNames( `erp-dropdown-select ${( errors && errors?.piCode && !piData?.piCode ) && 'is-invalid'}` )}

                                />
                            </Col>
                            <Col md={3} xl={3} xxl={3}>
                                <InInput
                                    // classNames="mt-1"
                                    label="PI Date"
                                    type="date"
                                    name="piDate"
                                    value={piData.piDate}
                                    onChange={( e ) => { handleInputOnChange( e ) }}
                                    className={classNames( `erp-dropdown-select ${( errors && errors?.piDate && !piData?.piDate ) && 'is-invalid'}` )}

                                />
                            </Col>
                            <Col md={3} xl={3} xxl={3}>
                                <ErpSelect
                                    label="Buyer"
                                    name="buyerId"
                                    sideBySide={false}
                                    isDisabled={true}

                                    classNames="mt-1"
                                    value={piData.buyerId}
                                    options={buyersDataCm?.filter( d => d.type !== "Consignee" )}
                                    onFocus={() => { handleBuyersOnFocus() }}
                                    onChange={( data, e ) => { handleDropDownChange( data, e ); }}
                                    className={classNames( `erp-dropdown-select ${( errors && errors?.buyerId && !piData?.buyerId ) && 'is-invalid'}` )}

                                />
                            </Col>

                            <Col md={3} xl={3} xxl={3}>
                                <ErpSelect
                                    label="Seller Bank"
                                    name="sellerBankId"
                                    sideBySide={false}
                                    isDisabled={true}

                                    classNames="mt-1"
                                    value={piData.sellerBankId}
                                    options={banksDataCm}
                                    onFocus={() => { handleBankOnFocus() }}
                                    onChange={( data, e ) => { handleDropDownChange( data, e ); }}

                                />
                            </Col>
                            <Col md={3} xl={3} xxl={3}>
                                <InInput
                                    // classNames="mt-1"
                                    label="From"
                                    name="from"
                                    disabled
                                    value={piData.from}
                                    onChange={( e ) => { handleInputOnChange( e ) }}
                                />
                            </Col>
                            <Col md={3} xl={3} xxl={3}>
                                <InInput
                                    // classNames="mt-1"
                                    label="To"
                                    name="to"
                                    disabled
                                    value={piData.to}
                                    onChange={( e ) => { handleInputOnChange( e ) }}
                                />
                            </Col>

                            <Col md={3} xl={3} xxl={3}>
                                <InInput
                                    // classNames="mt-1"
                                    label="Latest Shipment Date"
                                    type="date"
                                    disabled
                                    name="latestShipmentDate"
                                    min={piData.piDate}
                                    value={piData.latestShipmentDate}
                                    onChange={( e ) => { handleInputOnChange( e ) }}
                                    className={classNames( `erp-dropdown-select ${( errors && errors?.latestShipmentDate && !piData?.latestShipmentDate ) && 'is-invalid'}` )}

                                />
                            </Col>
                            <Col md={3} xl={3} xxl={3}>
                                <InInput
                                    // classNames="mt-1"
                                    label="Shipment Mode"
                                    name="shipment"
                                    disabled

                                    value={piData.shipment}
                                    onChange={( e ) => { handleInputOnChange( e ) }}
                                />
                            </Col>
                            <Col md={3} xl={3} xxl={3}>
                                <InInput
                                    // classNames="mt-1"
                                    label="Insurance"
                                    name="insurance"
                                    value={piData.insurance}
                                    onChange={( e ) => { handleInputOnChange( e ) }}
                                />
                            </Col>
                            <Col md={3} xl={3} xxl={3}>
                                <ErpSelect
                                    label="Pay Term"
                                    sideBySide={false}
                                    name="payTerm"
                                    classNames="mt-1"
                                    value={piData.payTerm}
                                    options={payTermOption}
                                    onChange={( data, e ) => { handleDropDownChange( data, e ); }}
                                    className={classNames( `erp-dropdown-select ${( errors && errors?.currencyId && !piData?.currencyId ) && 'is-invalid'}` )}

                                />
                            </Col>



                            <Col md={3} xl={3} xxl={3}>
                                <ErpSelect
                                    label="Currency"
                                    sideBySide={false}
                                    name="currencyId"
                                    classNames="mt-1"
                                    value={piData.currencyId}
                                    options={currencyDataCm}
                                    onFocus={() => { handleCurrencyOnFocus() }}
                                    onChange={( data, e ) => { handleDropDownChange( data, e ); }}
                                    className={classNames( `erp-dropdown-select ${( errors && errors?.currencyId && !piData?.currencyId ) && 'is-invalid'}` )}

                                />
                            </Col>

                            <Col md={3} xl={3} xxl={3}>
                                <InInput
                                    label="Currency Rate"
                                    placeholder="Currency Rate"
                                    name="currencyRate"
                                    type="number"
                                    onFocus={( e ) => e.target.select()}
                                    value={piData.currencyRate}
                                    onChange={( e ) => { handleInputOnChange( e ) }}
                                    className={classNames( `text-end erp-dropdown-select ${( errors && errors?.currencyRate && !piData?.currencyRate ) && 'is-invalid'}` )}

                                />
                            </Col>

                            {/* <Col md={3} xl={3} xxl={3}>
                                <InInput
                                    label="Total Amount"
                                    placeholder="Total Amount"
                                    name="totalAmount"
                                    type="number"
                                    disabled
                                    onFocus={( e ) => e.target.select()}
                                    className="text-end"
                                    value={subtotalAmount - discountedAmount}
                                    onChange={( e ) => { handleInputOnChange( e ) }}
                                />
                            </Col> */}

                            <Col md={3} xl={3} xxl={3}>
                                <InInput
                                    label="Remarks"
                                    type="textarea"
                                    placeholder="Write a note"
                                    name="note"
                                    value={piData.note}
                                    onChange={( e ) => { handleInputOnChange( e ) }}
                                />
                            </Col>

                        </FormContentLayout>
                    </div>

                    <div className="mt-2">
                        <FormContentLayout title="Items">
                            <div>
                                <Button
                                    className='float-end mb-1'
                                    size='sm'
                                    color='success'
                                    disabled={selectedItems?.length < 1 || !scItems?.length}
                                    onClick={() => { handleGroupSubmit() }}
                                >Add as Group</Button>
                            </div>

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
                                            <th>
                                                <FormGroup check
                                                    className="text-center mx-1"
                                                >
                                                    <Input
                                                        className="text-center"
                                                        type="checkbox"
                                                        name="checkAll"
                                                        checked={( scData?.items?.length && ( scData?.items?.length === selectedData?.length ) )}
                                                        onChange={handleCheckAll}
                                                    />
                                                </FormGroup>
                                            </th>
                                            <th>Base</th>
                                            <th>Action</th>
                                            <th>Item Name</th>
                                            <th>Specification</th>
                                            <th>HS Code</th>
                                            <th>Unit</th>
                                            <th>Quantity</th>
                                            <th>Price</th>
                                            <th>Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            scItems?.length > 0 && piData?.scId ? (
                                                scItems?.map( ( row, i ) => (
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
                                                                    name="isBase"
                                                                    disabled={!selectedData.includes( row.id )}
                                                                    checked={row.isBase}
                                                                    onChange={( e ) => { handleScItemInputChange( row.id, e ); }}
                                                                />{" "}
                                                            </FormGroup>
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
                                                                            onClick={() => { handleScItemsSubmitControl( row.id ) }}
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
                                                                            onClick={() => { handleScItemsEditControl( row.id ); }}
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
                                                            {
                                                                row?.isEdit ?
                                                                    <ErpInput
                                                                        sideBySide={false}
                                                                        name="description"
                                                                        value={row.description}
                                                                        onChange={( e ) => { handleScItemInputChange( row.id, e ); }}
                                                                    //
                                                                    />
                                                                    : row.description
                                                            }

                                                        </td>
                                                        <td
                                                            className='text-center'
                                                            style={{
                                                                border: "1px solid #edebeb"
                                                            }}>
                                                            {
                                                                row?.isEdit ?
                                                                    <ErpInput
                                                                        sideBySide={false}
                                                                        name="segments"
                                                                        value={row.segments}
                                                                        onChange={( e ) => { handleScItemInputChange( row.id, e ); }}
                                                                    //
                                                                    />
                                                                    : row.segments
                                                            }

                                                        </td>

                                                        <td
                                                            className='text-center'
                                                            style={{
                                                                border: "1px solid #edebeb",
                                                                width: "150px"
                                                            }}>
                                                            {
                                                                row?.isEdit ?
                                                                    <ErpInput
                                                                        sideBySide={false}
                                                                        name="hsCode"
                                                                        value={row.hsCode}
                                                                        onChange={( e ) => { handleScItemInputChange( row.id, e ); }}
                                                                    //
                                                                    />
                                                                    : row.hsCode
                                                            }

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
                                                                        onChange={( data, e ) => { handleScItemDropDownChange( row.id, data, e ); }}
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
                                                                        value={row.quantity}
                                                                        onChange={( e ) => { handleScItemInputChange( row.id, e ); }}
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
                                                                        value={row.price}
                                                                        onChange={( e ) => { handleScItemInputChange( row.id, e ); }}
                                                                    />
                                                                    :
                                                                    row?.price
                                                            }
                                                        </td>
                                                        <td className='text-center fw-bold'>
                                                            {( row.quantity * row.price ).toFixed( 2 )}
                                                        </td>
                                                    </tr>
                                                ) )
                                            ) : <tr>
                                                <td className='text-center' colSpan="10">
                                                    <p>There is no record found</p>
                                                </td>
                                            </tr>
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </FormContentLayout>
                    </div>

                    {piData?.groups?.length ? (
                        <div className="mt-2">
                            <FormContentLayout title="PI Items">
                                <div className="">
                                    <table className='w-100 border'>
                                        <thead>
                                            <tr className='text-center' style={{ backgroundColor: "#f0f1f2" }}>
                                                <th style={{ width: "5px" }}>SL</th>
                                                <th style={{ width: "5px" }}></th>
                                                <th>Action</th>
                                                <th>Item Name</th>
                                                <th>Specification</th>
                                                <th>HS Code</th>
                                                <th>Unit</th>
                                                <th>Quantity</th>
                                                <th>Unit Price</th>
                                                <th>Total</th>
                                            </tr>
                                        </thead>
                                        {/* PI group list start here */}
                                        <tbody>
                                            {
                                                piData?.groups?.map( ( row, i ) => (
                                                    <Fragment key={i}>
                                                        <tr>
                                                            <td className="text-center" style={{ border: "1px solid #edebeb" }}>
                                                                {i + 1}
                                                            </td>
                                                            <td style={{ border: "1px solid #edebeb" }} className="text-center">
                                                                {
                                                                    row?.isExpanded ?
                                                                        <span
                                                                            className="text-secondary cursor-pointer"
                                                                            onClick={() => { handleBlockClose( row.id ) }}
                                                                        >
                                                                            <ChevronDown />
                                                                        </span>
                                                                        :
                                                                        <span
                                                                            className="text-secondary cursor-pointer"
                                                                            onClick={() => { handleBlockOpen( row.id ) }}
                                                                        >
                                                                            <ChevronRight />
                                                                        </span>
                                                                }

                                                            </td>

                                                            <td className="text-center" style={{ border: "1px solid #edebeb", width: "5px" }}>
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
                                                                                <CheckSquare size={16} id="editRow" color="purple" />
                                                                            </Button.Ripple>
                                                                            :
                                                                            <Button.Ripple
                                                                                id="editRow"
                                                                                // tag={Label}
                                                                                onClick={() => { handleItemsEditControl( row.id ); }}
                                                                                className="btn-icon p-0"
                                                                                color="flat-success"
                                                                            >
                                                                                <Edit size={16} id="editRow" color="green" />
                                                                            </Button.Ripple>
                                                                    }

                                                                    <Button.Ripple
                                                                        id="editRow"
                                                                        // tag={Label}
                                                                        // onClick={() => { handleGroupDelete( row ); }}
                                                                        onClick={() => { handleDelete( row ); }}
                                                                        className="btn-icon p-0"
                                                                        color="flat-success"
                                                                        style={{ marginLeft: "5px" }}
                                                                    >
                                                                        <Delete size={16} id="editRow" color="red" />
                                                                    </Button.Ripple>
                                                                </span>

                                                            </td>

                                                            <td style={{
                                                                border: "1px solid #edebeb"
                                                            }}>
                                                                {
                                                                    row?.isEdit ?
                                                                        <ErpInput
                                                                            sideBySide={false}
                                                                            name="description"
                                                                            value={row.description ? row.description : row.name}
                                                                            onChange={( e ) => { handleItemInputChange( row.id, e ); }}
                                                                        //
                                                                        />
                                                                        : row.description ? row.description : row.name
                                                                }

                                                            </td>
                                                            <td
                                                                className='text-center'
                                                                style={{
                                                                    border: "1px solid #edebeb",
                                                                    width: "300px"
                                                                }}>
                                                                {
                                                                    row?.isEdit ?
                                                                        <ErpInput
                                                                            sideBySide={false}
                                                                            name="specification"
                                                                            value={row.specification}
                                                                            onChange={( e ) => { handleItemInputChange( row.id, e ); }}
                                                                        //
                                                                        />
                                                                        : row.specification
                                                                }

                                                            </td>

                                                            <td
                                                                className='text-center'
                                                                style={{
                                                                    border: "1px solid #edebeb",
                                                                    width: "150px"
                                                                }}>
                                                                {
                                                                    row?.isEdit ?
                                                                        <ErpInput
                                                                            sideBySide={false}
                                                                            name="hsCode"
                                                                            value={row.hsCode}
                                                                            onChange={( e ) => { handleItemInputChange( row.id, e ); }}
                                                                        //
                                                                        />
                                                                        : row.hsCode
                                                                }

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
                                                                        : row?.uoMId?.label
                                                                    // : row?.uoMId?.name ? row?.uoMId?.name : row?.uoMId?.label
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
                                                                    width: "5px"
                                                                }}
                                                            >
                                                                {( row.quantity * row.price ).toFixed( 2 )}
                                                            </td>
                                                        </tr>

                                                        {/* nested groups items small table start */}
                                                        <tr>
                                                            <td colSpan={9}>
                                                                {
                                                                    row.isExpanded && (
                                                                        <table className='w-100 border m-2'>
                                                                            <thead>
                                                                                <tr className='text-center' style={{ backgroundColor: "#f0f1f2" }}>
                                                                                    <th>SL</th>
                                                                                    <th>Item Name</th>
                                                                                    <th>Specification</th>
                                                                                    <th>HS Code</th>
                                                                                    <th>Unit</th>
                                                                                    <th>Quantity</th>
                                                                                    <th>Unit Price</th>
                                                                                    <th>Total</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody>
                                                                                {row?.items?.map( ( item, ii ) => {
                                                                                    return (
                                                                                        <tr key={ii}>
                                                                                            <ChildTd>{ii + 1}</ChildTd>
                                                                                            <ChildTd>{item.name}</ChildTd>
                                                                                            <ChildTd>{item?.segments}</ChildTd>
                                                                                            <ChildTd>{item?.hsCode}</ChildTd>
                                                                                            <ChildTd>
                                                                                                {item?.uoMId?.name ? item?.uoMId?.name : item?.uoMId?.label}
                                                                                            </ChildTd>
                                                                                            <ChildTd>{item?.quantity}</ChildTd>
                                                                                            <ChildTd>{item?.price}</ChildTd>
                                                                                            <ChildTd>{( item.quantity * item.price ).toFixed( 4 )}</ChildTd>
                                                                                        </tr>
                                                                                    )
                                                                                } )}

                                                                            </tbody>
                                                                        </table>
                                                                    )


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
                    ) : ""}


                </FormLayout >
            </div >




        </ >
    );
};

export default EditPiForm;