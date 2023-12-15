import moment from 'moment';
import { Archive, FilePlus, FileText, MoreVertical, Trash2 } from 'react-feather';
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';


export const scLcColumn = ( handleDetails, handleDelete, handleEdit, handleCreateReport ) => {


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
                                <Trash2 size={14} className='me-50' />
                                <span className='align-middle'>Delete</span>
                            </DropdownItem>
                            <DropdownItem
                                className='w-100'
                                onClick={() => { handleCreateReport( row ) }}
                            >
                                <FilePlus size={14} className='me-50' />
                                <span className='align-middle'>Generate Reports</span>
                            </DropdownItem>
                        </DropdownMenu>
                    </UncontrolledDropdown>
                </div>
            )
        },
        {
            name: 'PI Number',
            cell: row => row.piCode
        },
        {
            name: 'SC Number',
            // sortable: true,
            cell: row => row.salesContractCode
        },
        {
            name: 'Supplier',
            cell: row => row.seller
        },
        {
            name: 'Buyer',
            cell: row => row.buyerName
        },
        {
            name: 'PI Date',
            cell: row => moment( row.date ).format( 'DD-MMM-YY' )
        },
        {
            name: 'Total Value',
            cell: row => row.totalAmount
        },
        {
            name: 'Currency',
            cell: row => row.currency
        }

    ]
    return columns

}