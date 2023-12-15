import moment from 'moment';
import { Archive, MoreVertical, Trash2 } from 'react-feather';
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';

export const requisitionColumn = ( handleEdit, handleDelete ) => {


    const columns = [
        {
            name: 'Actions',
            width: '70px',
            cell: ( row ) => (
                <div className='column-action'>
                    <UncontrolledDropdown>
                        <DropdownToggle tag='div' className='btn btn-sm'>
                            <MoreVertical size={14} className='cursor-pointer' />
                        </DropdownToggle>
                        <DropdownMenu>
                            <DropdownItem
                                className='w-100'
                                onClick={() => { handleEdit( row ) }}
                            >
                                <Archive size={14} className='me-50' />
                                <span className='align-middle'>Edit</span>
                            </DropdownItem>
                            <DropdownItem
                                className='w-100'
                                onClick={() => { handleDelete( row.id ) }}
                            >
                                <Trash2 size={14} className='me-50' />
                                <span className='align-middle'>Delete</span>
                            </DropdownItem>
                            {/* <DropdownItem
                                className='w-100'
                                onClick={() => { handleDetails( row ) }}
                            >
                                <FileText size={14} className='me-50' />
                                <span className='align-middle'>View</span>
                            </DropdownItem> */}
                        </DropdownMenu>
                    </UncontrolledDropdown>
                </div>
            )
        },
        {
            name: 'Requisition Code',
            sortable: true,
            cell: row => row.requisitionCode
        },
        {
            name: 'Status',
            sortable: true,
            cell: row => row.status
        }

    ]
    return columns

}



export const transferColumn = ( handleTransfer ) => {


    const columns = [
        {
            name: 'Actions',
            width: '70px',
            cell: ( row ) => (
                <div className='column-action'>
                    <UncontrolledDropdown disabled={row.itemStatus === "Transfered"}>
                        <DropdownToggle tag='div' className='btn btn-sm'>
                            <MoreVertical size={14} className='cursor-pointer' />
                        </DropdownToggle>
                        <DropdownMenu>
                            <DropdownItem
                                className='w-100'
                                onClick={() => { handleTransfer( row ) }}
                            >
                                <Archive size={14} className='me-50' />
                                <span className='align-middle'>Approve</span>
                            </DropdownItem>
                            {/* <DropdownItem
                                className='w-100'
                                onClick={() => { handleDelete( row.id ) }}
                            >
                                <Trash2 size={14} className='me-50' />
                                <span className='align-middle'>Delete</span>
                            </DropdownItem> */}
                            {/* <DropdownItem
                                className='w-100'
                                onClick={() => { handleDetails( row ) }}
                            >
                                <FileText size={14} className='me-50' />
                                <span className='align-middle'>View</span>
                            </DropdownItem> */}
                        </DropdownMenu>
                    </UncontrolledDropdown>
                </div>
            )
        },
        {
            name: 'Item',
            // sortable: true,
            cell: row => row.description
        },
        {
            name: 'Requisite Code',
            // sortable: true,
            width: "250px",
            cell: row => row.requisitionCode
        },
        {
            name: 'Transfer to ',
            // sortable: true,
            width: "300px",
            cell: row => row.toWarehouse
        },
        {
            name: 'Quantity',
            // sortable: true,
            width: "100px",
            cell: row => row.requisiteQuantity
        },

        {
            name: 'Requisition Date',
            // sortable: true,
            width: "150px",
            cell: row => moment( row.requisitionDate ).format( 'DD-MMM-YY' )

        }

    ]
    return columns

}
export const receiveColumn = ( handleReceive ) => {


    const columns = [
        {
            name: 'Actions',
            width: '70px',
            cell: ( row ) => (
                <div className='column-action'>
                    <UncontrolledDropdown>
                        <DropdownToggle tag='div' className='btn btn-sm'>
                            <MoreVertical size={14} className='cursor-pointer' />
                        </DropdownToggle>
                        <DropdownMenu >
                            <DropdownItem
                                className='w-100'
                                onClick={() => { handleReceive( row ) }}
                            >
                                <Archive size={14} className='me-50' />
                                <span className='align-middle'>Confirm Receive</span>
                            </DropdownItem>
                            {/* <DropdownItem
                                className='w-100'
                                onClick={() => { handleDelete( row.id ) }}
                            >
                                <Trash2 size={14} className='me-50' />
                                <span className='align-middle'>Delete</span>
                            </DropdownItem> */}
                            {/* <DropdownItem
                                className='w-100'
                                onClick={() => { handleDetails( row ) }}
                            >
                                <FileText size={14} className='me-50' />
                                <span className='align-middle'>View</span>
                            </DropdownItem> */}
                        </DropdownMenu>
                    </UncontrolledDropdown>
                </div>
            )
        },
        {
            name: 'Item',
            // sortable: true,
            cell: row => row.description
        },
        {
            name: 'Requisite Code',
            // sortable: true,
            width: "250px",
            cell: row => row.requisitionCode
        },
        {
            name: 'Transfer to ',
            // sortable: true,
            width: "300px",
            cell: row => row.toWarehouse
        },
        {
            name: 'Quantity',
            // sortable: true,
            width: "100px",
            cell: row => row.requisiteQuantity
        },

        {
            name: 'Requisition Date',
            // sortable: true,
            width: "150px",
            cell: row => moment( row.requisitionDate ).format( 'DD-MMM-YY' )

        }

    ]
    return columns

}