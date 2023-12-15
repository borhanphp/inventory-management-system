import { Archive, FileText, MoreVertical } from 'react-feather';
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';


export const itemColumn = ( handleDetails, handleEdit ) => {

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
                onClick={() => { handleDetails( row ) }}
              >
                <FileText size={14} className='me-50' />
                <span className='align-middle'>Details</span>
              </DropdownItem>
              <DropdownItem
                className='w-100'
                onClick={() => { handleEdit( row ) }}
              >
                <Archive size={14} className='me-50' />
                <span className='align-middle'>Edit</span>
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </div>
      )
    },
    {
      name: 'Item',
      sortable: true,
      width: '30%',
      cell: row => row.description
    },
    {
      name: 'Purchase Price',
      sortable: true,
      // width: '8%',
      cell: row => row.purchasePrice
    },
    {
      name: 'Selling Price',
      sortable: true,
      // width: '8%',
      cell: row => row.salesPrice
    },
    {
      name: 'Category',
      // width: "120px",
      cell: row => row.category
    },
    // {
    //   name: 'Category',
    //   // width: "120px",
    //   cell: row => {
    //     const category = categoryDataCm?.find( cat => cat.id === row.categoryId );
    //     return category ? category.name : '';
    //   }
    // },
    {
      name: 'Brand',
      // width: "120px",
      cell: row => row.brand
    },
    // {
    //   name: 'Brand',
    //   // width: "120px",
    //   cell: row => {
    //     const brand = brandDataCm?.find( br => br.id === row.brandId );
    //     return brand ? brand.name : '';
    //   }
    // },
    {
      name: 'HS Code',
      // width: "100px",
      // width: '5%',
      cell: row => row.hsCode
    },
    {
      name: 'Stock',
      // width: "100px",
      // width: '5%',
      cell: row => row.stock
    },
    // {
    //   name: 'SKU',
    //   // width: "100px",
    //   cell: row => row.sku
    // },
    {
      name: 'Discount',
      // width: "100px",
      cell: row => row.applicableDiscount
    }

  ]
  return columns

}