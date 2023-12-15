import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import moment from 'moment';
import toast from 'react-hot-toast';
import { generalStoreApi } from '../../../../services/api_endpoint';
import { initialInstantPurchaseData } from './model';

export const getInstantPurchaseByFilter = createAsyncThunk( "instaPurchase/getInstantPurchaseByFilter", async ( data ) => {
    const apiEndPoint = `${generalStoreApi.instantPurchase.root}/grid`;
    const res = await axios.post( apiEndPoint, data );
    return res.data.instantPurchase;
} )


export const addInstantPurchase = createAsyncThunk( 'instaPurchase/addInstantPurchase', async ( data ) => {
    const apiEndPoint = `${generalStoreApi.instantPurchase.root}`;
    await axios.post( apiEndPoint, data )
        .then( ( res ) => {
            return res.data.purchaseInvoice;
        } )
        .catch( ( err ) => {
            const errorMsg = JSON.parse( err.response.data.detail )
            toast.error( errorMsg[0]?.Message )
            return res.data.purchaseInvoice;
        } )

} )
export const updateInstantPurchase = createAsyncThunk( 'instaPurchase/updateInstantPurchase', async ( data ) => {
    const apiEndPoint = `${generalStoreApi.instantPurchase.root}`;
    await axios.put( apiEndPoint, data )
        .then( ( res ) => {
            return res.data.purchaseInvoice;
        } )
        .catch( ( err ) => {
            const errorMsg = JSON.parse( err.response.data.detail )
            toast.error( errorMsg[0]?.Message )
            return res.data.purchaseInvoice;
        } )

} )

export const getInstantPurchaseById = createAsyncThunk( 'instaPurchase/getInstantPurchaseById', async ( id ) => {
    const apiEndPoint = `${generalStoreApi.instantPurchase.root}/${id}`;
    const res = await axios.get( apiEndPoint );
    const data = res.data.instantPurchase;
    const info = {
        ...data,
        supplierId: { label: data.supplier, value: data.supplierId },
        warehouseId: { label: data.warehouse, value: data.warehouseId },
        date: data.date ? moment( data.date ).format( 'YYYY-MM-DD' ) : null,
    }
    return info;
} )


export const instantPurchaseSlice = createSlice( {
    name: 'instaPurchase',
    initialState: {
        allInstantPurchase: [],
        loading: false,
        totalItems: 0,
        basicInstantPurchaseInfo: initialInstantPurchaseData
    },
    reducers: {
        bindInstantPurchaseData: ( state, action ) => {
            if ( action.payload ) {
                state.basicInstantPurchaseInfo = action.payload;
            } else {
                state.basicInstantPurchaseInfo = initialInstantPurchaseData;
            }
        }
    },
    extraReducers: builder => {
        builder
            .addCase( getInstantPurchaseByFilter.fulfilled, ( state, action ) => {
                state.allInstantPurchase = action.payload.items;
                state.totalItems = action.payload.totalItems;
                state.loading = false;
            } )
            .addCase( addInstantPurchase.fulfilled, ( state, action ) => {
                state.loading = false;
            } )
            .addCase( updateInstantPurchase.fulfilled, ( state, action ) => {
                state.loading = false;
            } )
            .addCase( getInstantPurchaseById.fulfilled, ( state, action ) => {
                state.basicInstantPurchaseInfo = action.payload;
            } )
    }
} );

export const { bindInstantPurchaseData } = instantPurchaseSlice.actions;

export default instantPurchaseSlice.reducer;
