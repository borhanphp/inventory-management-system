import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';
import { generalStoreApi } from '../../../../services/api_endpoint';
import { convertQueryString } from '../../../../utility/Utils';
import { initialBankData } from './model';

export const getAllBank = createAsyncThunk( 'bank/getAllBank', async ( params ) => {
    const apiEndPoint = `${generalStoreApi.banks.root}?${convertQueryString( params )}`;
    const res = await axios.get( apiEndPoint );
    return res.data.banks;
} )

export const getAllBankByFilter = createAsyncThunk( 'bank/getAllBankByFilter', async ( data ) => {
    const apiEndPoint = `${generalStoreApi.banks.root}/grid`;
    const res = await axios.post( apiEndPoint, data );
    return res.data.banks;
} )

export const addNewBank = createAsyncThunk( 'bank/addNewBank', async ( data ) => {
    const apiEndPoint = `${generalStoreApi.banks.root}`;
    await axios.post( apiEndPoint, data )
        .then( ( res ) => {
            return res.data.bank;
        } )
        .catch( ( err ) => {
            toast.error( err?.response?.data?.detail );
            return res;
        } );
} )

export const updateBank = createAsyncThunk( 'bank/updateBank', async ( data ) => {
    const apiEndPoint = `${generalStoreApi.banks.root}`;
    await axios.put( apiEndPoint, data )
        .then( ( res ) => {
            return res.data.bank;
        } )
        .catch( ( err ) => {

            toast.error( err?.response?.data?.detail );
        } );

} )

export const getBankById = createAsyncThunk( 'bank/getBankById', async ( id ) => {
    const apiEndPoint = `${generalStoreApi.banks.root}/${id}`;
    const res = await axios.get( apiEndPoint );
    const data = res.data.bank;
    const info = {
        ...data,
        countryOfOrigin: { label: data.countryOfOriginName, value: data.countryOfOrigin }
    }
    return info;
} )




export const banksSlice = createSlice( {
    name: 'bank',
    initialState: {
        allData: [],
        data: initialBankData,
        loading: false,
        totalItems: 0,
        error: null,
        bankBasicInfo: initialBankData
    },
    reducers: {
        bindBankInfo: ( state, action ) => {
            if ( action.payload ) {
                state.bankBasicInfo = action.payload;
            } else {
                state.bankBasicInfo = initialBankData;
            }
        }
    },
    extraReducers: builder => {
        builder
            .addCase( addNewBank.fulfilled, ( state ) => {
                state.loading = false;
            } )
            .addCase( getAllBank.fulfilled, ( state, action ) => {
                state.allData = action.payload.items
                state.totalItems = action.payload.totalItems
            } )
            .addCase( getAllBankByFilter.pending, ( state ) => {
                state.loading = true;
            } )
            .addCase( getAllBankByFilter.rejected, ( state ) => {
                state.loading = false;
            } )
            .addCase( getAllBankByFilter.fulfilled, ( state, action ) => {
                state.allData = action.payload.items;
                state.totalItems = action.payload.totalItems;
                state.loading = false;
            } )
            .addCase( updateBank.fulfilled, ( state, action ) => {
                state.loading = false
            } )

            .addCase( getBankById.fulfilled, ( state, action ) => {
                state.bankBasicInfo = action.payload;
            } )
    }
} );

export const { bindBankInfo } = banksSlice.actions;

export default banksSlice.reducer;