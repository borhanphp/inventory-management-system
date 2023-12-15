import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import moment from 'moment';
import toast from 'react-hot-toast';
import { generalStoreApi } from '../../../../services/api_endpoint';
import { initialScAdjustmentData } from './model';

export const getAllScAdjustmentByFilter = createAsyncThunk( 'scAdjustment/getAllScAdjustmentByFilter', async ( data ) => {
    const apiEndPoint = `${generalStoreApi.scAdjustments.root}/grid`;
    const res = await axios.post( apiEndPoint, data );
    return res.data.adjustments;
} )

export const getScByIdForAdjustment = createAsyncThunk( 'scAdjustment/getScByIdForAdjustment', async ( id ) => {
    const apiEndPoint = `${generalStoreApi.scAdjustments.root}/sales-contract/${id}`;
    const res = await axios.get( apiEndPoint );
    const data = res.data.data;
    const info = {
        ...data,
        currencyId: { label: data.currency, value: data.currencyId }
    }
    return info;
} )

export const addNewScAdjustment = createAsyncThunk( 'scAdjustment/addNewScAdjustment', async ( data ) => {
    const apiEndPoint = `${generalStoreApi.scAdjustments.root}`;
    await axios.post( apiEndPoint, data )
        .then( ( res ) => {
            return res.data.adjustment;
        } )
        .catch( ( err ) => {
            const resMsg = JSON.parse( err?.response?.data?.detail );
            toast.error( resMsg[0]?.Message );
            return res.data.adjustment;
        } );
} )

export const updateScAdjustment = createAsyncThunk( 'scAdjustment/updateScAdjustment', async ( data ) => {
    const apiEndPoint = `${generalStoreApi.scAdjustments.root}`;
    await axios.put( apiEndPoint, data )
        .then( ( res ) => {
            return res.data.adjustment;
        } )
        .catch( ( err ) => {
            const resMsg = JSON.parse( err?.response?.data?.detail );
            toast.error( resMsg[0]?.Message );
            return res.data.adjustment;
        } );

} )

export const getScAdjustmentById = createAsyncThunk( 'scAdjustment/getScAdjustmentById', async ( id ) => {
    const apiEndPoint = `${generalStoreApi.scAdjustments.root}/${id}`;
    const res = await axios.get( apiEndPoint );
    const data = res.data.adjustment;
    const info = {
        ...data,
        salesContractId: { label: data.scCode, value: data.scId },
        headId: { label: data.costingHeadName, value: data.headId },
        currencyId: { label: data.currency, value: data.currencyId },
        avgCurrencyRate: data.averageCurrencyRate,
        date: data.date ? moment( data.date ).format( 'YYYY-MM-DD' ) : null,
        dueAmount: data.due
    }
    console.log( 'info', info )
    return info;
} )




export const scAdjustmentSlice = createSlice( {
    name: 'scAdjustment',
    initialState: {
        allScAdjustments: [],
        data: initialScAdjustmentData,
        loading: false,
        totalItems: 0,
        error: null,
        scData: {},
        scAdjustmentBasicInfo: initialScAdjustmentData
    },
    reducers: {
        bindScAdjustmentInfo: ( state, action ) => {
            if ( action.payload ) {
                state.scAdjustmentBasicInfo = action.payload;
            } else {
                state.scAdjustmentBasicInfo = initialScAdjustmentData;
            }
        }
    },
    extraReducers: builder => {
        builder
            .addCase( addNewScAdjustment.fulfilled, ( state ) => {
                state.loading = false;
            } )
            .addCase( getAllScAdjustmentByFilter.pending, ( state ) => {
                state.loading = true;
            } )
            .addCase( getAllScAdjustmentByFilter.rejected, ( state ) => {
                state.loading = false;
            } )
            .addCase( getAllScAdjustmentByFilter.fulfilled, ( state, action ) => {
                state.allScAdjustments = action.payload.items;
                state.totalItems = action.payload.totalItems;
                state.loading = false;
            } )
            .addCase( updateScAdjustment.fulfilled, ( state, action ) => {
                state.loading = false
            } )
            .addCase( getScAdjustmentById.fulfilled, ( state, action ) => {
                state.scAdjustmentBasicInfo = action.payload;
            } )
            .addCase( getScByIdForAdjustment.fulfilled, ( state, action ) => {
                state.scData = action.payload;
            } )
    }
} );

export const { bindScAdjustmentInfo } = scAdjustmentSlice.actions;

export default scAdjustmentSlice.reducer;