import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import moment from 'moment';
import toast from 'react-hot-toast';
import { generalStoreApi } from '../../../../services/api_endpoint';
import { initialScCostingData } from './model';

export const getAllScCostingByFilter = createAsyncThunk( 'scCosting/getAllScCostingByFilter', async ( data ) => {
    const apiEndPoint = `${generalStoreApi.scCostings.root}/grid`;
    const res = await axios.post( apiEndPoint, data );
    return res.data.costings;
} )

export const addNewScCosting = createAsyncThunk( 'scCosting/addNewScCosting', async ( data ) => {
    const apiEndPoint = `${generalStoreApi.scCostings.root}`;
    await axios.post( apiEndPoint, data )
        .then( ( res ) => {
            console.log( res )
            return res.data.scCosting;
        } )
        .catch( ( err ) => {
            toast.error( err?.response?.data?.detail );
        } );
} )

export const updateScCosting = createAsyncThunk( 'scCosting/updateScCosting', async ( data ) => {
    const apiEndPoint = `${generalStoreApi.scCostings.root}`;
    await axios.put( apiEndPoint, data )
        .then( ( res ) => {
            return res.data.scCosting;
        } )
        .catch( ( err ) => {

            toast.error( err?.response?.data?.detail );
        } );

} )

export const getScCostingById = createAsyncThunk( 'scCosting/getScCostingById', async ( id ) => {
    const apiEndPoint = `${generalStoreApi.scCostings.root}/${id}`;
    const res = await axios.get( apiEndPoint );
    const data = res.data.costing;
    const info = {
        ...data,
        scId: { label: data.scCode, value: data.scId },
        headId: { label: data.costingHeadName, value: data.headId },
        ciId: { label: data.ciCode, value: data.ciId },
        date: data.date ? moment( data.date ).format( 'YYYY-MM-DD' ) : null
    }
    return info;
} )

export const getCiByScId = createAsyncThunk( 'scCosting/getCiByScId', async ( id ) => {
    const apiEndPoint = `${generalStoreApi.scCostings.root}/sales-contract/${id}`;
    const res = await axios.get( apiEndPoint );
    const data = res?.data?.ciList?.map( dd => ( {
        ...dd,
        label: dd.ciCode,
        value: dd.id
    } ) )
    return data;
} )




export const scCostingSlice = createSlice( {
    name: 'scCosting',
    initialState: {
        allData: [],
        ciDataForCosting: [],
        data: initialScCostingData,
        loading: false,
        totalItems: 0,
        error: null,
        scCostingBasicInfo: initialScCostingData
    },
    reducers: {
        bindScCostingInfo: ( state, action ) => {
            if ( action.payload ) {
                state.scCostingBasicInfo = action.payload;
            } else {
                state.scCostingBasicInfo = initialScCostingData;
            }
        }
    },
    extraReducers: builder => {
        builder
            .addCase( addNewScCosting.fulfilled, ( state ) => {
                state.loading = false;
            } )
            .addCase( getAllScCostingByFilter.pending, ( state ) => {
                state.loading = true;
            } )
            .addCase( getAllScCostingByFilter.rejected, ( state ) => {
                state.loading = false;
            } )
            .addCase( getAllScCostingByFilter.fulfilled, ( state, action ) => {
                state.allData = action.payload.items;
                state.totalItems = action.payload.totalItems;
                state.loading = false;
            } )
            .addCase( updateScCosting.fulfilled, ( state, action ) => {
                state.loading = false
            } )

            .addCase( getScCostingById.fulfilled, ( state, action ) => {
                state.scCostingBasicInfo = action.payload;
            } )
            .addCase( getCiByScId.fulfilled, ( state, action ) => {
                state.ciDataForCosting = action.payload;
            } )
    }
} );

export const { bindScCostingInfo } = scCostingSlice.actions;

export default scCostingSlice.reducer;