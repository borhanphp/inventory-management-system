import moment from 'moment';

export const initialPurchaseData = {
    name: "",
    date: moment( new Date() ).format( "YYYY-MM-DD" ),
    type: { label: 'Import', value: 'Import' },
    payTerm: "",
    tradeTerm: "",
    supplierId: 0,
    currencyId: 0,
    currencyRate: 0,
    expiryDate: null,
    lastDateOfShipment: null,
    receivePoint: null,
    shipmentMode: { label: 'By Sea', value: 'By_Sea' },
    note: "",
    isDraft: false,
    items: []
};
