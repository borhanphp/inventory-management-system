import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';
import { generalStoreApi } from '../../../../services/api_endpoint';
import { initialBuyerData } from './model';

export const getAllBuyerByFilter = createAsyncThunk( 'buyer/getAllBuyerByFilter', async ( data ) => {
    const apiEndPoint = `${generalStoreApi.buyers.root}/grid`;
    const res = await axios.post( apiEndPoint, data );
    return res.data.data;
} )

export const addNewBuyer = createAsyncThunk( 'buyer/addNewBuyer', async ( data ) => {
    const apiEndPoint = `${generalStoreApi.buyers.root}`;
    await axios.post( apiEndPoint, data )
        .then( ( res ) => {
            console.log( res )
            return res.data.buyer;
        } )
        .catch( ( err ) => {
            toast.error( err?.response?.data?.detail );
        } );
} )

export const updateBuyer = createAsyncThunk( 'buyer/updateBuyer', async ( data ) => {
    const apiEndPoint = `${generalStoreApi.buyers.root}`;
    await axios.put( apiEndPoint, data )
        .then( ( res ) => {
            return res.data.buyer;
        } )
        .catch( ( err ) => {

            toast.error( err?.response?.data?.detail );
        } );

} )

export const getBuyerById = createAsyncThunk( 'buyer/getBuyerById', async ( id ) => {
    const apiEndPoint = `${generalStoreApi.buyers.root}/${id}`;
    const res = await axios.get( apiEndPoint );
    const data = res.data.data;
    const info = {
        ...data,
        type: { label: data.type, value: data.type }
    }
    return info;
} )




export const buyersSlice = createSlice( {
    name: 'buyer',
    initialState: {
        allData: [],
        data: initialBuyerData,
        loading: false,
        totalItems: 0,
        error: null,
        buyerBasicInfo: initialBuyerData
    },
    reducers: {
        bindBuyerInfo: ( state, action ) => {
            if ( action.payload ) {
                state.buyerBasicInfo = action.payload;
            } else {
                state.buyerBasicInfo = initialBuyerData;
            }
        }
    },
    extraReducers: builder => {
        builder
            .addCase( addNewBuyer.fulfilled, ( state ) => {
                state.loading = false;
            } )
            .addCase( getAllBuyerByFilter.pending, ( state ) => {
                state.loading = true;
            } )
            .addCase( getAllBuyerByFilter.rejected, ( state ) => {
                state.loading = false;
            } )
            .addCase( getAllBuyerByFilter.fulfilled, ( state, action ) => {
                state.allData = action.payload.items;
                state.totalItems = action.payload.totalItems;
                state.loading = false;
            } )
            .addCase( updateBuyer.fulfilled, ( state, action ) => {
                state.loading = false
            } )

            .addCase( getBuyerById.fulfilled, ( state, action ) => {
                state.buyerBasicInfo = action.payload;
            } )
    }
} );

export const { bindBuyerInfo } = buyersSlice.actions;

export default buyersSlice.reducer;