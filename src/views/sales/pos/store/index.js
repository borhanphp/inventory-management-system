import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';
import { generalStoreApi } from '../../../../services/api_endpoint';
import { initialInstantPurchaseData } from '../../../purchasing/instant-purchase/store/model';

export const addInstantPurchase = createAsyncThunk( 'pos/addInstantPurchase', async ( data ) => {
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

export const posSlice = createSlice( {
    name: 'pos',
    initialState: {
        data: [],
        loading: false,
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
            .addCase( addInstantPurchase.fulfilled, ( state, action ) => {
                state.loading = false;
            } )
    }
} );

export const { bindInstantPurchaseData } = posSlice.actions;

export default posSlice.reducer;
