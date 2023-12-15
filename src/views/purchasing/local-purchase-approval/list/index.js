import React, { useState } from 'react'
import DataTable from 'react-data-table-component'
import { ChevronDown } from 'react-feather'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { Button, NavItem } from 'reactstrap'
import SpinnerComponent from '../../../../@core/components/spinner/Fallback-spinner'
import ActionMenu from '../../../../@core/layouts/components/ActionMenu'
import { addNewApproval } from '../store'
import { itemApprovalColumn } from './columns'


const breadcrumb = [
    {
        id: 'home',
        name: 'Home',
        link: "/",
        isActive: false,
        hidden: false
    }
];



const ItemForApprovalList = ( { handleSetSubmit } ) => {
    const { allReceiving } = useSelector( ( { itemForApprove } ) => itemForApprove );
    const dispatch = useDispatch()
    const [selectedData, setSelectedData] = useState( {
        warehouseId: 0,
        receivingId: 0,
        items: []
    } )

    const onSelectedRowsChange = ( e ) => {
        console.log( e.selectedRows );
        setSelectedData( e.selectedRows )
    }

    const handleApproval = () => {
        if ( !selectedData.length ) {
            toast.error( 'Search For Approve First' )
        } else {
            const submittedData = {
                warehouseId: selectedData[0]?.warehouseId,
                receivingId: selectedData[0]?.receivingId,
                items: selectedData?.map( d => ( {
                    id: d.id,
                    itemId: d.itemId,
                    quantity: d.quantity
                } ) )
            }
            // console.log( 'submittedData', JSON.stringify( submittedData, null, 2 ) )
            dispatch( addNewApproval( submittedData ) )
                .then( () => {
                    handleSetSubmit()
                    toast.success( 'Approved' )

                } )
        }
    }

    const rowDisabledCriteria = ( row ) => row.isApproved === true;

    return (
        <div>
            <ActionMenu
                title='Item Receive Approval'
                breadcrumb={breadcrumb}
            >
                <NavItem className="me-1" >
                    <Button
                        size="sm"
                        color="success"
                        onClick={() => { handleApproval(); }}
                    >Approve</Button>
                </NavItem>
            </ActionMenu>

            <div className='mt-2'>
                <DataTable
                    noHeader
                    persistTableHead
                    defaultSortAsc
                    sortServer
                    selectableRows
                    onSelectedRowsChange={onSelectedRowsChange}
                    selectableRowDisabled={rowDisabledCriteria}
                    // onSort={handleSort}
                    // progressPending={isLoading}
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
                    columns={itemApprovalColumn( handleApproval )}
                    sortIcon={<ChevronDown />}
                    // onRowExpandToggled={( bool, row ) => getRowIdClick( row.id )}
                    className="react-custom-dataTable"
                    // expandableRowsComponent={<AllLcList lcScData={lcScData} />}
                    data={allReceiving}
                />

                {/* <CustomPagination
                                    onPageChange={page => handlePagination( page )}
                                    currentPage={currentPage}
                                    count={Number( Math.ceil( totalItems / rowsPerPage ) )}
                                /> */}
            </div>

        </div>
    )
}

export default ItemForApprovalList