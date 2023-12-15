import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import moment from "moment";
import toast from "react-hot-toast";
import { generalStoreApi } from "../../../../services/api_endpoint";
import { initialLocalPurchaseData } from "./model";

export const getLocalPurchaseByFilter = createAsyncThunk( "localPurchase/getLocalPurchaseByFilter", async ( data ) => {
    const apiEndPoint = `${generalStoreApi.localPurchase.root}/grid`;
    const res = await axios.post( apiEndPoint, data );
    return res.data.purchaseInvoices;
} )

export const getLocalPurchaseById = createAsyncThunk( 'localPurchase/getLocalPurchaseById', async ( id ) => {
    const apiEndPoint = `${generalStoreApi.localPurchase.root}/${id}`;
    const res = await axios.get( apiEndPoint );
    const data = res.data.purchaseInvoice;
    const info = {
        ...data,
        poId: { label: data.poCode, value: data.poId },
        supplierId: { label: data.supplier, value: data.supplierId },
        invoiceType: { label: data.invoiceType, value: data.invoiceType },
        supplierInvoiceDate: data.supplierInvoiceDate ? moment( data.supplierInvoiceDate ).format( 'YYYY-MM-DD' ) : null,
    }
    return info;
} )

export const addNewLocalPurchase = createAsyncThunk( 'localPurchase/addNewLocalPurchase', async ( data ) => {
    const apiEndPoint = `${generalStoreApi.localPurchase.root}`;
    await axios.post( apiEndPoint, data )
        .then( ( res ) => {
            return res.data.purchaseInvoice;
        } )
        .catch( ( err ) => {
            toast.error( err.response.data.detail );
            return res.data.purchaseInvoice;
        } )

} )

export const updateLocalPurchase = createAsyncThunk( 'localPurchase/updateLocalPurchase', async ( data ) => {
    const apiEndPoint = `${generalStoreApi.localPurchase.root}`;
    await axios.put( apiEndPoint, data )
        .then( ( res ) => {
            return res.data.purchaseInvoice;
        } )
        .catch( ( err ) => {
            toast.error( err.response.data.detail );
            return res.data.purchaseInvoice;
        } )
} )
export const deleteLocalPurchase = createAsyncThunk( 'localPurchase/deleteLocalPurchase', async ( id ) => {
    const apiEndPoint = `${generalStoreApi.localPurchase.root}/${id}`;
    await axios.delete( apiEndPoint )
        .then( ( res ) => {
            toast.success( 'Successfully Deleted' );
        } )
        .catch( ( err ) => {
            toast.error( err.response.data.detail );
            return res.data.purchaseInvoice;
        } )
} )


const localPurchaseSlice = createSlice( {
    name: 'localPurchase',
    initialState: {
        allLocalPurchase: [],
        totalItems: '',
        loading: false,
        basicLocalPurchaseData: initialLocalPurchaseData
    },
    reducers: {
        bindLocalPurchaseInfo: ( state, action ) => {
            if ( action.payload ) {
                state.basicLocalPurchaseData = action.payload;
            } else {
                state.basicLocalPurchaseData = initialLocalPurchaseData;
            }
        }
    },
    extraReducers: ( builder ) => {
        builder
            .addCase( getLocalPurchaseByFilter.fulfilled, ( state, action ) => {
                state.allLocalPurchase = action.payload.items.map( d => ( {
                    ...d,
                    label: d.poCode,
                    value: d.id
                } ) );
                state.totalItems = action.payload.totalItems;
                state.loading = false;
            } )
            .addCase( getLocalPurchaseByFilter.pending, ( state, action ) => {
                state.loading = true;
            } )
            .addCase( getLocalPurchaseById.fulfilled, ( state, action ) => {
                state.basicLocalPurchaseData = action.payload;
            } )
            .addCase( addNewLocalPurchase.fulfilled, ( state, action ) => {
                state.allLocalPurchase = action.payload;
            } )
            .addCase( updateLocalPurchase.fulfilled, ( state, action ) => {
                state.allLocalPurchase = action.payload;
            } )
            .addCase( deleteLocalPurchase.fulfilled, ( state ) => {
                state.loading = false;
            } )
    }
} )

export const { bindLocalPurchaseInfo } = localPurchaseSlice.actions;

export default localPurchaseSlice.reducer