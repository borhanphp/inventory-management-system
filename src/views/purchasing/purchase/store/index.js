import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import moment from "moment";
import toast from "react-hot-toast";
import { generalStoreApi } from "../../../../services/api_endpoint";
import { convertQueryString } from "../../../../utility/Utils";
import { initialPurchaseData } from "./model";

export const fetchAllPurchase = createAsyncThunk( "purchase/fetchAllPurchase", async ( params ) => {
    const apiEndPoint = `${generalStoreApi.purchase.root}?${convertQueryString( params )}`;
    const res = await axios.get( apiEndPoint );
    return res.data.purchaseOrders.items;
} )

export const getPurchaseByFilter = createAsyncThunk( "purchase/getPurchaseByFilter", async ( data ) => {
    const apiEndPoint = `${generalStoreApi.purchase.root}/grid`;
    const resData = await axios.post( apiEndPoint, data )
        .then( ( res ) => {
            return res.data.purchaseOrders;
        } )
        .catch( ( err ) => {
            toast.error( err.response.data.detail )
        } )
    return resData;
} )

export const getPurchaseById = createAsyncThunk( 'purchase/getPurchaseById', async ( id ) => {
    const apiEndPoint = `${generalStoreApi.purchase.root}/${id}`;
    const res = await axios.get( apiEndPoint );
    const data = res.data.purchaseOrder;
    const info = {
        ...data,
        supplierId: { label: data.supplierName, value: data.supplierId },
        currencyId: { label: data.currency, value: data.currencyId },
        currencyRate: data.currencyRate,
        payTerm: { label: data.payTerm, value: data.payTerm },
        tradeTerm: { label: data.tradeTerm, value: data.tradeTerm },
        shipmentMode: { label: data.shipmentMode, value: data.shipmentMode },
        receivePoint: { label: data.receivePoint, value: data.receivePoint },
        type: { label: data.type, value: data.type },
        status: { label: data.status, value: data.status },
        date: data.date ? moment( data.date ).format( 'YYYY-MM-DD' ) : null,
        expiryDate: data.expiryDate ? moment( data.expiryDate ).format( 'YYYY-MM-DD' ) : null,
        lastDateOfShipment: data.lastDateOfShipment ? moment( data.lastDateOfShipment ).format( 'YYYY-MM-DD' ) : null,
        items: data.items.map( item => ( {
            ...item,
            uomId: { label: item.uom, value: item.uomId }
        } ) )
    }
    return info;
} )

export const getPoCodeById = createAsyncThunk( 'purchase/getPoCodeById', async ( id ) => {
    const apiEndPoint = `${generalStoreApi.purchase.root}/supplier/${id}`;
    const res = await axios.get( apiEndPoint );
    return res.data.poNo;
} )

export const addNewPurchase = createAsyncThunk( 'purchase/addNewPurchase', async ( data ) => {
    const apiEndPoint = `${generalStoreApi.purchase.root}`;
    const resData = await axios.post( apiEndPoint, data )
        .then( ( res ) => {
            return res.data.purchaseOrder;
        } )
        .catch( ( err ) => {
            toast.error( err.response.data.detail );
            return res.data.purchaseOrder;
        } )
    return resData;
} )

export const updatePurchase = createAsyncThunk( 'purchase/updatePurchase', async ( data ) => {
    const apiEndPoint = `${generalStoreApi.purchase.root}`;
    const resData = await axios.put( apiEndPoint, data )
        .then( ( res ) => {
            return res.data.purchaseOrder;
        } )
        .catch( ( err ) => {
            toast.error( err.response.data.detail );
            return res.data.purchaseOrder;
        } )
    return resData;
} )



const purchaseSlice = createSlice( {
    name: 'purchase',
    initialState: {
        allPurchase: [],
        totalItems: '',
        poCode: 0,
        loading: '',
        purchaseData: initialPurchaseData
    },
    reducers: {
        bindPurchaseInfo: ( state, action ) => {
            if ( action.payload ) {
                state.purchaseData = action.payload;
            } else {
                state.purchaseData = initialPurchaseData;
            }
        }
    },
    extraReducers: ( builder ) => {
        builder
            .addCase( fetchAllPurchase.fulfilled, ( state, action ) => {
                state.allPurchase = action.payload;
            } )
            .addCase( getPurchaseByFilter.fulfilled, ( state, action ) => {
                state.allPurchase = action.payload.items.map( d => ( {
                    ...d,
                    label: d.name,
                    value: d.id
                } ) );
                state.totalItems = action.payload.totalItems;
                state.loading = false;
            } )
            .addCase( getPurchaseByFilter.pending, ( state, action ) => {
                state.loading = true;
            } )
            .addCase( getPurchaseById.fulfilled, ( state, action ) => {
                state.purchaseData = action.payload;
            } )
            .addCase( addNewPurchase.fulfilled, ( state, action ) => {
                state.allPurchase = action.payload;
            } )
            .addCase( updatePurchase.fulfilled, ( state, action ) => {
                state.allPurchase = action.payload;
            } )
            .addCase( getPoCodeById.fulfilled, ( state, action ) => {
                state.poCode = action.payload;
            } )
    }
} )

export const { bindPurchaseInfo } = purchaseSlice.actions;

export default purchaseSlice.reducer