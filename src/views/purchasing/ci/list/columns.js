import moment from 'moment';
import { Archive, MoreVertical } from 'react-feather';
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';


export const ciColumn = ( handleEdit ) => {


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
                            {/* <DropdownItem
                                className='w-100'
                                onClick={() => { handleCreateSC( row ) }}
                            >
                                <FileText size={14} className='me-50' />
                                <span className='align-middle'>Create SC</span>
                            </DropdownItem> */}
                        </DropdownMenu>
                    </UncontrolledDropdown>
                </div>
            )
        },
        {
            name: 'CI Number',
            sortable: true,
            cell: row => row.ciCode
        },
        {
            name: 'Customs Reference',
            cell: row => row.customsReference
        },
        {
            name: 'CI Date',
            cell: row => moment( row.ciDate ).format( 'DD-MMM-YY' )
        }

    ]
    return columns

}