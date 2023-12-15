import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';
import { generalStoreApi } from '../../../../services/api_endpoint';
import { initialSupplierData } from './model';


export const getSupplierByFilter = createAsyncThunk( 'supplier/getSupplierByFilter', async ( data ) => {
    const apiEndPoint = `${generalStoreApi.supplier.root}/grid`;
    const res = await axios.post( apiEndPoint, data );
    return res.data.suppliers;
} )

export const addNewSupplier = createAsyncThunk( 'supplier/addNewSupplier', async ( data ) => {
    const apiEndPoint = `${generalStoreApi.supplier.root}`;
    await axios.post( apiEndPoint, data )
        .then( ( res ) => {
            return res.data.contact;
        } )
        .catch( ( err ) => {
            toast.error( err?.response?.data?.detail );
            return res.data.contact;
        } );
} )

export const updateSupplier = createAsyncThunk( 'supplier/updateSupplier', async ( data ) => {
    const apiEndPoint = `${generalStoreApi.supplier.root}`;
    await axios.put( apiEndPoint, data )
        .then( ( res ) => {
            return res.data.contact;
        } )
        .catch( ( err ) => {
            toast.error( err?.response?.data?.detail );
            return res.data.contact;
        } );


} )

export const getSupplierById = createAsyncThunk( 'supplier/getSupplierById', async ( id ) => {
    const apiEndPoint = `${generalStoreApi.supplier.root}/${id}`;
    const res = await axios.get( apiEndPoint );
    const data = res.data.contacts;
    const info = {
        ...data,
        contactType: { label: data.contactType, value: data.contactType },
        countryId: { label: data.countryName, value: data.countryId },
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




export const supplierSlice = createSlice( {
    name: 'supplier',
    initialState: {
        allData: [],
        loading: false,
        totalItems: 0,
        error: null,
        supplierBasicInfo: initialSupplierData
    },
    reducers: {
        bindSupplierInfo: ( state, action ) => {
            if ( action.payload ) {
                state.supplierBasicInfo = action.payload;
            } else {
                state.supplierBasicInfo = initialSupplierData;
            }
        }
    },
    extraReducers: builder => {
        builder
            .addCase( getSupplierByFilter.pending, ( state ) => {
                state.loading = true;
            } )
            .addCase( getSupplierByFilter.rejected, ( state ) => {
                state.loading = false;
            } )
            .addCase( getSupplierByFilter.fulfilled, ( state, action ) => {
                state.allData = action.payload.items;
                state.totalItems = action.payload.totalItems;
                state.loading = false;
            } )
            .addCase( addNewSupplier.fulfilled, ( state, action ) => {
                state.allData.push( action.payload );
            } )
            .addCase( getSupplierById.fulfilled, ( state, action ) => {
                state.supplierBasicInfo = action.payload;
            } )
            .addCase( updateSupplier.fulfilled, ( state, action ) => {
                state.allData.push( action.payload );
            } )

    }
} );

export const { bindSupplierInfo } = supplierSlice.actions;

export default supplierSlice.reducer;