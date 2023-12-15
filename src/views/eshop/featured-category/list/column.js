import { Archive, MoreVertical, Trash2 } from "react-feather";
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from "reactstrap";
import { API } from "../../../../services/api_endpoint";


export const featuredCategoryColumn = ( handleAddItems, handleEdit, handleDelete ) => {
    const columns = [
        {
            name: 'Actions',
            isFixed: true,
            width: "60px",
            cell: ( row ) => (
                <div className='column-action'>
                    <UncontrolledDropdown>
                        <DropdownToggle tag='div' className='btn btn-sm'>
                            <MoreVertical size={14} className='cursor-pointer' />
                        </DropdownToggle>
                        <DropdownMenu>
                            <DropdownItem
                                className='w-100'
                                onClick={() => handleAddItems( row )}
                            >
                                <Archive size={14} className='me-50' />
                                <span className='align-middle'>Manage Items</span>
                            </DropdownItem>
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
            name: '',
            sortable: true,
            width: '3%',
            selector: row => row?.imageUrl && <img src={`${API}/${row?.imageUrl?.replace( 'wwwroot/', '' )}`} alt="" style={{ width: "30px", height: "30px" }} />
        },
        {
            name: 'Category Name',
            sortable: true,

            selector: row => row.name
        },
        {
            name: 'Description',
            sortable: false,
            selector: row => row.comments
        }

    ];

    return columns;

};