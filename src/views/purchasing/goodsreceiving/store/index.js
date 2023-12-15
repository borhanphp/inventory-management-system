import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import moment from 'moment';
import toast from "react-hot-toast";
import { generalStoreApi } from "../../../../services/api_endpoint";
import { initialReceivingData } from "./model";

export const fetchAllReceivings = createAsyncThunk( "purchase/fetchAllReceivings", async ( data ) => {
    const apiEndPoint = `${generalStoreApi.receivings.root}/grid`;
    const res = await axios.post( apiEndPoint, data );
    return res.data.goodsReceivings;
} )

export const getReceivingById = createAsyncThunk( 'receiving/getReceivingById', async ( id ) => {
    const apiEndPoint = `${generalStoreApi.receivings.root}/${id}`;
    const res = await axios.get( apiEndPoint );
    const data = res.data.goodsReceiving;
    const info = {
        ...data,
        warehouseId: { label: data.warehouse, value: data.warehouseId },
        ciId: { label: data.ciNumber, value: data.ciId },
        date: moment( data.date ).format( 'YYYY-MM-DD' )
    }
    return info;
} )

export const addNewReceiving = createAsyncThunk( 'receiving/addNewReceiving', async ( data ) => {
    const apiEndPoint = `${generalStoreApi.receivings.root}`;
    await axios.post( apiEndPoint, data )
        .then( ( res ) => {
            return res.data.goodsReceiving;
        } )
        .catch( ( err ) => {
            toast.error( err.response.data.detail );
            return res.data.goodsReceiving;
        } )
} )

export const updateReceiving = createAsyncThunk( 'receiving/updateReceiving', async ( data ) => {
    const apiEndPoint = `${generalStoreApi.receivings.root}`;
    await axios.put( apiEndPoint, data )
        .then( ( res ) => {
            return res.data.goodsReceiving;
        } )
        .catch( ( err ) => {
            toast.error( err.response.data.detail );
            return res.data.goodsReceiving;
        } )
} )

export const deleteMrr = createAsyncThunk( 'receiving/deleteMrr', async ( id ) => {
    const apiEndPoint = `${generalStoreApi.receivings.root}/mrr/${id}`;
    await axios.delete( apiEndPoint )
        .then( ( res ) => {
            toast.success( 'MRR data deleted' )
        } )
        .catch( ( err ) => {
            toast.error( err.response.data.detail );
        } )
} )


export const mrrItemDelete = createAsyncThunk( 'receiving/mrrItemDelete', async ( id ) => {
    const apiEndPoint = `${generalStoreApi.receivings.root}/mrr/${id}`;
    await axios.delete( apiEndPoint )
        .then( ( res ) => {
            toast.success( 'MRR data deleted' )
        } )
        .catch( ( err ) => {
            toast.error( err.response.data.detail );
        } )
} )

export const getMrrCode = createAsyncThunk( 'receiving/getMrrCode', async ( data ) => {
    const apiEndPoint = `${generalStoreApi.receivings.root}/mrr-no/${data?.warehouseId}/${data?.ciId}`;
    const res = await axios.get( apiEndPoint );
    return res.data.mrrNo;
} )

export const getItemsByCi = createAsyncThunk( 'receiving/getItemsByCi', async ( ciId ) => {
    const apiEndPoint = `${generalStoreApi.receivings.root}/ci-sc-items/${ciId}`;
    const res = await axios.get( apiEndPoint );
    return res.data.goods;
} )

const receivingSlice = createSlice( {
    name: 'receiving',
    initialState: {
        allReceiving: [],
        mrrCode: 0,
        ciItems: [],
        totalItems: '',
        loading: false,
        receivingData: initialReceivingData
    },
    reducers: {
        bindReceivingInfo: ( state, action ) => {
            if ( action.payload ) {
                state.receivingData = action.payload;
            } else {
                state.receivingData = initialReceivingData;
            }
        }
    },
    extraReducers: ( builder ) => {
        builder
            .addCase( fetchAllReceivings.fulfilled, ( state, action ) => {
                state.allReceiving = action.payload.items;
                state.totalItems = action.payload.totalItems;
            } )
            .addCase( getReceivingById.fulfilled, ( state, action ) => {
                state.receivingData = action.payload;
            } )
            .addCase( addNewReceiving.fulfilled, ( state, action ) => {
                state.allReceiving = action.payload;
            } )
            .addCase( updateReceiving.fulfilled, ( state, action ) => {
                state.allReceiving = action.payload;
            } )
            .addCase( getMrrCode.fulfilled, ( state, action ) => {
                state.mrrCode = action.payload;
            } )
            .addCase( getItemsByCi.fulfilled, ( state, action ) => {
                state.ciItems = action.payload;
            } )
            .addCase( deleteMrr.fulfilled, ( state ) => {
                state.loading = false;
            } )
    }
} )

export const { bindReceivingInfo } = receivingSlice.actions;

export default receivingSlice.reducer