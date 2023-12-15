import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { generalStoreApi } from "../../../../services/api_endpoint";
import { initialCentralRequisitionData } from "./model";

export const getAllCentralRequisition = createAsyncThunk( "centralRequisition/getAllCentralRequisition", async ( data ) => {
    const apiEndPoint = `${generalStoreApi.requisition.root}/central/grid`;
    const res = await axios.post( apiEndPoint, data );
    return res.data.requisitions.items;
} )

export const getCentralRequisitionById = createAsyncThunk( "centralRequisition/getCentralRequisitionById", async ( id ) => {
    const apiEndPoint = `${generalStoreApi.requisition.root}/central/${id}`;
    const res = await axios.get( apiEndPoint );
    return res.data.requisition;
} )

export const approveRequisition = createAsyncThunk( "centralRequisition/approveRequisition", async ( data ) => {
    const apiEndPoint = `${generalStoreApi.requisition.root}/central/approve`;
    await axios.put( apiEndPoint, data )
        .then( ( res ) => {
            return res.data.requisition;
        } )
        .catch( err => {
            toast.error( err.response.data.detail )
            return res.data.requisition;
        } )

} )
export const declineRequisition = createAsyncThunk( "centralRequisition/declineRequisition", async ( data ) => {
    const apiEndPoint = `${generalStoreApi.requisition.root}/central/decline`;
    const res = await axios.put( apiEndPoint, data );
    return res.data.requisition;
} )



const centralRequisitionSlice = createSlice( {
    name: 'centralRequisition',
    initialState: {
        allCentralRequisition: [],
        totalItems: '',
        loading: false,
        centralRequisitionData: initialCentralRequisitionData
    },
    reducers: {
        bindCentralRequisitionInfo: ( state, action ) => {
            if ( action.payload ) {
                state.centralRequisitionData = action.payload;
            } else {
                state.centralRequisitionData = initialCentralRequisitionData;
            }
        }
    },
    extraReducers: ( builder ) => {
        builder
            .addCase( getAllCentralRequisition.fulfilled, ( state, action ) => {
                state.allCentralRequisition = action.payload;
            } )
            .addCase( getCentralRequisitionById.fulfilled, ( state, action ) => {
                state.centralRequisitionData = action.payload;
            } )
            .addCase( approveRequisition.fulfilled, ( state ) => {
                state.loading = false;
            } )
            .addCase( declineRequisition.fulfilled, ( state ) => {
                state.loading = false;
            } )

    }
} )

export const { bindCentralRequisitionInfo } = centralRequisitionSlice.actions;

export default centralRequisitionSlice.reducer