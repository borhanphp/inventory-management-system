import moment from 'moment';
import { Archive, MoreVertical, Trash2 } from 'react-feather';
// ** Reactstrap Imports
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';


export const tenantsColumn = ( handleEdit, handleDelete ) => {
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
              <DropdownItem
                className='w-100'
                onClick={() => handleDelete( row.id )}
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
      name: 'Tenants Name',
      sortable: true,
      selector: row => row.name
    },
    {
      name: 'Phone Number',
      sortable: true,
      selector: row => row.phoneNumber
    },
    {
      name: 'Email',
      sortable: true,
      selector: row => row.email
    },
    {
      name: 'Subscription Start Date',
      sortable: true,
      selector: row => moment( row.subscriptionStartDate ).format( 'DD-MMM-YYYY' )
    },
    {
      name: 'Subscription End Date',
      sortable: true,
      selector: row => moment( row.subscriptionEndDate ).format( 'DD-MMM-YYYY' )
    },
    {
      name: 'Connection String',
      sortable: true,
      selector: row => row.connectionString
    },
    {
      name: 'Status',
      sortable: true,
      selector: row => row.isActive
    }

  ];

  return columns;

};