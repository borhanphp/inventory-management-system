// ** React Imports
// ** Store & Actions
// import { store } from '@store/store'
// import { getUser, deleteUser } from '../store'
// ** Icons Imports
import { Archive, MoreVertical } from 'react-feather';
// ** Reactstrap Imports
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';


export const customerColumn = ( handleEdit ) => {
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
              {/* <DropdownItem
                className='w-100'
                onClick={() => handlePay( row )}
              >
                <DollarSign size={14} className='me-50' />
                <span className='align-middle'>Pay</span>
              </DropdownItem>
              <DropdownItem
                className='w-100'
                onClick={() => handleDetails( row )}
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
      name: 'Name',
      // selector: row => row.item_prefix
      cell: row => row.name
    },
    {
      name: 'Mobile',
      // selector: row => row.sub_category
      cell: row => row.mobileNo
    },
    {
      name: 'Email',
      // selector: row => row.costing_method
      cell: row => row.email
    },
    {
      name: 'Business Type',
      // selector: row => row.description
      cell: row => row.businessType
    },
    {
      name: 'Payment Term',
      // selector: row => row.order_uom
      cell: row => row.paymentTerm
    },

    {
      name: 'Address',
      // selector: row => row.sub_category
      cell: row => row.addressLine
    },


  ];

  return columns;
};
