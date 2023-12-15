// ** React Imports
// ** Store & Actions
// import { store } from '@store/store'
// import { getUser, deleteUser } from '../store'
// ** Icons Imports
import { Archive, FileText, MoreVertical } from 'react-feather'
// ** Reactstrap Imports
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap'




export const unitColumn = ( handleEdit, handleUnitAssign ) => {
  const columns = [
    {
      name: 'Actions',
      width: '70px',
      cell: row => (
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

              <DropdownItem
                // tag={Link}
                // className='w-100'
                // to={`#`}
                onClick={() => handleUnitAssign( row )}
              >
                <FileText size={14} className='me-50' />
                <span className='align-middle'>Units</span>
              </DropdownItem>

              {/* <DropdownItem
                tag='a'
                href='#'
                className='w-100'
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
      name: 'Unit Set',
      sortable: true,
      selector: row => row.name
    },
    {
      name: 'Description',
      selector: row => row.note
    }

  ]

  return columns
}