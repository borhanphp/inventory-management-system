import moment from 'moment';
export const initialInstantPurchaseData = {
    supplierId: null,
    warehouseId: null,
    date: moment( new Date() ).format( "YYYY-MM-DD" ),
    note: "",
    items: []
};
