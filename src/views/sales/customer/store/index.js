import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';
import { generalStoreApi } from '../../../../services/api_endpoint';
import { initialCustomerData } from './model';


export const getCustomerByFilter = createAsyncThunk( 'customer/getCustomerByFilter', async ( data ) => {
    const apiEndPoint = `${generalStoreApi.customer.root}/grid`;
    const res = await axios.post( apiEndPoint, data );
    return res.data.customers;
} )

export const addNewCustomer = createAsyncThunk( 'customer/addNewCustomer', async ( data ) => {
    const apiEndPoint = `${generalStoreApi.customer.root}`;
    await axios.post( apiEndPoint, data )
        .then( ( res ) => {
            return res.data.contact;
        } )
        .catch( ( err ) => {
            toast.error( err?.response?.data?.detail );
            return res.data.contact;
        } );
} )

export const updateCustomer = createAsyncThunk( 'customer/updateCustomer', async ( data ) => {
    const apiEndPoint = `${generalStoreApi.customer.root}`;
    await axios.put( apiEndPoint, data )
        .then( ( res ) => {
            return res.data.contact;
        } )
        .catch( ( err ) => {
            toast.error( err?.response?.data?.detail );
            return res.data.contact;
        } );
} )

export const getCustomerById = createAsyncThunk( 'customer/getCustomerById', async ( id ) => {
    const apiEndPoint = `${generalStoreApi.customer.root}/${id}`;
    const res = await axios.get( apiEndPoint );
    const data = res.data.contacts;
    const info = {
        ...data,
        contactType: { label: data.contactType, value: data.contactType },
        businessType: { label: data.businessType, value: data.businessType },
        paymentTerm: { label: data.paymentTerm, value: data.paymentTerm },
        zoneId: { label: data.zoneName, value: data.zoneId },
        contactPersonOneName: data.contactPersonOneName,
        contactPersonOneMobileNo: data.contactPersonOneMobileNo,
        contactPersonTwoName: data.contactPersonTwoName,
        contactPersonTwoMobileNo: data.contactPersonTwoMobileNo,
    }
    return info;
} )



export const customerSlice = createSlice( {
    name: 'customer',
    initialState: {
        allData: [],
        loading: false,
        totalItems: 0,
        error: null,
        customerBasicInfo: initialCustomerData
    },
    reducers: {
        bindCustomerInfo: ( state, action ) => {
            if ( action.payload ) {
                state.customerBasicInfo = action.payload;
            } else {
                state.customerBasicInfo = initialCustomerData;
            }
        }
    },
    extraReducers: builder => {
        builder
            .addCase( getCustomerByFilter.pending, ( state ) => {
                state.loading = true;
            } )
            .addCase( getCustomerByFilter.rejected, ( state ) => {
                state.loading = false;
            } )
            .addCase( getCustomerByFilter.fulfilled, ( state, action ) => {
                state.allData = action.payload.items;
                state.totalItems = action.payload.totalItems;
                state.loading = false;
            } )
            .addCase( addNewCustomer.fulfilled, ( state, action ) => {
                state.allData.push( action.payload );
            } )
            .addCase( getCustomerById.fulfilled, ( state, action ) => {
                state.customerBasicInfo = action.payload;
            } )
            .addCase( updateCustomer.fulfilled, ( state, action ) => {
                state.allData.push( action.payload );
            } )

    }
} );

export const { bindCustomerInfo } = customerSlice.actions;

export default customerSlice.reducer;