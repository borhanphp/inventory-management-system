import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { eshop } from "../../../../services/api_endpoint";

export const getAllOrdersItems = createAsyncThunk( "orders/getAllOrdersItems", async ( data ) => {
    const apiEndPoint = `${eshop.ordersItems.root}/grid`;
    const res = await axios.post( apiEndPoint, data );
    console.log( 'from orders action', res.data.orders.totalItems )
    return res.data.orders;
} )

export const getOrderById = createAsyncThunk( "orders/getOrderById", async ( id ) => {
    const apiEndPoint = `${eshop.ordersItems.root}/${id}`;
    const res = await axios.get( apiEndPoint );
    return res.data.order;
} )



const ordersSlice = createSlice( {
    name: 'orders',
    initialState: {
        ordersItems: [],
        totalItems: 0,
        loading: false,
        error: '',
        orderInfo: {}
    },
    reducers: {},
    extraReducers: ( builder ) => {
        builder
            .addCase( getAllOrdersItems.pending, ( state ) => {
                state.loading = true;
            } )
            .addCase( getAllOrdersItems.rejected, ( state ) => {
                state.loading = false;
            } )
            .addCase( getAllOrdersItems.fulfilled, ( state, action ) => {
                state.totalItems = action.payload.totalItems;
                state.ordersItems = action.payload.items;
                state.loading = false;
            } )
            .addCase( getOrderById.fulfilled, ( state, action ) => {
                state.orderInfo = action.payload;
            } )
    }
} )

export default ordersSlice.reducer