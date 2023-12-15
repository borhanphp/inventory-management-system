import moment from 'moment';
import { Archive, FileText, MoreVertical } from 'react-feather';
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';


export const purchaseColumn = ( handleReturn, handleDetails ) => {

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
                                onClick={() => { handleReturn( row ) }}
                            >
                                <Archive size={14} className='me-50' />
                                <span className='align-middle'>Return</span>
                            </DropdownItem>
                            {/* <DropdownItem
                                className='w-100'
                                onClick={() => { handleDelete( row.id ) }}
                            >
                                <Trash2 size={14} className='me-50' />
                                <span className='align-middle'>Delete</span>
                            </DropdownItem> */}
                            <DropdownItem
                                className='w-100'
                                onClick={() => { handleDetails( row ) }}
                            >
                                <FileText size={14} className='me-50' />
                                <span className='align-middle'>View</span>
                            </DropdownItem>
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
            name: 'Invoice Number',
            sortable: true,
            width: '30%',
            cell: row => row.invoice
        },
        {
            name: 'Purchase Date',
            // sortable: true,
            // width: '8%',
            cell: row => moment( row.date ).format( 'DD-MMM-YY' )
        },

        {
            name: 'Supplier',
            // width: "120px",
            cell: row => row.supplier
        },
        {
            name: 'Warehouse',
            // width: "120px",
            cell: row => row.warehouse
        }

    ]
    return columns

}