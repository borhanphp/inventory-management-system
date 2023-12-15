import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { generalStoreApi } from '../../../../services/api_endpoint';
import { convertQueryString } from '../../../../utility/Utils';
import { initialZoneData } from './model';

export const getAllZone = createAsyncThunk( 'zone/getAllZone', async ( params ) => {
    const apiEndPoint = `${generalStoreApi.zones.root}?${convertQueryString( params )}`;
    const res = await axios.get( apiEndPoint );
    return res.data.zones;
} )

export const getAllZoneByFilter = createAsyncThunk( 'zone/getAllZoneByFilter', async ( data ) => {
    const apiEndPoint = `${generalStoreApi.zones.root}/grid`;
    const res = await axios.post( apiEndPoint, data );
    return res.data.zones;
} )

export const addNewZone = createAsyncThunk( 'zone/addNewZone', async ( data ) => {
    const apiEndPoint = `${generalStoreApi.zones.root}`;
    const res = await axios.post( apiEndPoint, data );
    return res.data.zone;

} )

export const updateZone = createAsyncThunk( 'zone/updateZone', async ( data ) => {
    const apiEndPoint = `${generalStoreApi.zones.root}`;
    const res = await axios.put( apiEndPoint, data );
    return res.data.zone;

} )

export const getZoneById = createAsyncThunk( 'zone/getZoneById', async ( id ) => {
    const apiEndPoint = `${generalStoreApi.zones.root}/${id}`;
    const res = await axios.get( apiEndPoint );
    return res.data.zone;
} )


export const zoneSlice = createSlice( {
    name: 'zone',
    initialState: {
        allData: [],
        data: initialZoneData,
        loading: false,
        totalItems: 0,
        error: null,
        zoneBasicInfo: initialZoneData
    },
    reducers: {
        bindZoneInfo: ( state, action ) => {
            if ( action.payload ) {
                state.zoneBasicInfo = action.payload;
            } else {
                state.zoneBasicInfo = initialZoneData;
            }
        }
    },
    extraReducers: builder => {
        builder
            .addCase( getAllZoneByFilter.fulfilled, ( state, action ) => {
                state.allData = action.payload.items;
                state.totalItems = action.payload.totalItems;
            } )
            .addCase( addNewZone.fulfilled, ( state ) => {
                state.loading = false;
            } )
            .addCase( getAllZone.fulfilled, ( state, action ) => {
                state.allData = action.payload.items
                state.totalItems = action.payload.totalItems
            } )
            .addCase( updateZone.fulfilled, ( state ) => {
                state.loading = false
            } )
            .addCase( getZoneById.fulfilled, ( state, action ) => {
                state.zoneBasicInfo = action.payload;
            } )
    }
} );

export const { bindZoneInfo } = zoneSlice.actions;

export default zoneSlice.reducer;