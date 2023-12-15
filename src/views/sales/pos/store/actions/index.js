/* eslint-disable no-unused-vars */
import axios from "axios";
import toast from "react-hot-toast";
import { generalStoreApi } from "../../../../../services/api_endpoint";
import { convertQueryString } from "../../../../../utility/Utils";
import { BIND_SALES_INFO, CART_PRODUCT, DECREASE_CART_ITEM_QTY, DELETE_PRODUCT, GET_ALL_SALES, INCREASE_CART_ITEM_QTY } from "../action-types";
import { initialSalesState } from "../model";


export const saveProduct = ( data ) => ( dispatch, getState ) => {
  // const oldItems = JSON.parse( localStorage.getItem( "items" ) );
  const { salesBasicInfo } = getState().posReducer;
  const { items } = salesBasicInfo
  const newData = {
    ...data,
    quantity: 1
  };
  if ( salesBasicInfo?.items ) {
    const existingProduct = salesBasicInfo?.items?.find(
      ( item ) => item.id === data.id
    );
    if ( !existingProduct ) {
      localStorage.setItem( "items", JSON.stringify( [...items, newData] ) );
      // dispatch( bindSalesInfo( { ...salesBasicInfo?.items, newData } ) )
    }
  } else {
    localStorage.setItem( "items", JSON.stringify( [newData] ) );
    // dispatch( bindSalesInfo( { ...salesBasicInfo?.items, items: newData } ) )

  }
};

// export const saveProduct = ( data ) => ( dispatch ) => {
//   const oldItems = JSON.parse( localStorage.getItem( "items" ) ) || [];

//   const existingProductIndex = oldItems.findIndex(
//     ( item ) => item.id === data.id || item.description === data.description
//   );

//   if ( existingProductIndex !== -1 ) {
//     oldItems[existingProductIndex].quantity += 1;
//   } else {
//     oldItems.push( { ...data, quantity: 1 } );
//   }

//   localStorage.setItem( "items", JSON.stringify( oldItems ) );
// };


const getUniqueCartItems = ( cartItems ) => {
  const uniqueItems = [];
  const uniqueItemIds = new Set();

  for ( const item of cartItems ) {
    if ( !uniqueItemIds.has( item?.id ) ) {
      uniqueItemIds.add( item?.id );
      uniqueItems.push( item );
    }
  }

  return uniqueItems;
};

export const cartProduct = () => ( dispatch ) => {
  const storedItems = JSON.parse( localStorage.getItem( "items" ) ) || [];
  const uniqueCartItems = getUniqueCartItems( storedItems );
  dispatch( {
    type: CART_PRODUCT,
    cartItems: uniqueCartItems
  } );
};


export const deleteProduct = ( id ) => ( dispatch, getState ) => {
  // const cartItems = JSON.parse( localStorage.getItem( "items" ) ) || [];
  const { salesBasicInfo } = getState().posReducer;
  const filteredItems = salesBasicInfo?.items?.filter( ( item ) => item.id !== id );

  dispatch( {
    type: DELETE_PRODUCT,
    filteredItems
  } );

  localStorage.setItem( "items", JSON.stringify( filteredItems ) );
};

export const incrementQty = ( itemId ) => ( dispatch ) => {
  dispatch( {
    type: INCREASE_CART_ITEM_QTY,
    itemId
  } );
};
export const decrementQty = ( itemId ) => ( dispatch ) => {
  dispatch( {
    type: DECREASE_CART_ITEM_QTY,
    itemId
  } );
};


// SALES API
export const getAllSalesByQuery = ( params ) => ( dispatch ) => {
  const apiEndpoint = `${generalStoreApi.sales.root}?${convertQueryString( params )}`;
  // loading( true );
  axios.get( apiEndpoint )
    .then( response => {
      if ( response.status === 200 ) {
        dispatch( {
          type: GET_ALL_SALES,
          allData: response?.data?.sales.items,
          totalPages: response?.data.sales.pageSize,
          totalItems: response?.data.sales.totalItems,
          params
        } );
        // loading( false );
      }
    } ).catch( error => {
      console.log( error );
      // loading( false );
    } );
};

export const addNewSales = ( data, getRandomString ) => ( dispatch, getState ) => {
  const apiEndPoint = `${generalStoreApi.sales.root}`;
  // loading( true );
  // setSubmitted( false );
  axios.post( apiEndPoint, data ).then( response => {
    // console.log( response.data.sale )
    if ( response.status === 201 ) {
      getRandomString();
      // handleInvoiceModalOpen( true )
      const resId = response?.data?.sale?.id;
      if ( resId ) {
        console.log( 'called in sales action' );
        dispatch( getSalesById( resId ) )
      }
      localStorage.removeItem( "items" );
      toast.success( 'Successfully added new Sales' )
      dispatch( cartProduct() );

    }
  } ).catch( e => console.log( e ) )
};


export const getSalesById = ( id ) => ( dispatch ) => {

  const apiEndpoint = `${generalStoreApi.sales.root}/${id}`;
  axios.get( apiEndpoint )
    .then( response => {
      if ( response.status === 200 ) {
        const resData = response?.data?.sale;
        const info = {
          ...resData,
          referenceNo: resData.referenceNo,
          items: resData.items.map( item => ( {
            description: item.description,
            salesPrice: item.unitPrice,
            discount: item.discount,
            discountPercentage: item.discountPercentage,
            id: item.id,
            itemId: item.itemId,
            quantity: item.quantity,
            salesId: item.salesId,
            sku: item.sku,
            subtotal: item.subtotal,
            total: item.total,
            unitPrice: item.unitPrice,
            vat: item.vat,
            vatPercentage: item.vatPercentage
          } ) )
        }
        dispatch( {
          type: BIND_SALES_INFO,
          basicInfo: info
        } );
      }
    } ).catch( ( { response } ) => {
      console.log( response );

    } );
};




export const updateSales = ( data, navigate ) => ( dispatch, getState ) => {
  const apiEndPoint = `${generalStoreApi.sales.root}`;
  axios.put( apiEndPoint, data ).then( response => {
    if ( response.status === 201 ) {
      // dispatch( bindSalesInfo( initialCustomerData ) )
      const { params } = getState().posReducer;
      dispatch( getAllSalesByQuery( params ) );
      navigate( '/sales/all-sales' )
      toast.success( 'Successfully Updated' )
    }
  } ).catch( error => console.log( error ) );
};




export const bindSalesInfo = ( basicInfo ) => ( dispatch ) => {
  if ( basicInfo ) {
    dispatch( {
      type: BIND_SALES_INFO,
      basicInfo
    } );
  } else {
    dispatch( {
      type: BIND_SALES_INFO,
      basicInfo: initialSalesState
    } );
  }
};
