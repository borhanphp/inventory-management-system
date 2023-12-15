import {
    BIND_SALES_INFO,
    DECREASE_CART_ITEM_QTY,
    GET_ALL_SALES,
    INCREASE_CART_ITEM_QTY
} from "../action-types";
import { initialSalesState } from "../model";

const initialState = {
    allData: [],
    total: 0,
    params: {},
    totalItems: 0,
    salesBasicInfo: initialSalesState
}

const posReducer = ( state = initialState, action ) => {

    switch ( action.type ) {

        case GET_ALL_SALES:
            return {
                ...state,
                allData: action.allData,
                total: action.totalPages,
                totalItems: action.totalItems,
                params: action.params,
            };

        case BIND_SALES_INFO:
            return {
                ...state,
                salesBasicInfo: action.basicInfo
            };

        case INCREASE_CART_ITEM_QTY:
            const updatedCartItems = state.salesBasicInfo?.items?.map( item => {
                if ( item.id === action.itemId ) {
                    return {
                        ...item,
                        quantity: Math.min( Math.max( 1, item.quantity + 1 ), item.stock )
                    };
                }
                return item;
            } );

            return {
                ...state,
                salesBasicInfo: {
                    ...state.salesBasicInfo,
                    items: updatedCartItems
                }
            };

        case DECREASE_CART_ITEM_QTY:
            const decreasedCartItems = state.salesBasicInfo?.items?.map( item => {
                if ( item.id === action.itemId ) {
                    return {
                        ...item,
                        quantity: Math.max( 1, item.quantity - 1 )
                    };
                }
                return item;
            } );

            return {
                ...state,
                salesBasicInfo: {
                    ...state.salesBasicInfo,
                    items: decreasedCartItems
                }
            };

        default:
            return state
    }
}

export default posReducer
