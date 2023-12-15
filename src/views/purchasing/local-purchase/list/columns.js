import moment from 'moment';
import { Archive, Delete, FileText, MoreVertical } from 'react-feather';
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';


export const localPurchaseColumn = ( handleEdit, handleDetails, handleDelete ) => {


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
                                onClick={() => { handleDetails( row ) }}
                            >
                                <FileText size={14} className='me-50' />
                                <span className='align-middle'>View</span>
                            </DropdownItem>
                            <DropdownItem
                                className='w-100'
                                onClick={() => { handleDelete( row.id ) }}
                            >
                                <Delete size={14} className='me-50' />
                                <span className='align-middle'>Delete</span>
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
                                onClick={() => { handleCreateSC( row ) }}
                            >
                                <FilePlus size={14} className='me-50' />
                                <span className='align-middle'>Create SC</span>
                            </DropdownItem> */}
                        </DropdownMenu>
                    </UncontrolledDropdown>
                </div>
            )
        },
        {
            name: 'Purchase Invoice',
            sortable: true,
            width: '30%',
            cell: row => row.invoiceCode
        },
        {
            name: 'PO Number',
            sortable: true,
            width: '30%',
            cell: row => row.poCode
        },
        {
            name: 'Invoice Date',
            // sortable: true,
            // width: '8%',
            cell: row => moment( row.invoiceDate ).format( 'DD-MMM-YY' )
        },
        {
            name: 'Note',
            // width: "120px",
            cell: row => row.note
        }

    ]
    return columns

}