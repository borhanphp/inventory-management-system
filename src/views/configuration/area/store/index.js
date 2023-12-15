import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { generalStoreApi } from '../../../../services/api_endpoint';

export const initialAreaData = {
    name: '',
    note: ''
}
export const filterParams = {
    page: 1,
    pageSize: 10,
    includes: [],
    filters: [],
    sorts: [],
};

export const getAllAreaByFilter = createAsyncThunk( 'area/getAllAreaByFilter', async ( data ) => {
    const apiEndPoint = `${generalStoreApi.area.root}/grid`;
    const res = await axios.post( apiEndPoint, data );
    return res.data.area;
} )

export const addNewArea = createAsyncThunk( 'area/addNewArea', async ( data ) => {
    const apiEndPoint = `${generalStoreApi.area.root}`;
    const res = await axios.post( apiEndPoint, data );
    return res.data.area;

} )

export const updateArea = createAsyncThunk( 'area/updateArea', async ( data ) => {
    const apiEndPoint = `${generalStoreApi.area.root}`;
    const res = await axios.put( apiEndPoint, data );
    return res.data.area;

} )

export const getAreaById = createAsyncThunk( 'zone/getAreaById', async ( id ) => {
    const apiEndPoint = `${generalStoreApi.area.root}/${id}`;
    const res = await axios.get( apiEndPoint );
    return res.data.area;
} )


export const areaSlice = createSlice( {
    name: 'area',
    initialState: {
        allData: [],
        data: initialAreaData,
        loading: false,
        totalItems: 0,
        error: null,
        areaBasicInfo: initialAreaData
    },
    reducers: {
        bindAreaInfo: ( state, action ) => {
            if ( action.payload ) {
                state.areaBasicInfo = action.payload;
            } else {
                state.areaBasicInfo = initialAreaData;
            }
        }
    },
    extraReducers: builder => {
        builder
            .addCase( getAllAreaByFilter.fulfilled, ( state, action ) => {
                state.allData = action.payload.items.map( item => ( {
                    ...item,
                    label: item.name,
                    value: item.id
                } ) );
                state.totalItems = action.payload.totalItems;
            } )
            .addCase( addNewArea.fulfilled, ( state ) => {
                state.loading = false;
            } )
            .addCase( updateArea.fulfilled, ( state ) => {
                state.loading = false
            } )
            .addCase( getAreaById.fulfilled, ( state, action ) => {
                state.areaBasicInfo = action.payload;
            } )
    }
} );

export const { bindAreaInfo } = areaSlice.actions;

export default areaSlice.reducer;