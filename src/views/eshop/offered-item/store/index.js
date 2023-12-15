import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import moment from 'moment';
import toast from "react-hot-toast";
import { eshop, generalStoreApi } from "../../../../services/api_endpoint";
import { initialOfferedData } from "./model";

export const getAllOfferedItems = createAsyncThunk( "offeredItems/getAllOfferedItems", async ( data ) => {
    const apiEndPoint = `${eshop.offeredItems.root}/grid`;
    const res = await axios.post( apiEndPoint, data );
    return res.data.items.items;
} )

export const addOfferedItem = createAsyncThunk( "offeredItems/addOfferedItem", async ( data ) => {
    const apiEndPoint = `${eshop.offeredItems.root}`;
    await axios.post( apiEndPoint, data )
        .then( ( res ) => {
            return res.data.item;
        } )
        .catch( ( err ) => {
            toast.error( err.response.data.detail )
            return res.data.item;
        } )
} )

export const updateOfferedItem = createAsyncThunk( "offeredItems/updateOfferedItem", async ( data ) => {
    const apiEndPoint = `${eshop.offeredItems.root}`;
    await axios.put( apiEndPoint, data )
        .then( ( res ) => {
            return res.data.item;
        } )
        .catch( ( err ) => {
            toast.error( err.response.data.detail )
            return res.data.item;
        } )
    return res;
} )
export const deleteOfferedItem = createAsyncThunk( "offeredItems/updateOfferedItem", async ( id ) => {
    const apiEndPoint = `${eshop.offeredItems.root}/${id}`;
    await axios.delete( apiEndPoint )
        .then( ( res ) => {
            return res;
        } )
        .catch( ( err ) => {
            toast.error( err.response.data.detail )
            return res;
        } )
} )

export const getOfferedItemById = createAsyncThunk( 'offeredItems/getOfferedItemById', async ( id ) => {
    const apiEndPoint = `${eshop.offeredItems.root}/${id}`;
    const res = await axios.get( apiEndPoint );
    const data = await res.data.item;
    const apiEndPointForItem = `${generalStoreApi.items.root}/${data?.itemId}`;
    const getItem = await axios.get( apiEndPointForItem );
    const info = {
        ...data,
        itemId: { label: data.description, value: data.itemId, salesPrice: getItem.data.items.salesPrice },
        stringStartDate: moment( data.startDate ).format( 'YYYY-MM-DD' ),
        stringEndDate: moment( data.endDate ).format( 'YYYY-MM-DD' )
    }
    return info;
} )



const offeredItemSlice = createSlice( {
    name: 'offeredItems',
    initialState: {
        offeredItems: [],
        totalItems: 0,
        loading: false,
        error: '',
        offeredItemsBasicInfo: initialOfferedData
    },
    reducers: {
        bindOfferedItemInfo: ( state, action ) => {
            if ( action.payload ) {
                state.offeredItemsBasicInfo = action.payload;
            } else {
                state.offeredItemsBasicInfo = initialOfferedData;
            }
        }
    },
    extraReducers: ( builder ) => {
        builder
            .addCase( getAllOfferedItems.pending, ( state ) => {
                state.loading = true;
            } )
            .addCase( getAllOfferedItems.fulfilled, ( state, action ) => {
                state.offeredItems = action.payload;
                state.loading = false;
            } )
            .addCase( addOfferedItem.fulfilled, ( state, action ) => {
                state.loading = false;
                state.error = action.payload;
            } )
            .addCase( addOfferedItem.rejected, ( state ) => {
                state.loading = false;
            } )
            .addCase( updateOfferedItem.fulfilled, ( state ) => {
                state.loading = false;
            } )
            .addCase( getOfferedItemById.fulfilled, ( state, action ) => {
                state.offeredItemsBasicInfo = action.payload;
            } )
    }
} )

export const { bindOfferedItemInfo } = offeredItemSlice.actions;
export default offeredItemSlice.reducer