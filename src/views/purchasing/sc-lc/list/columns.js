import moment from 'moment';
import { AlignJustify, Archive, FilePlus, FileText, MoreVertical, Send } from 'react-feather';
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';


export const scLcColumn = ( handleDetails, handleEdit, handleCreatePI, PIDetails, handleCreateReport ) => {


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
                            <DropdownItem
                                className='w-100'
                                onClick={() => { handleDetails( row ) }}
                            >
                                <FileText size={14} className='me-50' />
                                <span className='align-middle'>View</span>
                            </DropdownItem>
                            <DropdownItem
                                className='w-100'
                                onClick={() => { handleCreatePI( row ) }}
                            >
                                <Send size={14} className='me-50' />
                                <span className='align-middle'>Create PI (Proforma Invoice)</span>
                            </DropdownItem>
                            <DropdownItem
                                className='w-100'
                                onClick={() => { PIDetails( row ) }}
                            >
                                <AlignJustify size={14} className='me-50' />
                                <span className='align-middle'>PI</span>
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
            name: 'SC Number',
            sortable: true,
            cell: row => row.salesContractCode
        },
        {
            name: 'Supplier',
            cell: row => row.supplier
        },
        {
            name: 'Buyer',
            cell: row => row.buyerName
        },
        {
            name: 'PO Date',
            cell: row => moment( row.poDate ).format( 'DD-MMM-YY' )
        },
        {
            name: 'Total Value',
            cell: row => row.totalAmount
        },


    ]
    return columns

}