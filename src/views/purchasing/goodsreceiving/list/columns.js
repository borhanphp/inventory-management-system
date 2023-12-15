import moment from 'moment';
import { Archive, FileText, MoreVertical, Trash2 } from 'react-feather';
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';


export const receivingColumn = ( handleEdit, handleDetails, handleDelete ) => {


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
                        </DropdownMenu>
                    </UncontrolledDropdown>
                </div>
            )
        },
        {
            name: 'MRR Code',
            sortable: true,
            width: '30%',
            cell: row => row.name
        },
        {
            name: 'Receiving Date',
            sortable: true,
            // width: '8%',
            cell: row => moment( row.date ).format( 'DD-MMM-YY' )
        },

        {
            name: 'Warehouse',
            // width: "120px",
            cell: row => row.warehouse
        },


        {
            name: 'Note',
            // width: "100px",
            // width: '5%',
            cell: row => row.note
        }

    ]
    return columns

}