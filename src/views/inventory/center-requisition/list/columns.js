import { FileText, MoreVertical, Trash2 } from 'react-feather';
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';


export const requisitionColumn = ( handleDelete, handleApprove ) => {


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
                            {/* <DropdownItem
                                className='w-100'
                                onClick={() => { handleEdit( row ) }}
                            >
                                <Archive size={14} className='me-50' />
                                <span className='align-middle'>Edit</span>
                            </DropdownItem> */}
                            <DropdownItem
                                className='w-100'
                                onClick={() => { handleApprove( row.id ) }}
                            >
                                <FileText size={14} className='me-50' />
                                <span className='align-middle'>Manage</span>
                            </DropdownItem>
                            <DropdownItem
                                className='w-100'
                                onClick={() => { handleDelete( row.id ) }}
                            >
                                <Trash2 size={14} className='me-50' />
                                <span className='align-middle'>Delete</span>
                            </DropdownItem>

                        </DropdownMenu>
                        {/* <DropdownItem
                                className='w-100'
                                onClick={() => { handleDetails( row ) }}
                            >
                                <FileText size={14} className='me-50' />
                                <span className='align-middle'>View</span>
                            </DropdownItem>
                        </DropdownMenu> */}
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
            name: 'Requisition Date',
            sortable: true,
            cell: row => row.stringRequisitionDate
        },
        {
            name: 'Status',
            sortable: true,
            cell: row => row.status
        },
        {
            name: 'Note',
            sortable: true,
            cell: row => row.note
        }

    ]
    return columns

}