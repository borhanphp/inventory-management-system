import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import { ChevronDown } from 'react-feather'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Button, NavItem } from 'reactstrap'
import SpinnerComponent from '../../../../@core/components/spinner/Fallback-spinner'
import ActionMenu from '../../../../@core/layouts/components/ActionMenu'
import CustomModal from '../../../../utility/custom/CustomModal'
import CustomPagination from '../../../../utility/custom/CustomPagination'
import ErpInput from '../../../../utility/custom/ErpInput'
import FormContentLayout from '../../../../utility/custom/FormContentLayout'
import FormLayout from '../../../../utility/custom/FormLayout'
import { fetchAllItemsForReceive, receiveItem } from '../store'
import { receiveColumn } from './columns'


const breadcrumb = [
    {
        id: 'home',
        name: 'Home',
        link: "/",
        isActive: false,
        hidden: false
    }
];

const initialState = {
    description: '',
    stringStartDate: '',
    stringEndDate: ''

};

const ReceivingList = () => {
    const { receiveItems, totalItems, loading } = useSelector( ( { requisitions } ) => requisitions );
    const [currentPage, setCurrentPage] = useState( 1 );
    const [rowsPerPage, setRowsPerPage] = useState( 10 );
    const [transferModalOpen, setTransferModalOpen] = useState( false )
    const [formData, setFormData] = useState( {
        id: 0,
        toWarehouseId: 0,
        itemId: 0,
        receivedQuantity: 0,
        receiverComments: ""
    } )
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const [searchData, setSearchData] = useState( initialState );
    const [isDraft, setIsDraft] = useState( false );


    const handleReceive = ( row ) => {
        console.log( row )
        setTransferModalOpen( true )
        setFormData( {
            ...formData,
            id: row.id,
            toWarehouseId: row.toWarehouseId,
            itemId: row.itemId,
            receivedQuantity: row.transferedQuantity,
            receiverComments: ""
        } )
    }
    const handleModalClosed = () => {
        setTransferModalOpen( false )
    }

    const handleOnChange = ( e ) => {
        const { name, value } = e.target;
        setSearchData( { ...searchData, [name]: value } )
    }
    const handleDateChange = () => {

    }

    const handleOnSubmit = () => {
        handleModalClosed()
        console.log( 'formData', JSON.stringify( formData, null, 2 ) )
        dispatch( receiveItem( formData ) )
            .then( ( res ) => {
                if ( res.error ) {
                    return;
                } else {
                    toast.success( 'Receive Confirmed' )
                }
            } )
    }

    // for getting items with page and rows per page,
    // also using for pagination
    const getItems = ( page, perPage ) => {
        const submittedData = {
            page: page,
            pageSize: perPage,
            includes: [],
            filters: [],
            sorts: [],
        };

        for ( const key in searchData ) {
            if ( searchData[key] ) {
                let comparision = "eq";
                let fieldValue = searchData[key];

                if ( key === "description" ) {
                    comparision = "like";
                    fieldValue = searchData[key];
                } else if (
                    key === "brandId"

                ) {
                    fieldValue = searchData[key].value.toString() || null;
                }

                submittedData.filters.push( {
                    fieldName: key,
                    comparision,
                    fieldValue,
                } );
            }
        }

        // console.log( "submittedData", JSON.stringify( submittedData, null, 2 ) );
        dispatch( fetchAllItemsForReceive( submittedData ) )
    }


    useEffect( () => {
        getItems( currentPage, rowsPerPage );
    }, [] )

    const handleSort = () => {

    };

    const handleClearField = () => {
        const submittedData = {
            page: 1,
            pageSize: 10,
            includes: [],
            filters: [],
            sorts: [],
        };
        dispatch( fetchAllItemsForReceive( submittedData ) )
        setSearchData( initialState );
    };

    const handleSearch = () => {
        setCurrentPage( 1 )
        getItems( 1, rowsPerPage )
    };


    // ** Function in get data on page change
    const handlePagination = page => {
        setCurrentPage( page.selected + 1 );
        getItems( page.selected + 1, rowsPerPage );
    };

    const handlePerPage = ( selectedRowsPerPage ) => {
        setRowsPerPage( selectedRowsPerPage );
        setCurrentPage( 1 );
        getItems( 1, selectedRowsPerPage );
    };


    // const confirmObj = {
    //     title: 'Are you sure?',
    //     text: "You won't be able to revert this!",
    //     confirmButtonText: 'Yes!',
    //     cancelButtonText: 'No'
    // };

    // const handleDelete = ( id ) => {
    //     confirmDialog( {
    //         ...confirmObj
    //     } ).then( async e => {
    //         if ( e.isConfirmed ) {
    //             dispatch( deleteOfferedItem( id ) )
    //                 .then( () => {
    //                     const paramObj = {
    //                         page: currentPage,
    //                         pageSize: rowsPerPage
    //                     }
    //                     dispatch( getAllOfferedItems( paramObj ) )
    //                     dispatch( bindOfferedItemInfo( initialOfferedData ) )
    //                     toast.success( 'Offer Deleted' );
    //                 } )
    //         }
    //     } );
    // };




    return (
        <div>
            <ActionMenu
                title='Waiting for Receive'
                breadcrumb={breadcrumb}
                moreButton={false}
            >
                <NavItem className="me-1" >
                    <Button
                        size="sm"
                        color="success"
                        onClick={() => { navigate( '/item-requisition' ) }}
                    >Add Requisition</Button>
                </NavItem>
            </ActionMenu>
            <div className=''>


                <div>
                    <FormLayout>
                        <FormContentLayout>
                            <div className='px-2'>

                                <DataTable
                                    noHeader
                                    persistTableHead
                                    defaultSortAsc
                                    sortServer
                                    // selectableRows
                                    // onSelectedRowsChange={onSelectedRowsChange}
                                    // selectableRowDisabled={rowDisabledCriteria}
                                    // onSort={handleSort}
                                    progressPending={loading}
                                    progressComponent={
                                        <SpinnerComponent />
                                    }
                                    dense
                                    subHeader={false}
                                    highlightOnHover
                                    responsive={true}
                                    paginationServer
                                    // expandableRows={true}
                                    // expandOnRowClicked
                                    columns={receiveColumn( handleReceive )}
                                    sortIcon={<ChevronDown />}
                                    // onRowExpandToggled={( bool, row ) => getRowIdClick( row.id )}
                                    className="react-custom-dataTable"
                                    // expandableRowsComponent={<AllLcList lcScData={lcScData} />}
                                    data={receiveItems}
                                />

                                <CustomPagination
                                    onPageChange={page => handlePagination( page )}
                                    currentPage={currentPage}
                                    count={Number( Math.ceil( totalItems / rowsPerPage ) )}
                                />
                            </div>


                        </FormContentLayout>
                    </FormLayout>
                </div>


            </div>

            <CustomModal
                isOpen={transferModalOpen}
                onClosed={handleModalClosed}
                toggle={() => setTransferModalOpen( !transferModalOpen )}
                className="modal-dialog-centered modal-md"
                title="Receiving Note"
            >

                <div>
                    <ErpInput
                        name="receiverComments"
                        sideBySide={false}
                        label="Note"
                        type="textarea"
                        value={formData.receiverComments}
                        onChange={( e ) => { setFormData( { ...formData, receiverComments: e.target.value } ) }}
                    // invalid={errors && errors?.quantity && !centralRequisitionData?.items?.quantity}
                    />
                </div>

                <div className="mt-2">
                    <Button
                        color="primary"
                        className="float-end"
                        size="sm"
                        onClick={() => { handleOnSubmit() }}
                    >
                        Submit
                    </Button>
                </div>

            </CustomModal>
        </div>


    )
}

export default ReceivingList