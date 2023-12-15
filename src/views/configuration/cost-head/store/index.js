import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';
import { generalStoreApi } from '../../../../services/api_endpoint';
import { initialCostingHeadData } from './model';

export const getAllCostingHeadByFilter = createAsyncThunk( 'costingHead/getAllCostingHeadByFilter', async ( data ) => {
    const apiEndPoint = `${generalStoreApi.costingHead.root}/grid`;
    const res = await axios.post( apiEndPoint, data );
    return res.data.costingHeads;
} )

export const addNewCostingHead = createAsyncThunk( 'costingHead/addNewCostingHead', async ( data ) => {
    const apiEndPoint = `${generalStoreApi.costingHead.root}`;
    await axios.post( apiEndPoint, data )
        .then( ( res ) => {
            return res.data.costingHead;
        } )
        .catch( ( err ) => {
            toast.error( err?.response?.data?.detail );
            return res.data.costingHead;

        } );
} )

export const updateCostingHead = createAsyncThunk( 'costingHead/updateCostingHead', async ( data ) => {
    const apiEndPoint = `${generalStoreApi.costingHead.root}`;
    await axios.put( apiEndPoint, data )
        .then( ( res ) => {
            return res.data.costingHead;
        } )
        .catch( ( err ) => {
            toast.error( err?.response?.data?.detail );
            return res.data.costingHead;
        } );

} )

export const getCostingHeadById = createAsyncThunk( 'costingHead/getCostingHeadById', async ( id ) => {
    const apiEndPoint = `${generalStoreApi.costingHead.root}/${id}`;
    const res = await axios.get( apiEndPoint );
    const data = res.data.costingHead;
    const info = {
        ...data,
        type: { label: data.type, value: data.type }
    }
    return info;
} )




export const costingHeadSlice = createSlice( {
    name: 'costingHead',
    initialState: {
        allData: [],
        data: initialCostingHeadData,
        loading: false,
        totalItems: 0,
        error: null,
        costingHeadBasicInfo: initialCostingHeadData
    },
    reducers: {
        bindCostingHeadInfo: ( state, action ) => {
            if ( action.payload ) {
                state.costingHeadBasicInfo = action.payload;
            } else {
                state.costingHeadBasicInfo = initialCostingHeadData;
            }
        }
    },
    extraReducers: builder => {
        builder
            .addCase( addNewCostingHead.fulfilled, ( state ) => {
                state.loading = false;
            } )
            .addCase( getAllCostingHeadByFilter.pending, ( state ) => {
                state.loading = true;
            } )
            .addCase( getAllCostingHeadByFilter.rejected, ( state ) => {
                state.loading = false;
            } )
            .addCase( getAllCostingHeadByFilter.fulfilled, ( state, action ) => {
                state.allData = action.payload.items.map( item => ( {
                    ...item,
                    label: item.name,
                    value: item.id
                } ) )
                state.totalItems = action.payload.totalItems;
                state.loading = false;
            } )
            .addCase( updateCostingHead.fulfilled, ( state, action ) => {
                state.loading = false
            } )

            .addCase( getCostingHeadById.fulfilled, ( state, action ) => {
                state.costingHeadBasicInfo = action.payload;
            } )
    }
} );

export const { bindCostingHeadInfo } = costingHeadSlice.actions;

export default costingHeadSlice.reducer;