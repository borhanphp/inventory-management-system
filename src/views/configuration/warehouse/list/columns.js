// ** React Imports
// ** Store & Actions
// import { store } from '@store/store'
// import { getUser, deleteUser } from '../store'
// ** Icons Imports
import { Archive, MoreVertical } from 'react-feather';
// ** Reactstrap Imports
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';


export const warehouseColumn = ( handleEdit ) => {
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
                tag={Link}
                className='w-100'
                to={`#`}
                // onClick={() => store.dispatch(getUser(row.id))}
              >
                <FileText size={14} className='me-50' />
                <span className='align-middle'>Details</span>
              </DropdownItem> */}
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
      name: 'Warehouse Name',
      // selector: row => row.category
      sortable: true,
      cell: row => row.name
    },
    {
      name: 'Short Form',
      // selector: row => row.description
      cell: row => row.shortForm
    },
    {
      name: 'Address',
      // selector: row => row.description
      cell: row => row.address
    },
    {
      name: 'Description',
      // selector: row => row.description
      cell: row => row.note
    },
    {
      name: 'Is Central',
      // selector: row => row.description
      cell: row => {
        if ( row.isCentralWarehouse === true ) {
          return 'Yes';
        } else {
          return 'No';
        }
      }
    }

  ];

  return columns;
};
