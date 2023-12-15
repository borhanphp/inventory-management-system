import {
  CART_PRODUCT, DELETE_PRODUCT,
  GET_ALL_PRODUCTS,
  GET_ALL_SALES
} from "../action-types";
import { initialSalesState } from "../model";

const initialState = {
  products: [],
  cartItems: [],
  cartQty: '',
  allData: [],
  total: 0,
  params: {},
  totalItems: 0,
  itemSalesInfo: initialSalesState
}

const productReducer = ( state = initialState, action ) => {
  switch ( action.type ) {
    case GET_ALL_SALES:
      return {
        ...state,
        allData: action.allData,
        total: action.totalPages,
        totalItems: action.totalItems,
        params: action.params,
      };

    case GET_ALL_PRODUCTS:
      return {
        ...state,
        products: action.products
      }
    case CART_PRODUCT:
      return {
        ...state,
        cartItems: action.cartItems
      }
    case DELETE_PRODUCT:
      return {
        ...state,
        cartItems: action.filteredItems
      }

    // case INCREASE_CART_ITEM_QTY:
    //   const updatedCartItems = state.cartItems.map( item => {
    //     if ( item.id === action.itemId ) {
    //       return {
    //         ...item,
    //         quantity: item.quantity + 1
    //       }
    //     }
    //     return item
    //   } )
    //   return {
    //     ...state,
    //     cartItems: updatedCartItems
    //   }

    // case DECREASE_CART_ITEM_QTY:
    //   const decreaseCartItems = state.cartItems.map( item => {
    //     if ( item.id === action.itemId ) {
    //       return {
    //         ...item,
    //         quantity: item.quantity - 1
    //       }
    //     }
    //     return item
    //   } )
    //   return {
    //     ...state,
    //     cartItems: decreaseCartItems
    //   }


    default:
      return state
  }
}

export default productReducer
