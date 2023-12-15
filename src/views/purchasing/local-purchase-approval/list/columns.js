import moment from 'moment';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Badge } from 'reactstrap';
import { getAllCurrencyCm, getAllSupplierCm } from '../../../../redux/common/store';


export const itemApprovalColumn = ( handleApproval ) => {

    const dispatch = useDispatch()

    useEffect( () => {
        dispatch( getAllCurrencyCm() );
    }, [dispatch] )

    useEffect( () => {
        dispatch( getAllSupplierCm() );
    }, [dispatch] )

    const columns = [

        {
            name: 'Item',
            sortable: true,
            width: '40%',
            cell: row => row.description
        },

        {
            name: 'Receiving Date',
            sortable: true,
            // width: '8%',
            cell: row => moment( row.receivingDate ).format( 'DD-MMM-YY' )
        },
        {
            name: 'Quantity',
            sortable: true,
            // width: '30%',
            cell: row => row.quantity
        },
        {
            name: 'Status',
            sortable: true,
            // width: '30%',
            cell: row => row.isApproved === true ?
                <Badge color="success">
                    Approved
                </Badge> :
                <Badge color="primary">
                    Pending
                </Badge>
        }


    ]
    return columns

}