import moment from 'moment';
import { FileText, MoreVertical } from 'react-feather';
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';

export const ordersColumn = ( handleDetails ) => {

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
                            </DropdownItem>
                            <DropdownItem
                                className='w-100'
                                onClick={() => { handleDelete( row.id ) }}
                            >
                                <FileText size={14} className='me-50' />
                                <span className='align-middle'>Delete</span>
                            </DropdownItem> */}
                            <DropdownItem
                                className='w-100'
                                onClick={() => { handleDetails( row.id ) }}
                            >
                                <FileText size={14} className='me-50' />
                                <span className='align-middle'>Manage Order</span>
                            </DropdownItem>
                        </DropdownMenu>
                    </UncontrolledDropdown>
                </div>
            )
        },
        {
            name: 'Order Number',
            sortable: true,
            // width: '30%',
            cell: row => row.orderNo
        },
        {
            name: 'Customer',
            sortable: true,
            // width: '8%',
            cell: row => row.username
        },
        {
            name: 'Order Date',
            // width: "120px",
            cell: row => moment( row.orderDate ).format( 'DD-MMM-YY' )
        },
        {
            name: 'Total Amount',
            // width: "120px",
            cell: row => row.totalAmount
        },
        {
            name: 'Payment Type',
            // width: "120px",
            cell: row => row.payments
        },
        {
            name: 'Status',
            // width: "120px",
            cell: row => row.orderStatus
        },

    ]
    return columns

}