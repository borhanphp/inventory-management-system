import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import moment from 'moment';
import toast from 'react-hot-toast';
import { generalStoreApi } from '../../../../services/api_endpoint';
import { initialInstantSaleData } from './model';

export const getInstantSaleByFilter = createAsyncThunk( "instaSale/getInstantSaleByFilter", async ( data ) => {
    const apiEndPoint = `${generalStoreApi.instantSale.root}/grid`;
    const res = await axios.post( apiEndPoint, data );
    return res.data.instantSales;
} )


export const addInstantSale = createAsyncThunk( 'instaSale/addInstantSale', async ( data ) => {
    const apiEndPoint = `${generalStoreApi.instantSale.root}`;
    await axios.post( apiEndPoint, data )
        .then( ( res ) => {
            return res.data.instantSalesReturn;
        } )
        .catch( ( err ) => {
            const errorMsg = JSON.parse( err.response.data.detail )
            toast.error( errorMsg[0]?.Message )
            return res.data.instantSalesReturn;
        } )

} )
export const updateInstantSale = createAsyncThunk( 'instaSale/updateInstantSale', async ( data ) => {
    const apiEndPoint = `${generalStoreApi.instantSale.root}`;
    await axios.put( apiEndPoint, data )
        .then( ( res ) => {
            return res.data.saleInvoice;
        } )
        .catch( ( err ) => {
            const errorMsg = JSON.parse( err.response.data.detail )
            toast.error( errorMsg[0]?.Message )
            return res.data.saleInvoice;
        } )

} )

export const getInstantSaleById = createAsyncThunk( 'instaSale/getInstantSaleById', async ( id ) => {
    const apiEndPoint = `${generalStoreApi.instantSale.root}/${id}`;
    const res = await axios.get( apiEndPoint );
    const data = res.data.instantSales;
    const info = {
        ...data,
        customerId: { label: data.customer, value: data.customerId },
        warehouseId: { label: data.warehouse, value: data.warehouseId },
        date: data.date ? moment( data.date ).format( 'YYYY-MM-DD' ) : null,
    }
    return info;
} )


export const instantSaleSlice = createSlice( {
    name: 'instaSale',
    initialState: {
        allInstantSale: [],
        loading: false,
        totalItems: 0,
        basicInstantSaleInfo: initialInstantSaleData
    },
    reducers: {
        bindInstantSaleData: ( state, action ) => {
            if ( action.payload ) {
                state.basicInstantSaleInfo = action.payload;
            } else {
                state.basicInstantSaleInfo = initialInstantSaleData;
            }
        }
    },
    extraReducers: builder => {
        builder
            .addCase( getInstantSaleByFilter.fulfilled, ( state, action ) => {
                state.allInstantSale = action.payload.items;
                state.totalItems = action.payload.totalItems;
                state.loading = false;
            } )
            .addCase( addInstantSale.fulfilled, ( state, action ) => {
                state.loading = false;
            } )
            .addCase( updateInstantSale.fulfilled, ( state, action ) => {
                state.loading = false;
            } )
            .addCase( getInstantSaleById.fulfilled, ( state, action ) => {
                state.basicInstantSaleInfo = action.payload;
            } )
    }
} );

export const { bindInstantSaleData } = instantSaleSlice.actions;

export default instantSaleSlice.reducer;
