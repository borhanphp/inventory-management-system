import moment from 'moment';
import { useEffect } from 'react';
import { Archive, FilePlus, FileText, MoreVertical } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import { getAllCurrencyCm, getAllSupplierCm } from '../../../../redux/common/store';


export const purchaseColumn = ( handleEdit, handleDetails, handleCreateReport ) => {
    const { currencyDataCm, supplierDataCm } = useSelector( ( { commons } ) => commons );
    const dispatch = useDispatch()

    useEffect( () => {
        dispatch( getAllCurrencyCm() );
    }, [dispatch] )

    useEffect( () => {
        dispatch( getAllSupplierCm() );
    }, [dispatch] )

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
            name: 'PO Number',
            sortable: true,
            width: '30%',
            cell: row => row.name
        },
        {
            name: 'PO Date',
            // sortable: true,
            // width: '8%',
            cell: row => moment( row.date ).format( 'DD-MMM-YY' )
        },

        {
            name: 'Supplier',
            // width: "120px",
            cell: row => {
                const supplier = supplierDataCm?.find( sup => sup.id === row.supplierId );
                return supplier ? supplier.name : '';
            }
        },
        {
            name: 'Currency',
            // width: "120px",
            cell: row => {
                const currency = currencyDataCm?.find( cur => cur.id === row.currencyId );
                return currency ? currency.name : '';
            }
        },
        {
            name: 'Total Value',
            // width: "120px",
            cell: row => row.totalPice
        }

    ]
    return columns

}