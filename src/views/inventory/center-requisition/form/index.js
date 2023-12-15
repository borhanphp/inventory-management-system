import { yupResolver } from '@hookform/resolvers/yup';
import classNames from 'classnames';
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
import { getAllItemsCm } from "../../../../redux/common/store";
import ErpInput from '../../../../utility/custom/ErpInput';
import ErpSelect from "../../../../utility/custom/ErpSelect";
import FormContentLayout from '../../../../utility/custom/FormContentLayout';
import FormLayout from '../../../../utility/custom/FormLayout';
import InInput from '../../../../utility/custom/InInput';
import { addNewRequisition, bindRequisitionInfo } from "../store";
import { initialRequisitionData } from '../store/model';

const breadcrumb = [
    {
        id: 'home',
        name: 'Home',
        link: "/",
        isActive: false,
        hidden: false
    }
];

const RequisitionForm = () => {
    const { itemsDataCm } = useSelector( ( { commons } ) => commons )
    const { requisitionData } = useSelector( ( { requisitions } ) => requisitions );
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const requisitionSchema = yup.object().shape( {
        requisitionCode: requisitionData?.requisitionCode?.length ? yup.string() : yup.string().required( 'PO Code is Required!!!' )
    } );
    const { reset, handleSubmit, formState: { errors } } = useForm( {
        mode: 'onChange',
        resolver: yupResolver( requisitionSchema )
    } );

    useEffect( () => {
        return () => {
            dispatch( bindRequisitionInfo() )
        }
    }, [] )

    const handleCancel = () => {
        navigate( '/purchase-list' )
    }

    const clearAllField = () => {
        reset();
        dispatch( bindRequisitionInfo( initialRequisitionData ) )
    }

    const handleInputOnChange = ( e ) => {
        const { name, value } = e.target;
        const updatedObj = {
            ...requisitionData,
            [name]: value
        };
        dispatch( bindRequisitionInfo( updatedObj ) )
    }

    const handleItemInputChange = ( itemId, e ) => {
        const { name, value } = e.target;
        const updatedItems = requisitionData?.items?.map( ( item ) =>
            item?.id === itemId ? { ...item, [name]: value } : item
        );
        dispatch( bindRequisitionInfo( {
            ...requisitionData,
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

        const duplicateItems = requisitionData?.items?.map( dd => dd.id ).includes( data?.id )
        if ( duplicateItems ) {
            toast.success( 'Item already added!' )
        } else {
            dispatch( bindRequisitionInfo( {
                ...requisitionData,
                items: [...requisitionData?.items, newItem]
            } ) )
        }

    }


    const handleItemsOnFocus = () => {
        if ( !itemsDataCm.length ) {
            dispatch( getAllItemsCm() )
        }
    }

    const handleOnSubmit = () => {
        if ( !requisitionData?.items?.length ) {
            toast.error( 'At Least one item is required' )
        } else {
            const submittedData = {
                ...requisitionData,
                requisitionCode: requisitionData.requisitionCode,
                note: requisitionData.note,
                items: requisitionData?.items.map( ( item ) => ( {
                    itemId: item.id,
                    quantity: Number( item.quantity )
                } ) )
            }
            console.log( 'submittedData', JSON.stringify( submittedData, null, 2 ) )
            dispatch( addNewRequisition( submittedData ) )
                .then( () => {
                    toast.success( 'Send Successful' );
                    dispatch( bindRequisitionInfo( initialRequisitionData ) )
                } )
                .catch( ( error ) => console.log( error ) )
        }

    }


    const handleRowsDelete = ( id ) => {
        const filteredData = requisitionData?.items?.filter( d => d.id !== id )
        dispatch( bindRequisitionInfo( { ...requisitionData, items: filteredData } ) )
    }


    return (
        <>
            <ActionMenu
                title='Item Requisition'
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
                        color='info'
                        size='sm'
                        onClick={() => { navigate( -1 ) }}
                    >Back</Button>
                </NavItem>
                <NavItem className="me-1" >
                    <Button
                        color='secondary'
                        size='sm'
                        onClick={() => { clearAllField(); }}
                    >Clear</Button>
                </NavItem>

            </ActionMenu>

            <div className='mt-3'>
                <FormLayout>
                    <div >
                        <FormContentLayout title="Requisition Information">
                            <Col md={3} xl={3} xxl={3}>
                                <ErpInput
                                    classNames="mt-1"
                                    sideBySide={false}
                                    label="Requisition Code"
                                    placeholder="EX: PO10001"
                                    name="requisitionCode"
                                    value={requisitionData.requisitionCode}
                                    onChange={( e ) => { handleInputOnChange( e ) }}
                                    className={classNames( `erp-dropdown-select ${( errors && errors?.requisitionCode && !requisitionData?.requisitionCode ) && 'is-invalid'}` )}
                                />

                            </Col>
                            <Col md={3} xl={3} xxl={3}>
                                <ErpInput
                                    classNames="mt-1"
                                    sideBySide={false}
                                    label="Requisition Date"
                                    type="date"
                                    disabled
                                    name="date"
                                    value={requisitionData.date}
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
                                    value={requisitionData.note}
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
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            requisitionData?.items?.map( ( row, i ) => (
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
                                                        // invalid={errors && errors?.quantity && !requisitionData?.items?.quantity}
                                                        />
                                                    </td>
                                                    {/* {errors?.quantity && !requisitionData?.items?.quantity && <small className="text-danger">Quantity is required.</small>} */}

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

export default RequisitionForm;