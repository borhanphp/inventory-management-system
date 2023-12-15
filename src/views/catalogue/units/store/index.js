import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';
import { generalStoreApi } from '../../../../services/api_endpoint';
import { randomIdGenerator } from '../../../../utility/Utils';
import { initialUnitSetData } from './model';

export const getAllUnitSetByFilter = createAsyncThunk( 'unitSet/getAllUnitSetByFilter', async ( data ) => {
    const apiEndPoint = `${generalStoreApi.units.root}/grid`;
    const res = await axios.post( apiEndPoint, data );
    return res.data.uoM;
} )

export const addNewUnitSet = createAsyncThunk( 'unitSet/addNewUnitSet', async ( data ) => {
    const apiEndPoint = `${generalStoreApi.units.root}`;
    const res = await axios.post( apiEndPoint, data );
    return res.data.uoMSet;

} )

export const updateUnitSet = createAsyncThunk( 'unitSet/updateUnitSet', async ( data ) => {
    const apiEndPoint = `${generalStoreApi.units.root}`;
    const resData = await axios.put( apiEndPoint, data )
        .then( ( res ) => {
            return res.data.uoMSet;
        } )
        .catch( ( err ) => {
            toast.error( err.response.data.detail );
            return res.data.uoMSet;
        } )
    return resData;

} )

export const getUnitSetById = createAsyncThunk( 'unitSet/getUnitSetById', async ( id ) => {
    const apiEndPoint = `${generalStoreApi.units.root}/${id}`;
    const res = await axios.get( apiEndPoint );
    return res.data.uoMSet;
} )

export const getUnitSetByIdForAssign = createAsyncThunk( 'unitSet/getUnitSetByIdForAssign', async ( id ) => {
    const apiEndPoint = `${generalStoreApi.units.root}/${id}`;
    const res = await axios.get( apiEndPoint );
    const data = res.data.uoMSet;
    const info = {
        ...data,
        units: data?.units?.map( unit => ( {
            ...unit,
            rowId: randomIdGenerator(),
            note: unit?.note ?? '',
            isEdit: false
        } ) )
    }
    return info;
} )


export const unitSetSlice = createSlice( {
    name: 'unitSet',
    initialState: {
        allData: [],
        loading: false,
        totalItems: 0,
        error: null,
        unitSetBasicInfo: initialUnitSetData
    },
    reducers: {
        bindUnitSetInfo: ( state, action ) => {
            if ( action.payload ) {
                state.unitSetBasicInfo = action.payload;
            } else {
                state.unitSetBasicInfo = initialUnitSetData;
            }
        }
    },
    extraReducers: builder => {
        builder
            .addCase( addNewUnitSet.fulfilled, ( state ) => {
                state.loading = false;
            } )
            .addCase( getAllUnitSetByFilter.pending, ( state ) => {
                state.loading = true;
            } )
            .addCase( getAllUnitSetByFilter.fulfilled, ( state, action ) => {
                state.allData = action.payload.items
                state.totalItems = action.payload.totalItems
                state.loading = false;
            } )
            .addCase( updateUnitSet.fulfilled, ( state ) => {
                state.loading = false
            } )

            .addCase( getUnitSetById.fulfilled, ( state, action ) => {
                state.unitSetBasicInfo = action.payload;
            } )
            .addCase( getUnitSetByIdForAssign.fulfilled, ( state, action ) => {
                state.unitSetBasicInfo = action.payload;
            } )
    }
} );

export const { bindUnitSetInfo } = unitSetSlice.actions;

export default unitSetSlice.reducer;