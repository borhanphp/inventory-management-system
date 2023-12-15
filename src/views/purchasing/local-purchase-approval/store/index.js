import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { generalStoreApi } from "../../../../services/api_endpoint";
import { initialLocalApprovalData } from "./model";

export const fetchLocalPurchaseApproval = createAsyncThunk( "localPurchaseApproval/fetchLocalPurchaseApproval", async ( data ) => {
    const apiEndPoint = `${generalStoreApi.localPurchase.root}/approval/${data?.id}`;
    const res = await axios.post( apiEndPoint );
    const resData = res.data.purchaseInvoiceItems;
    // const info = resData?.map( ( item ) => ( {
    //     ...item,
    //     items: item.items.map( ( itemInItems ) => ( {
    //         ...itemInItems,
    //         modifiedEstimatedPrice: itemInItems.previousPurchasePrice,
    //     } ) ),
    // } ) );
    return resData;
} )

export const addNewLocalApproval = createAsyncThunk( "localPurchaseApproval/addNewLocalApproval", async ( data ) => {
    const apiEndPoint = `${generalStoreApi.localPurchase.root}/approve`;
    const res = await axios.put( apiEndPoint, data );
    return res.data;
} )


const localApprovalSlice = createSlice( {
    name: 'localPurchaseApproval',
    initialState: {
        allLocalPurchaseForApproval: [],
        totalItems: '',
        loading: false,
        basicLocalApprovalInfo: initialLocalApprovalData
    },
    reducers: {
        bindLocalApprovalData: ( state, action ) => {
            if ( action.payload ) {
                state.allLocalPurchaseForApproval = action.payload;
            } else {
                state.allLocalPurchaseForApproval = initialLocalApprovalData;

            }
        }
    },
    extraReducers: ( builder ) => {
        builder
            .addCase( fetchLocalPurchaseApproval.fulfilled, ( state, action ) => {
                state.allLocalPurchaseForApproval = action.payload;
            } )
            .addCase( addNewLocalApproval.fulfilled, ( state, action ) => {
                state.loading = false;
            } )
    }
} )

export const { bindLocalApprovalData } = localApprovalSlice.actions
export default localApprovalSlice.reducer