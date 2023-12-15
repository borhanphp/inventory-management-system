import { Archive, MoreVertical } from 'react-feather';
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';


export const buyerColumn = ( handleEdit ) => {
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
                onClick={() => handleEdit( row )}
              >
                <Archive size={14} className='me-50' />
                <span className='align-middle'>Edit</span>
              </DropdownItem>
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
      name: 'Name',
      sortable: true,
      selector: row => row.name
    },
    {
      name: 'Type',
      // sortable: true,
      selector: row => row.type
    },
    {
      name: 'Address',
      // sortable: false,
      selector: row => row.address
    },
    {
      name: 'Code',
      // sortable: false,
      selector: row => row.code
    },
    {
      name: 'Contact No.',
      // sortable: false,
      selector: row => row.contactNo
    },
    {
      name: 'Note',
      // sortable: false,
      selector: row => row.note
    }

  ];

  return columns;

};