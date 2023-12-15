import { Archive, MoreVertical } from 'react-feather';
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';


export const scPaymentColumn = ( handleEdit ) => {
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
    // {
    //   name: 'SC Payment',
    //   sortable: true,
    //   selector: row => row.paymentHeadName
    // },
    {
      name: 'SC Number',
      sortable: true,
      selector: row => row.scCode
    },
    {
      name: 'Currency',
      // sortable: false,
      selector: row => row.currency
    },
    {
      name: 'Currency Rate',
      // sortable: false,
      selector: row => row.currencyRate
    },

    {
      name: 'Amount',
      // sortable: false,
      selector: row => row.amount
    },
    {
      name: 'Note',
      // sortable: false,
      selector: row => row.note
    }

  ];

  return columns;

};