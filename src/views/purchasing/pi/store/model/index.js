import moment from 'moment';

export const initialPiData = {
    scId: null,
    piCode: "",
    piDate: moment( new Date() ).format( "YYYY-MM-DD" ),
    buyerId: null,
    sellerBankId: null,
    totalAmount: 0,
    from: "",
    to: "",
    latestShipmentDate: "",
    shipment: "",
    insurance: "",
    payTerm: null,
    isDraft: false,
    note: "",
    currencyId: 0,
    currencyRate: 0,
    groups: []
};
