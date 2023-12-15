import moment from 'moment';
import { Archive, FileText, MoreVertical } from 'react-feather';
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';

export const offeredItemColumn = ( handleEdit, handleDelete ) => {

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
                                <FileText size={14} className='me-50' />
                                <span className='align-middle'>Delete</span>
                            </DropdownItem>
                        </DropdownMenu>
                    </UncontrolledDropdown>
                </div>
            )
        },
        {
            name: 'Item',
            sortable: true,
            width: '30%',
            cell: row => row.description
        },
        {
            name: 'Offered Price',
            sortable: true,
            // width: '8%',
            cell: row => row.offeredPrice
        },
        {
            name: 'Start Date',
            // width: "120px",
            cell: row => moment( row.startDate ).format( 'DD-MMM-YY' )
        },
        {
            name: 'End Date',
            // width: "120px",
            cell: row => moment( row.endDate ).format( 'DD-MMM-YY' )
        }
    ]
    return columns

}