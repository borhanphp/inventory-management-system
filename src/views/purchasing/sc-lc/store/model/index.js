import moment from "moment";

export const initialScData = {
    poId: null,
    salesContractCode: "",
    salesContractDate: moment( new Date() ).format( "YYYY-MM-DD" ),
    buyerId: 0,
    consigneeId: 0,
    consigneeCommission: 0,
    buyerBankId: 0,
    sellerBankId: 0,
    subTotalAmount: 0,
    discountPercentage: 0,
    discountedAmount: 0,
    totalAmount: 0,
    lastDateOfShipment: "",
    loadingPortDestination: "",
    insurance: "",
    termsPayment: null,
    isDraft: false,
    note: "",
    currencyId: 0,
    currencyRate: 0,
    items: []
};
