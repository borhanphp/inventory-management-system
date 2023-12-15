import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { generalStoreApi } from "../../../../services/api_endpoint";
import { initialApprovalData } from "./model";

export const fetchItemForApproval = createAsyncThunk( "itemapprove/fetchItemForApproval", async ( data ) => {
    const apiEndPoint = `${generalStoreApi.approving.root}/get-received-goods-groups/${data.warehouseId.id}/${data.ciId.id}`;
    const res = await axios.get( apiEndPoint );
    const resData = res.data.goodsReceivings;
    const info = resData?.map( ( item ) => ( {
        ...item,
        items: item.items.map( ( itemInItems ) => ( {
            ...itemInItems,
            modifiedEstimatedPrice: itemInItems.previousPurchasePrice,
        } ) ),
    } ) );
    return resData;
} )

export const addNewApproval = createAsyncThunk( "itemapprove/addNewApproval", async ( data ) => {
    const apiEndPoint = `${generalStoreApi.approving.root}/approve-received-goods`;
    const res = await axios.put( apiEndPoint, data );
    return res.data.goodsReceivings;
} )


const goodsApprovalSlice = createSlice( {
    name: 'itemapprove',
    initialState: {
        allReceiving: [],
        totalItems: '',
        basicApprovalInfo: initialApprovalData
    },
    reducers: {
        bindApprovalData: ( state, action ) => {
            if ( action.payload ) {
                state.allReceiving = action.payload;
            } else {
                state.allReceiving = initialApprovalData;

            }
        }
    },
    extraReducers: ( builder ) => {
        builder
            .addCase( fetchItemForApproval.fulfilled, ( state, action ) => {
                state.allReceiving = action.payload;
            } )
            .addCase( addNewApproval.fulfilled, ( state, action ) => {
                state.allReceiving = [];
            } )
    }
} )

export const { bindApprovalData } = goodsApprovalSlice.actions
export default goodsApprovalSlice.reducer