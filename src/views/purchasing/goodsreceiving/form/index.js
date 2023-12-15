import { yupResolver } from '@hookform/resolvers/yup';
import classNames from 'classnames';
import { MinusSquare } from 'react-feather';
import { useForm } from 'react-hook-form';
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
    Button,
    Col, Input, NavItem
} from "reactstrap";
import * as yup from 'yup';
import ActionMenu from '../../../../@core/layouts/components/ActionMenu';
import '../../../../assets/scss/item/item-style.scss';
import { getAllCiCm, getAllItemsCm, getAllWarehouseCm } from "../../../../redux/common/store";
import ErpSelect from "../../../../utility/custom/ErpSelect";
import FormContentLayout from '../../../../utility/custom/FormContentLayout';
import FormLayout from '../../../../utility/custom/FormLayout';
import InInput from '../../../../utility/custom/InInput';
import { addNewReceiving, bindReceivingInfo, fetchAllReceivings, getItemsByCi, getMrrCode } from "../store";
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



const ReceivingForm = () => {
    const { itemsDataCm, warehouseDataCm, ciDataCm } = useSelector( ( { commons } ) => commons )
    const { receivingData, mrrCode, ciItems } = useSelector( ( { receivings } ) => receivings );
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const itemReceivingSchema = yup.object().shape( {
        warehouseId: receivingData?.warehouseId ? yup.string() : yup.string().required( 'Warehouse is Required!!!' ),
        ciId: receivingData?.ciId ? yup.string() : yup.string().required( 'CI is Required!!!' ),
        date: receivingData?.date?.length ? yup.string() : yup.string().required( 'Date is Required!!!' ),
    } );
    const { reset, handleSubmit, formState: { errors } } = useForm( {
        mode: 'onChange',
        resolver: yupResolver( itemReceivingSchema )
    } );

    const handleCancel = () => {
        navigate( '/receiving-list' )
    }
    const clearAllField = () => {
        reset()
        dispatch( bindReceivingInfo( initialReceivingData ) )
    }

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

    console.log( receivingData );

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
        const { date, ciId, warehouseId, note } = receivingData;

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
                name: mrrCode,
                date: date,
                note: note,
                isDraft: cb === "publish" ? false : true,
                items: receivingData?.items?.map( ( item ) => ( {
                    itemId: item?.itemId,
                    quantity: +item.quantity,
                    scItemId: item?.scItemId
                } ) )
            }
            console.log( 'submittedData', JSON.stringify( submittedData, null, 2 ) )
            dispatch( addNewReceiving( submittedData ) )
                .then( ( res ) => {
                    if ( res.error ) {
                        return;
                    } else {
                        const paramsObj = {
                            page: 1,
                            pageSize: 10
                        };
                        dispatch( bindReceivingInfo( initialReceivingData ) );
                        dispatch( fetchAllReceivings( paramsObj ) );
                        toast.success( 'Item Receiving add successfully' );
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

    const handleItemsOnFocus = () => {
        if ( !itemsDataCm.length ) {
            dispatch( getAllItemsCm() )
        }
    }

    return (
        <>
            <ActionMenu
                title='New Receiving ( MRR )'
                breadcrumb={breadcrumb}
            >
                <NavItem className="me-1" >
                    <Button
                        size="sm"
                        color="primary"
                        // onClick={() => { handleOnSubmit(); }}
                        onClick={handleSubmit( () => { handleOnSubmit( 'publish' ) } )}

                    >Save</Button>
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
                                    options={ciDataCm}
                                    value={receivingData.ciId}
                                    onFocus={() => { handleCiOnFocus() }}
                                    onChange={( data, e ) => { handleDropDownChange( data, e ); }}
                                    className={classNames( `erp-dropdown-select ${( errors && errors?.ciId && !receivingData?.ciId ) && 'is-invalid'}` )}

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
                                                        <span className="ms-1">{row.scQuantity}</span>
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

        </ >
    );
};

export default ReceivingForm;