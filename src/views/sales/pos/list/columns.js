// ** React Imports
// ** Store & Actions
// import { store } from '@store/store'
// import { getUser, deleteUser } from '../store'
// ** Icons Imports
import moment from 'moment';
import { FileText, MoreVertical } from 'react-feather';
// ** Reactstrap Imports
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';

export const salesColumn = ( handleDelete, handleDetails ) => {
    const columns = [
        {
            name: 'Actions',
            width: '60px',
            cell: ( row ) => (
                <div className='column-action'>
                    <UncontrolledDropdown>
                        <DropdownToggle tag='div' className='btn btn-sm'>
                            <MoreVertical size={14} className='cursor-pointer' />
                        </DropdownToggle>
                        <DropdownMenu>
                            <DropdownItem
                                className='w-100'
                                onClick={() => handleDetails( row )}
                            >
                                <FileText size={14} className='me-50' />
                                <span className='align-middle'>Invoice</span>
                            </DropdownItem>
                            {/* <DropdownItem
                                className='w-100'
                                onClick={() => handleEdit( row )}
                            >
                                <Archive size={14} className='me-50' />
                                <span className='align-middle'>Void</span>
                            </DropdownItem> */}
                            {/* <DropdownItem
                                className='w-100'
                                onClick={() => handleDelete( row.id )}
                            >
                                <Trash2 size={14} className='me-50' />
                                <span className='align-middle'>Delete</span>
                            </DropdownItem> */}
                        </DropdownMenu>
                    </UncontrolledDropdown>
                </div>
            )
        },
        {
            name: 'Date',
            // selector: row => row.category
            cell: row => moment( row.referenceDate ).format( 'YYYY-MMM-DD' )
        },
        {
            name: 'Reference No.',
            // selector: row => row.category
            cell: row => row.referenceNo
        },

        {
            name: 'Customer Name',
            // selector: row => row.description
            cell: row => row.customerName
        },
        {
            name: 'Contact',
            // selector: row => row.item_prefix
            cell: row => row.email
        },
        {
            name: 'Location',
            // selector: row => row.costing_method
            cell: row => row.division
        },


        {
            name: 'Total Amount',
            // selector: row => row.consumption_uom
            cell: row => row.total
        },

        {
            name: 'Total Items',
            // selector: row => row.sub_category
            cell: row => row?.items?.length
        },

        {
            name: 'Note',
            // selector: row => row.sub_category
            cell: row => row.note
        }

    ];

    return columns;
};
