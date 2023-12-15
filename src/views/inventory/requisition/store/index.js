import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { generalStoreApi } from "../../../../services/api_endpoint";
import { initialRequisitionData } from "./model";


// requisition apis
export const fetchAllRequisition = createAsyncThunk( "requisition/fetchAllRequisition", async ( data ) => {
    const apiEndPoint = `${generalStoreApi.requisition.root}/grid`;
    const res = await axios.post( apiEndPoint, data );
    return res.data.requisitions;
} )


export const getRequisitionById = createAsyncThunk( 'requisition/getRequisitionById', async ( id ) => {
    const apiEndPoint = `${generalStoreApi.requisition.root}/${id}`;
    const res = await axios.get( apiEndPoint );
    console.log( 'requist from action', res )
    return res.data.requisition;
} )

export const deleteRequisition = createAsyncThunk( 'requisition/deleteRequisition', async ( id ) => {
    const apiEndPoint = `${generalStoreApi.requisition.root}/${id}`;
    const res = await axios.delete( apiEndPoint );
    return res.data.requisition;
} )

export const addNewRequisition = createAsyncThunk( 'requisition/addNewRequisition', async ( data ) => {
    const apiEndPoint = `${generalStoreApi.requisition.root}`;
    const res = await axios.post( apiEndPoint, data );
    return res.data.requisition;
} )


export const updateRequisition = createAsyncThunk( 'requisition/updateRequisition', async ( data, { dispatch, getState } ) => {
    const apiEndPoint = `${generalStoreApi.requisition.root}`;
    const res = await axios.put( apiEndPoint, data );
    const { params } = getState().purchase.allPurchase;
    dispatch( fetchAllPurchase( params ) )
    return res.data.purchaseOrder.items;
} )


//  warehouse transfer apis
export const fetchAllItemsForTransfer = createAsyncThunk( "requisition/fetchAllItemsForTransfer", async ( data ) => {
    const apiEndPoint = `${generalStoreApi.warehouseTransfer.root}/item-transferer/grid`;
    const res = await axios.post( apiEndPoint, data );
    return res.data.items;
} )


export const transferItem = createAsyncThunk( 'requisition/transferItem', async ( data ) => {
    const apiEndPoint = `${generalStoreApi.warehouseTransfer.root}/transfer`;
    await axios.put( apiEndPoint, data )
        .then( ( res ) => {
            return res.data.item;
        } )
        .catch( err => {
            console.log( err );
            return res.data.item;
        } )

} )


//  warehouse receive apis
export const fetchAllItemsForReceive = createAsyncThunk( "requisition/fetchAllItemsForReceive", async ( data ) => {
    const apiEndPoint = `${generalStoreApi.warehouseTransfer.root}/item-receiver/grid`;
    const res = await axios.post( apiEndPoint, data );
    return res.data.items;
} )


export const receiveItem = createAsyncThunk( 'requisition/receiveItem', async ( data ) => {
    const apiEndPoint = `${generalStoreApi.warehouseTransfer.root}/receive`;
    await axios.put( apiEndPoint, data )
        .then( ( res ) => {
            return res.data.item;
        } )
        .catch( err => {
            console.log( err );
            return res.data.item;
        } )

} )


const requisitionSlice = createSlice( {
    name: 'requisition',
    initialState: {
        allRequisition: [],
        transferItems: [],
        receiveItems: [],
        totalItems: '',
        loading: false,
        requisitionData: initialRequisitionData
    },
    reducers: {
        bindRequisitionInfo: ( state, action ) => {
            if ( action.payload ) {
                state.requisitionData = action.payload;
            } else {
                state.requisitionData = initialRequisitionData;
            }
        }
    },
    extraReducers: ( builder ) => {
        builder
            .addCase( fetchAllRequisition.fulfilled, ( state, action ) => {
                state.allRequisition = action.payload.items;
                state.totalItems = action.payload.totalItems;
            } )
            .addCase( fetchAllItemsForTransfer.fulfilled, ( state, action ) => {
                state.transferItems = action.payload.items;
                state.totalItems = action.payload.totalItems;
            } )
            .addCase( fetchAllItemsForReceive.fulfilled, ( state, action ) => {
                state.receiveItems = action.payload.items;
                state.totalItems = action.payload.totalItems;
            } )
            .addCase( getRequisitionById.fulfilled, ( state, action ) => {
                state.requisitionData = action.payload;
            } )
            .addCase( deleteRequisition.fulfilled, ( state, action ) => {
                state.requisitionData = action.payload;
            } )
            .addCase( addNewRequisition.fulfilled, ( state, action ) => {
                state.allRequisition = action.payload;
            } )
            .addCase( updateRequisition.fulfilled, ( state, action ) => {
                state.allRequisition = action.payload;
            } )
            .addCase( transferItem.fulfilled, ( state ) => {
                state.loading = false;
            } )
            .addCase( receiveItem.fulfilled, ( state ) => {
                state.loading = false;
            } )
    }
} )

export const { bindRequisitionInfo } = requisitionSlice.actions;

export default requisitionSlice.reducer