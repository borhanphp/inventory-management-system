import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { generalStoreApi } from '../../../../services/api_endpoint';
import { initialPackageTypeData } from './model';

export const getAllPackageTypeByFilter = createAsyncThunk( 'packagetype/getAllPackageTypeByFilter', async ( data ) => {
    const apiEndPoint = `${generalStoreApi.packagetype.root}/grid`;
    const res = await axios.post( apiEndPoint, data );
    return res.data.types;
} )

export const addNewPackageType = createAsyncThunk( 'packagetype/addNewPackageType', async ( data ) => {
    const apiEndPoint = `${generalStoreApi.packagetype.root}`;
    const res = await axios.post( apiEndPoint, data );
    return res.data.type;

} )

export const updatePackageType = createAsyncThunk( 'packagetype/updatePackageType', async ( data ) => {
    const apiEndPoint = `${generalStoreApi.packagetype.root}`;
    const res = await axios.put( apiEndPoint, data );
    return res.data.type;

} )

export const getPackageTypeById = createAsyncThunk( 'packagetype/getPackageTypeById', async ( id ) => {
    const apiEndPoint = `${generalStoreApi.packagetype.root}/${id}`;
    const res = await axios.get( apiEndPoint );
    const resData = res.data.type;
    const info = {
        ...resData,
        sizes: resData.sizes.map( size => ( {
            ...size,
            value: size.size,
        } ) )
    }

    return info;
} )




export const packageTypeSlice = createSlice( {
    name: 'packagetype',
    initialState: {
        allData: [],
        loading: false,
        totalItems: 0,
        error: null,
        packageTypeBasicInfo: initialPackageTypeData
    },
    reducers: {
        bindPackageTypeInfo: ( state, action ) => {
            if ( action.payload ) {
                state.packageTypeBasicInfo = action.payload;
            } else {
                state.packageTypeBasicInfo = initialPackageTypeData;
            }
        }
    },
    extraReducers: builder => {
        builder
            .addCase( addNewPackageType.fulfilled, ( state ) => {
                state.loading = false;
            } )
            .addCase( getAllPackageTypeByFilter.fulfilled, ( state, action ) => {
                state.allData = action.payload.items
                state.totalItems = action.payload.totalItems
            } )
            .addCase( updatePackageType.fulfilled, ( state ) => {
                state.loading = false
            } )
            .addCase( getPackageTypeById.fulfilled, ( state, action ) => {
                state.packageTypeBasicInfo = action.payload;
            } )
    }
} );

export const { bindPackageTypeInfo } = packageTypeSlice.actions;
export default packageTypeSlice.reducer;