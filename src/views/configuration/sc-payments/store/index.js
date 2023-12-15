import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import moment from 'moment';
import toast from 'react-hot-toast';
import { generalStoreApi } from '../../../../services/api_endpoint';
import { initialScPaymentData } from './model';

export const getAllScPaymentByFilter = createAsyncThunk( 'scPayment/getAllScPaymentByFilter', async ( data ) => {
    const apiEndPoint = `${generalStoreApi.scPayments.root}/grid`;
    const res = await axios.post( apiEndPoint, data );
    return res.data.payments;
} )

export const addNewScPayment = createAsyncThunk( 'scPayment/addNewScPayment', async ( data ) => {
    const apiEndPoint = `${generalStoreApi.scPayments.root}`;
    await axios.post( apiEndPoint, data )
        .then( ( res ) => {
            console.log( res )
            return res.data.scPayment;
        } )
        .catch( ( err ) => {
            toast.error( err?.response?.data?.detail );
        } );
} )

export const updateScPayment = createAsyncThunk( 'scPayment/updateScPayment', async ( data ) => {
    const apiEndPoint = `${generalStoreApi.scPayments.root}`;
    await axios.put( apiEndPoint, data )
        .then( ( res ) => {
            return res.data.scPayment;
        } )
        .catch( ( err ) => {

            toast.error( err?.response?.data?.detail );
        } );

} )

export const getScPaymentById = createAsyncThunk( 'scPayment/getScPaymentById', async ( id ) => {
    const apiEndPoint = `${generalStoreApi.scPayments.root}/${id}`;
    const res = await axios.get( apiEndPoint );
    const data = res.data.payment;
    const info = {
        ...data,
        scId: { label: data.scCode, value: data.scId },
        headId: { label: data.paymentHeadName, value: data.headId },
        currencyId: { label: data.currency, value: data.currencyId },
        date: data.date ? moment( data.date ).format( 'YYYY-MM-DD' ) : null
    }
    return info;
} )




export const scPaymentSlice = createSlice( {
    name: 'scPayment',
    initialState: {
        allScPayments: [],
        data: initialScPaymentData,
        loading: false,
        totalItems: 0,
        error: null,
        scPaymentBasicInfo: initialScPaymentData
    },
    reducers: {
        bindScPaymentInfo: ( state, action ) => {
            if ( action.payload ) {
                state.scPaymentBasicInfo = action.payload;
            } else {
                state.scPaymentBasicInfo = initialScPaymentData;
            }
        }
    },
    extraReducers: builder => {
        builder
            .addCase( addNewScPayment.fulfilled, ( state ) => {
                state.loading = false;
            } )
            .addCase( getAllScPaymentByFilter.pending, ( state ) => {
                state.loading = true;
            } )
            .addCase( getAllScPaymentByFilter.rejected, ( state ) => {
                state.loading = false;
            } )
            .addCase( getAllScPaymentByFilter.fulfilled, ( state, action ) => {
                state.allScPayments = action.payload.items;
                state.totalItems = action.payload.totalItems;
                state.loading = false;
            } )
            .addCase( updateScPayment.fulfilled, ( state, action ) => {
                state.loading = false
            } )

            .addCase( getScPaymentById.fulfilled, ( state, action ) => {
                state.scPaymentBasicInfo = action.payload;
            } )
    }
} );

export const { bindScPaymentInfo } = scPaymentSlice.actions;

export default scPaymentSlice.reducer;