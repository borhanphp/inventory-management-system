import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';
import { generalStoreApi } from '../../../../services/api_endpoint';
import { convertQueryString } from '../../../../utility/Utils';
import { initialCurrencyData } from './model';

export const getAllCurrency = createAsyncThunk( 'currency/getAllCurrency', async ( params ) => {
    const apiEndPoint = `${generalStoreApi.currency.root}?${convertQueryString( params )}`;
    const res = await axios.get( apiEndPoint );
    return res.data.currencies;
} )

export const getAllCurrencyByFilter = createAsyncThunk( 'currency/getAllCurrencyByFilter', async ( data ) => {
    const apiEndPoint = `${generalStoreApi.currency.root}/grid`;
    const res = await axios.post( apiEndPoint, data );
    return res.data.currencies;
} )

export const addNewCurrency = createAsyncThunk( 'currency/addNewCurrency', async ( data ) => {
    const apiEndPoint = `${generalStoreApi.currency.root}`;
    await axios.post( apiEndPoint, data )
        .then( ( res ) => {
            return res.data.currency;
        } )
        .catch( ( err ) => {
            toast.error( err.response.data.detail )
            return res.data.currency;
        } )

} )

export const updateCurrency = createAsyncThunk( 'currency/updateCurrency', async ( data ) => {
    const apiEndPoint = `${generalStoreApi.currency.root}`;
    await axios.put( apiEndPoint, data )
        .then( ( res ) => {
            return res.data.currency;
        } )
        .catch( ( err ) => {
            toast.error( err.response.data.detail )
            return res.data.currency;
        } )

} )

export const getCurrencyById = createAsyncThunk( 'currency/getCurrencyById', async ( id ) => {
    const apiEndPoint = `${generalStoreApi.currency.root}/${id}`;
    const res = await axios.get( apiEndPoint );
    const data = res.data.currency;
    return data;
} )



export const currencySlice = createSlice( {
    name: 'currency',
    initialState: {
        allData: [],
        loading: false,
        totalItems: 0,
        error: null,
        currencyBasicInfo: initialCurrencyData
    },
    reducers: {
        bindCurrencyInfo: ( state, action ) => {
            if ( action.payload ) {
                state.currencyBasicInfo = action.payload;
            } else {
                state.currencyBasicInfo = initialCurrencyData;
            }
        }
    },
    extraReducers: builder => {
        builder
            .addCase( addNewCurrency.fulfilled, ( state, action ) => {
                state.loading = false;;
            } )
            .addCase( getAllCurrency.fulfilled, ( state, action ) => {
                state.allData = action.payload.items
                state.totalItems = action.payload.totalItems
            } )
            .addCase( getAllCurrencyByFilter.pending, ( state ) => {
                state.loading = true;
            } )
            .addCase( getAllCurrencyByFilter.rejected, ( state ) => {
                state.loading = false;
            } )
            .addCase( getAllCurrencyByFilter.fulfilled, ( state, action ) => {
                state.allData = action.payload.items;
                state.totalItems = action.payload.totalItems;
                state.loading = false;
            } )
            .addCase( updateCurrency.fulfilled, ( state, action ) => {
                state.loading = false
            } )
            .addCase( getCurrencyById.fulfilled, ( state, action ) => {
                state.currencyBasicInfo = action.payload;
            } )
    }
} );

export const { bindCurrencyInfo } = currencySlice.actions;

export default currencySlice.reducer;