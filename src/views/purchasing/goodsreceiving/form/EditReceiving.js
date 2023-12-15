import { yupResolver } from '@hookform/resolvers/yup';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { MinusSquare, Plus } from 'react-feather';
import { useForm } from 'react-hook-form';
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
import { getAllCiCm, getAllWarehouseCm } from "../../../../redux/common/store";
import ErpSelect from "../../../../utility/custom/ErpSelect";
import FormContentLayout from '../../../../utility/custom/FormContentLayout';
import FormLayout from '../../../../utility/custom/FormLayout';
import InInput from '../../../../utility/custom/InInput';
import { bindReceivingInfo, fetchAllReceivings, getItemsByCi, getMrrCode, getReceivingById, updateReceiving } from "../store";
import { initialReceivingData } from "../store/model";



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



const EditReceivingForm = () => {
    const { itemsDataCm, warehouseDataCm, ciDataCm } = useSelector( ( { commons } ) => commons )
    const { receivingData, mrrCode, ciItems } = useSelector( ( { receivings } ) => receivings );
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const location = useLocation()
    const [modalOpen, setModalOpen] = useState( false );
    const [selectedData, setSelectedData] = useState( [] );
    const [checkAll, setCheckAll] = useState( false )


    const receivingId = location.state

    const selectedItems = receivingData?.reItems?.filter( item => selectedData.some( selectedItem => selectedItem === item.itemId ) );

    useEffect( () => {
        dispatch( getReceivingById( receivingId ) )
        return () => {
            dispatch( bindReceivingInfo( initialReceivingData ) )
        }
    }, [receivingId] )

    const itemReceivingSchema = yup.object().shape( {
        warehouseId: receivingData?.warehouseId ? yup.string() : yup.string().required( 'Warehouse is Required!!!' ),
        ciId: receivingData?.ciId ? yup.string() : yup.string().required( 'CI is Required!!!' ),
        date: receivingData?.date?.length ? yup.string() : yup.string().required( 'Date is Required!!!' ),
    } );
    const { reset, handleSubmit, formState: { errors } } = useForm( {
        mode: 'onChange',
        resolver: yupResolver( itemReceivingSchema )
    } );

    const handleModalOpen = () => {
        setModalOpen( true )
        dispatch( getItemsByCi( receivingData?.ciId?.value ) )
            .then( ( res ) => {
                dispatch( bindReceivingInfo( {
                    ...receivingData,
                    reItems: res.payload
                } ) )
            } )
    }
    const handleModalClosed = () => {
        setModalOpen( false )
    }
    const handleCancel = () => {
        navigate( '/receiving-list' )
    }
    const clearAllField = () => {
        reset()
        dispatch( bindReceivingInfo( initialReceivingData ) )
    }

    const handleCheckAll = () => {
        setCheckAll( !checkAll );
        if ( !checkAll ) {
            const allItemIds = receivingData?.reItems?.map( ( row ) => row.id ) || [];
            setSelectedData( allItemIds );
        } else {
            setSelectedData( [] );
        }
    };

    const handleSelectedRows = ( e, id ) => {
        if ( receivingData?.reItems?.length === selectedData.length ) {
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

    // const handleModalSubmit = () => {
    //     const data = selectedItems?.map( dd => dd?.itemId )
    //     const duplicateItems = receivingData?.items?.map( dd => dd.itemId ).includes( data )
    //     console.log( 'duplicateItems', duplicateItems );
    //     if ( duplicateItems ) {
    //         toast.success( 'Item already added!' )
    //     } else {
    //         dispatch( bindReceivingInfo( {
    //             ...receivingData,
    //             items: [...receivingData.items, ...selectedItems]
    //         } ) )
    //     }
    //     setModalOpen( false );
    // };

    const handleModalSubmit = () => {
        const data = selectedItems?.map( dd => dd?.itemId );
        const duplicateItems = data.some( itemId => receivingData?.items?.some( dd => dd.itemId === itemId ) );
        console.log( 'duplicateItems', duplicateItems );

        if ( duplicateItems ) {
            toast.success( 'Item already added!' );
        } else {
            dispatch( bindReceivingInfo( {
                ...receivingData,
                items: [...receivingData.items, ...selectedItems],
            } ) );
        }

        setModalOpen( false );
    };



    console.log( ' receivingData', receivingData );
    console.log( ' selectedItems', selectedItems );

    const handleInputOnChange = ( e ) => {
        const { name, value } = e.target;
        const updatedObj = {
            ...receivingData,
            [name]: value
        };
        dispatch( bindReceivingInfo( updatedObj ) )
    }

    // console.log( receivingData )
    const handleDropDownChange = ( data, e ) => {
        const { name } = e

        if ( name === 'ciId' && receivingData?.warehouseId?.value ) {
            const sendData = {
                warehouseId: receivingData?.warehouseId?.value,
                ciId: data?.value
            }
            dispatch( getMrrCode( sendData ) )
                .then( ( response ) => {
                    dispatch( getItemsByCi( data?.value ) )
                        .then( ( res ) => {
                            const modifiedData = res?.payload?.map( ( item ) => ( {
                                ...item,
                                quantity: '',
                            } ) );
                            dispatch( bindReceivingInfo( {
                                ...receivingData,
                                name: response.payload,
                                [name]: data,
                                items: modifiedData
                            } ) )
                        } )
                } )

        } else if ( name === 'warehouseId' && receivingData?.ciId?.value ) {
            const sendData = {
                ciId: receivingData?.ciId?.value,
                warehouseId: data?.value
            }
            dispatch( getMrrCode( sendData ) )
                .then( ( response ) => {
                    dispatch( getItemsByCi( receivingData?.ciId?.value ) )
                        .then( ( res ) => {
                            const modifiedData = res?.payload?.map( ( item ) => ( {
                                ...item,
                                quantity: '',
                            } ) );
                            dispatch( bindReceivingInfo( {
                                ...receivingData,
                                name: response.payload,
                                [name]: data,
                                items: modifiedData,
                            } ) )
                        } )
                } )



        } else {
            dispatch( bindReceivingInfo( { ...receivingData, [name]: data } ) )
        }

    }

    const handleItemInputChange = ( itemId, e ) => {
        const { name, value } = e.target;
        const updatedItems = receivingData?.items?.map( ( item ) =>
            item?.itemId === itemId ? { ...item, [name]: value } : item
        );

        console.log( 'updatedItems', updatedItems );
        dispatch( bindReceivingInfo( {
            ...receivingData,
            items: updatedItems
        } ) )
    };

    const handleItemChange = ( data, e ) => {
        const { name } = e;
        const newItem = {
            ...data,
            quantity: ''
        };

        const duplicateItems = receivingData?.items?.map( dd => dd.id ).includes( data?.id )
        if ( duplicateItems ) {
            toast.success( 'Item already added!' )
        } else {
            dispatch( bindReceivingInfo( {
                ...receivingData,
                items: [...receivingData.items, newItem]
            } ) )
        }

    }

    const handleOnSubmit = ( cb ) => {
        const { date, ciId, warehouseId, note, name } = receivingData;

        const itemQ = receivingData?.items?.every( d => d.quantity !== '' );

        if ( !receivingData?.items?.length ) {
            toast.error( 'At least one item is required' );
        } else if ( !itemQ ) {
            toast.error( 'Item Quantity is Required' );
        } else {
            const submittedData = {
                ...receivingData,
                ciId: ciId?.value,
                warehouseId: warehouseId.value,
                name: name,
                date: date,
                note: note,
                isDraft: cb === "publish" ? false : true,
                items: receivingData?.items?.map( ( item ) => ( {
                    id: item?.id,
                    itemId: item?.itemId,
                    quantity: +item.quantity,
                    scItemId: item?.scItemId
                } ) )
            }
            console.log( 'submittedData', JSON.stringify( submittedData, null, 2 ) )
            dispatch( updateReceiving( submittedData ) )
                .then( ( res ) => {
                    if ( res.error ) {
                        return;
                    } else {
                        const paramsObj = {
                            page: 1,
                            pageSize: 10
                        };
                        dispatch( fetchAllReceivings( paramsObj ) );
                        navigate( '/receiving-list' );
                        toast.success( 'Updated successfully' );
                    }

                } )
        }

    }

    const handleRowsDelete = ( id ) => {
        const filteredData = receivingData?.items?.filter( d => d.itemId !== id )
        dispatch( bindReceivingInfo( { ...receivingData, items: filteredData } ) )
    }


    const paramObj = {
        page: 1,
        pageSize: 10000000
    }
    const handleWarehouseOnFocus = () => {
        if ( !warehouseDataCm.length ) {
            dispatch( getAllWarehouseCm() )
        }
    }

    const handleCiOnFocus = () => {
        if ( !ciDataCm.length ) {
            dispatch( getAllCiCm( paramObj ) )
        }
    }


    console.log( 'receivingData?.reItems', receivingData?.reItems )


    return (
        <>
            <ActionMenu
                title='Edit Receiving ( MRR )'
                breadcrumb={breadcrumb}
            >
                <NavItem className="me-1" >
                    <Button
                        size="sm"
                        color="primary"
                        // onClick={() => { handleOnSubmit(); }}
                        onClick={handleSubmit( () => { handleOnSubmit( 'publish' ) } )}
                    >Submit</Button>
                </NavItem>
                <NavItem className="me-1" >
                    <Button
                        size="sm"
                        color="success"
                        // onClick={() => { handleOnSubmit(); }}
                        onClick={handleSubmit( () => { handleOnSubmit( 'draft' ) } )}

                    >Save as Draft</Button>
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
                        Back
                    </Button>
                </NavItem>
            </ActionMenu>

            <div className='mt-3'>
                <FormLayout>
                    <div >
                        <FormContentLayout title="Receiving Information">
                            <Col md={3}>
                                <ErpSelect
                                    label="Warehouse"
                                    classNames="mt-1"
                                    name="warehouseId"
                                    sideBySide={false}
                                    isDisabled={true}
                                    options={warehouseDataCm}
                                    value={receivingData.warehouseId}
                                    onFocus={() => { handleWarehouseOnFocus() }}
                                    onChange={( data, e ) => { handleDropDownChange( data, e ); }}
                                    className={classNames( `erp-dropdown-select ${( errors && errors?.warehouseId && !receivingData?.warehouseId ) && 'is-invalid'}` )}

                                />
                            </Col>
                            <Col md={3}>
                                <ErpSelect
                                    label="CI Number"
                                    classNames="mt-1"
                                    name="ciId"
                                    sideBySide={false}
                                    isDisabled={true}

                                    options={ciDataCm}
                                    value={receivingData.ciId}
                                    onFocus={() => { handleCiOnFocus() }}
                                    onChange={( data, e ) => { handleDropDownChange( data, e ); }}
                                    className={classNames( `erp-dropdown-select ${( errors && errors?.ciId && !receivingData?.ciId ) && 'is-invalid'}` )}
                                    secondaryOption={
                                        <div className="input-group-append" style={{ zIndex: 0 }}>
                                            <Button.Ripple
                                                // tag={InputGroupText}
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
                            <Col md={3}>
                                <InInput
                                    // classNames="mt-1"
                                    label="MRR Number"
                                    disabled
                                    placeholder="EX: PO10001"
                                    name="name"
                                    value={receivingData.name}
                                    onChange={( e ) => { handleInputOnChange( e ) }}
                                />
                            </Col>

                            <Col md={3}>
                                <InInput
                                    // classNames="mt-1"
                                    label="Receiving Date"
                                    placeholder="Receiving Date"
                                    type="date"
                                    name="date"
                                    value={receivingData.date}
                                    onChange={( e ) => { handleInputOnChange( e ) }}
                                    className={classNames( `erp-dropdown-select ${( errors && errors?.date && !receivingData?.date ) && 'is-invalid'}` )}
                                />
                            </Col>

                            <Col md={3}>
                                <InInput
                                    // classNames="mt-1"
                                    label="Note"
                                    placeholder="Write Description"
                                    name="note"
                                    type="textarea"
                                    value={receivingData.note}
                                    onChange={( e ) => { handleInputOnChange( e ) }}
                                />
                            </Col>

                            <hr className="mt-2" />
                            {/* <Col md={12} className="mb-2">
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
                            </Col> */}
                            <div className="">
                                <table className='w-100 border'>
                                    <thead>
                                        <tr className='text-center' style={{ backgroundColor: "#f0f1f2" }}>
                                            <th>SL</th>
                                            <th>Item Name</th>
                                            <th>SC Quantity</th>
                                            <th>Rcv. Quantity</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            receivingData?.items?.map( ( row, i ) => (
                                                <tr key={i}>
                                                    <td className="text-center" style={{ border: "1px solid #edebeb" }}>{i + 1}</td>

                                                    <td style={{ width: "70%", border: "1px solid #edebeb" }}>
                                                        <span className="ms-1">{row.description}</span>
                                                    </td>
                                                    <td className="text-center" style={{ border: "1px solid #edebeb" }}>
                                                        <span className="ms-1">{row.salesContractQuantity ? row.salesContractQuantity : row.scQuantity}</span>
                                                    </td>
                                                    <td style={{ border: "1px solid #edebeb" }}>
                                                        <CustomInput
                                                            name="quantity"
                                                            type="number"
                                                            className="text-end"
                                                            value={row.quantity}
                                                            onFocus={( e ) => { e.target.select() }}
                                                            onChange={( e ) => { handleItemInputChange( row.itemId, e ); }}
                                                        />
                                                    </td>
                                                    <td className='text-center' style={{ border: "1px solid #edebeb" }}>
                                                        <Button.Ripple
                                                            // disabled={rows.length === 1}
                                                            onClick={() => { handleRowsDelete( row.itemId ); }}
                                                            className="btn-icon p-0"
                                                            color="flat-light"
                                                        >
                                                            <MinusSquare
                                                                className='cursor-pointer'
                                                                color='red'
                                                                size={16}
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
                isOpen={modalOpen}
                onClosed={handleModalClosed}
                toggle={() => setModalOpen( !modalOpen )}
                className="modal-dialog-centered modal-xl"
            >
                <ModalHeader
                    className="bg-light"
                    toggle={() => setModalOpen( !modalOpen )}
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
                                                checked={receivingData?.reItems?.length === selectedData?.length}
                                                // checked={!!( receivingData?.reItems?.length && ( receivingData?.reItems?.length === selectedData?.length ) )}
                                                onChange={handleCheckAll}
                                            />
                                        </FormGroup>
                                    </th>
                                    <th>Item Name</th>
                                    <th>SC Quantity</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    receivingData?.reItems?.map( ( row, i ) => (
                                        <tr key={i}>
                                            <td className="text-center" style={{ border: "1px solid #edebeb" }}>{i + 1}</td>
                                            <td className="text-center" style={{ border: "1px solid #edebeb", width: "10px" }}>
                                                <FormGroup check
                                                    className="text-center mx-1"

                                                >
                                                    <Input
                                                        className="text-center"
                                                        type="checkbox"
                                                        name="scitemcheck"
                                                        checked={selectedData.includes( row.itemId )}
                                                        onChange={( e ) => handleSelectedRows( e, row.itemId )}
                                                    />{" "}
                                                </FormGroup>
                                            </td>

                                            <td style={{ width: "70%", border: "1px solid #edebeb" }}>
                                                <span className="ms-1">{row.description}</span>
                                            </td>
                                            <td className="text-center" style={{ border: "1px solid #edebeb" }}>
                                                <span className="ms-1">{row.scQuantity}</span>
                                            </td>
                                        </tr>
                                    ) )
                                }
                            </tbody>
                        </table>

                        <Button.Ripple
                            disabled={!receivingData?.reItems?.length}
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

export default EditReceivingForm;