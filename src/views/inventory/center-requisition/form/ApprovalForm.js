import { Fragment, useEffect, useState } from "react";
import { CheckSquare, ChevronDown, X } from "react-feather";
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
    Button,
    Col, Modal, ModalBody, ModalHeader, NavItem, Table
} from "reactstrap";
import ActionMenu from '../../../../@core/layouts/components/ActionMenu';
import '../../../../assets/scss/item/item-style.scss';
import { getAllItemsCm, getAllWarehouseCm } from "../../../../redux/common/store";
import { ErpDetails } from "../../../../utility/custom/ErpDetails";
import ErpInput from '../../../../utility/custom/ErpInput';
import ErpSelect from "../../../../utility/custom/ErpSelect";
import FormContentLayout from '../../../../utility/custom/FormContentLayout';
import FormLayout from '../../../../utility/custom/FormLayout';
import { approveRequisition, bindCentralRequisitionInfo, declineRequisition, getCentralRequisitionById } from "../store";

const breadcrumb = [
    {
        id: 'home',
        name: 'Home',
        link: "/",
        isActive: false,
        hidden: false
    }
];

const ApprovalForm = () => {
    const { itemsDataCm, warehouseDataCm } = useSelector( ( { commons } ) => commons )
    const { centralRequisitionData } = useSelector( ( { centralRequisition } ) => centralRequisition );
    const [blockPortal, setBlockPortal] = useState( false );
    const [blockId, setBlockId] = useState();
    const [openModal, setOpenModal] = useState( false );
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const location = useLocation()
    const requisitionId = location.state

    useEffect( () => {
        dispatch( getCentralRequisitionById( requisitionId ) )
    }, [requisitionId] )

    console.log( centralRequisitionData );

    const handleInputOnChange = ( e ) => {
        const { name, value } = e.target;
        const updatedObj = {
            ...centralRequisitionData,
            [name]: value
        };
        dispatch( bindCentralRequisitionInfo( updatedObj ) )
    }

    const handleItemInputChange = ( itemId, e ) => {
        const { name, value } = e.target;
        const updatedItems = centralRequisitionData?.items?.map( ( item ) =>
            item?.id === itemId ? { ...item, [name]: value } : item
        );
        dispatch( bindCentralRequisitionInfo( {
            ...centralRequisitionData,
            items: updatedItems
        } ) )
    };

    const handleDropDownChange = ( data, e, itemId ) => {
        const { name } = e;
        const updatedItems = centralRequisitionData.items.map( ( item ) =>
            item.id === itemId ? { ...item, [name]: data } : item
        );
        dispatch( bindCentralRequisitionInfo( {
            ...centralRequisitionData,
            items: updatedItems
        } ) )
    }


    const handleItemChange = ( data, e ) => {
        const { name } = e;
        const newItem = {
            ...data,
            quantity: '',
            price: ''
        };

        const duplicateItems = centralRequisitionData?.items?.map( dd => dd.id ).includes( data?.id )
        if ( duplicateItems ) {
            toast.success( 'Item already added!' )
        } else {
            dispatch( bindCentralRequisitionInfo( {
                ...centralRequisitionData,
                items: [...centralRequisitionData?.items, newItem]
            } ) )
        }

    }


    const handleItemsOnFocus = () => {
        if ( !itemsDataCm.length ) {
            dispatch( getAllItemsCm() )
        }
    }

    const handleOnSubmit = ( id ) => {
        const submittedData = centralRequisitionData?.items?.filter( d => d.id === id ).map( ( item ) => ( {
            id: item.id,
            requisitionId: item.requisitionId,
            quantity: Number( item.quantity ),
            fromWarehouseId: item.fromWarehouseId.value,
            toWarehouseId: item.toWarehouseId.value,
            commentsForRequisitor: item.commentsForRequisitor,
            commentsForTransferer: item.commentsForTransferer

        } ) )

        console.log( 'submittedData', JSON.stringify( submittedData[0], null, 2 ) )
        dispatch( approveRequisition( submittedData[0] ) )
            .then( ( res ) => {
                if ( !res.error ) {
                    dispatch( getCentralRequisitionById( requisitionId ) )
                    toast.success( 'Approved' );
                }
            } )
            .catch( ( error ) => console.log( error ) )

    }
    const handleDecline = ( id ) => {
        const submittedData = centralRequisitionData?.items?.filter( d => d.id === id ).map( ( item ) => ( {
            id: item.id,
            itemId: item.itemId,
            requisitionId: item.requisitionId,
            commentsForRequisitor: "Your request has been declined"
        } ) )
        if ( !submittedData[0].commentsForRequisitor ) {
            toast.error( 'Write a Comment Please' );
            return;
        }
        console.log( 'submittedData', JSON.stringify( submittedData[0], null, 2 ) )
        dispatch( declineRequisition( submittedData[0] ) )
            .then( () => {
                toast.error( 'Declined' );
                dispatch( getCentralRequisitionById( requisitionId ) )
            } )
            .catch( ( error ) => console.log( error ) )

    }


    const handleRowsDelete = ( id ) => {
        const filteredData = centralRequisitionData?.items?.filter( d => d.id !== id )
        dispatch( bindCentralRequisitionInfo( { ...centralRequisitionData, items: filteredData } ) )
    }

    const handleWarehouseOnFocus = () => {
        if ( !warehouseDataCm.length ) {
            dispatch( getAllWarehouseCm() )
        }
    }

    const handleBlockOpen = ( id ) => {
        setBlockId( id )
        if ( blockId === id ) {
            setBlockPortal( !blockPortal )

        }
    }

    const handleModalOpen = ( id ) => {
        setOpenModal( true )
    }
    const handleModalClosed = () => {
        setOpenModal( false )
    }


    return (
        <>
            <ActionMenu
                title='Requisition Approval'
                breadcrumb={breadcrumb}
            >
                {/* <NavItem className="me-1" >
                    <Button
                        size="sm"
                        color="success"
                        onClick={() => { handleOnSubmit(); }}
                    >Approve</Button>
                </NavItem> */}
                <NavItem className="me-1" >
                    <Button
                        size="sm"
                        color="danger"
                        onClick={() => { navigate( -1 ) }}
                    >Cancel</Button>
                </NavItem>
            </ActionMenu>

            <div className='mt-3'>
                <FormLayout>
                    <div >
                        <FormContentLayout title="Requisition Information">
                            <Col md={3} xl={3} xxl={3}>
                                <ErpDetails label="Requisition Code" value={centralRequisitionData?.requisitionCode} />
                            </Col>
                            <Col md={3} xl={3} xxl={3}>
                                <ErpDetails label="Requisition Date" value={centralRequisitionData?.stringRequisitionDate} />
                            </Col>
                            <Col md={3} xl={3} xxl={3}>
                                <ErpDetails label="Note" value={centralRequisitionData?.note} />
                            </Col>

                            <div className="mt-2">
                                <table className='w-100 border'>
                                    <thead>
                                        <tr className='text-center' style={{ backgroundColor: "#f0f1f2" }}>
                                            <th style={{ width: "5px" }}>SL</th>
                                            <th></th>
                                            <th>Status</th>
                                            <th>Item Name</th>
                                            <th>From</th>
                                            <th>To</th>
                                            <th>Quantity</th>
                                            {/* <th>note</th> */}
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            centralRequisitionData?.items?.map( ( row, i ) => (
                                                <Fragment key={i}>
                                                    <tr key={i} >
                                                        <td style={{ border: "1px solid #edebeb" }} className="text-center">{i + 1}</td>
                                                        <td style={{ border: "1px solid #edebeb" }} className="text-center">
                                                            <span
                                                                className="text-secondary cursor-pointer"
                                                                onClick={() => { handleBlockOpen( row.id ) }}
                                                            >
                                                                <ChevronDown />
                                                            </span>
                                                        </td>
                                                        <td style={{ border: "1px solid #edebeb" }} className="text-center">

                                                            {
                                                                row.itemStatus === "Acccepted" ? <span className={`badge bg-success`}>A</span> :
                                                                    row.itemStatus === "Declined" ? <span className={`badge bg-danger`}>D</span> :
                                                                        row.itemStatus === "Pending" ? <span className={`badge bg-primary`}>P</span> :
                                                                            ""}

                                                        </td>

                                                        <td style={{ border: "1px solid #edebeb" }}>
                                                            <span className="ms-1">{row.description}</span>
                                                        </td>
                                                        <td style={{ width: "200px", border: "1px solid #edebeb" }}>
                                                            <ErpSelect
                                                                name="fromWarehouseId"
                                                                sideBySide={false}
                                                                options={warehouseDataCm}
                                                                value={row.fromWarehouseId}
                                                                isDisabled={row.itemStatus !== "Pending"}

                                                                onFocus={() => { handleWarehouseOnFocus() }}
                                                                onChange={( data, e ) => { handleDropDownChange( data, e, row.id ); }}
                                                            // invalid={errors && errors?.quantity && !centralRequisitionData?.items?.quantity}
                                                            />
                                                        </td>
                                                        <td style={{ width: "200px", border: "1px solid #edebeb" }}>
                                                            <ErpSelect
                                                                name="toWarehouseId"
                                                                sideBySide={false}
                                                                options={warehouseDataCm}
                                                                value={row.toWarehouseId}
                                                                isDisabled={row.itemStatus !== "Pending"}
                                                                onFocus={() => { handleWarehouseOnFocus() }}
                                                                onChange={( data, e ) => { handleDropDownChange( data, e, row.id ); }}
                                                            // invalid={errors && errors?.quantity && !centralRequisitionData?.items?.quantity}
                                                            />
                                                        </td>
                                                        <td style={{ width: "200px", border: "1px solid #edebeb" }}>
                                                            <ErpInput
                                                                name="quantity"
                                                                sideBySide={false}
                                                                className="text-end"
                                                                disabled={row.itemStatus !== "Pending"}
                                                                value={row.quantity}
                                                                onChange={( e ) => { handleItemInputChange( row.id, e ); }}
                                                            // invalid={errors && errors?.quantity && !centralRequisitionData?.items?.quantity}
                                                            />
                                                        </td>
                                                        {/* <td style={{ width: "200px", border: "1px solid #edebeb" }}>
                                                            <ErpInput
                                                                name="commentsForRequisitor"
                                                                sideBySide={false}
                                                                style={{ height: "10px" }}
                                                                type="textarea"
                                                                value={row.commentsForRequisitor}
                                                                onChange={( e ) => { handleItemInputChange( row.id, e ); }}
                                                            // invalid={errors && errors?.quantity && !centralRequisitionData?.items?.quantity}
                                                            />
                                                        </td> */}
                                                        {/* {errors?.quantity && !centralRequisitionData?.items?.quantity && <small className="text-danger">Quantity is required.</small>} */}

                                                        <td className='text-center' style={{ border: "1px solid #edebeb" }}>
                                                            <Button
                                                                className=""
                                                                size="sm"
                                                                color="success"
                                                                disabled={row.itemStatus !== "Pending"}
                                                                onClick={() => { handleOnSubmit( row.id ) }}
                                                            >
                                                                <CheckSquare size={15} />
                                                            </Button>
                                                            <Button
                                                                className=""
                                                                size="sm"
                                                                color="danger"
                                                                disabled={row.itemStatus !== "Pending"}

                                                                onClick={() => { handleDecline( row.id ) }}
                                                            >
                                                                <X size={15} />
                                                            </Button>
                                                        </td>


                                                    </tr>

                                                    <tr>
                                                        <td colSpan={7}>
                                                            {
                                                                blockPortal && blockId === row.id ? (
                                                                    <Table>
                                                                        <tbody>
                                                                            <tr>
                                                                                <td>Home</td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </Table>
                                                                ) : ''
                                                            }
                                                        </td>
                                                    </tr>

                                                </Fragment>

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
                isOpen={openModal}
                onClosed={handleModalClosed}
                toggle={() => setOpenModal( !openModal )}
                className="modal-dialog-centered modal-md"
            >
                <ModalHeader
                    className="bg-light"
                    toggle={() => setOpenModal( !openModal )}
                >
                    Approve Item
                </ModalHeader>
                {
                    centralRequisitionData?.items?.map( ( row, i ) => {
                        return (
                            <div key={i}>
                                <ErpInput
                                    name="commentsForRequisitor"
                                    sideBySide={false}
                                    style={{ height: "10px" }}
                                    type="textarea"
                                    value={row.commentsForRequisitor}
                                    onChange={( e ) => { handleItemInputChange( row.id, e ); }}
                                // invalid={errors && errors?.quantity && !centralRequisitionData?.items?.quantity}
                                />
                                <ErpInput
                                    name="commentsForRequisitor"
                                    sideBySide={false}
                                    style={{ height: "10px" }}
                                    type="textarea"
                                    value={row.commentsForRequisitor}
                                    onChange={( e ) => { handleItemInputChange( row.id, e ); }}
                                // invalid={errors && errors?.quantity && !centralRequisitionData?.items?.quantity}
                                />
                            </div>
                        )
                    } )
                }
                <ModalBody className="px-5 pb-5">


                    <div className="mt-2">
                        <Button
                            color="primary"
                            className="float-end"
                            size="sm"
                            onClick={handleModalClosed}
                        >
                            Approve
                        </Button>
                    </div>
                </ModalBody>
            </Modal>

        </ >
    );
};

export default ApprovalForm;