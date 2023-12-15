import moment from 'moment';
export const initialInstantSaleData = {
    supplierId: null,
    warehouseId: null,
    date: moment( new Date() ).format( "YYYY-MM-DD" ),
    note: "",
    items: []
};
