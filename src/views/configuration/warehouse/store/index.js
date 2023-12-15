import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';
import { generalStoreApi } from '../../../../services/api_endpoint';
import { initialWarehouseData } from './model';

export const getAllWarehouseByFilter = createAsyncThunk( 'warehouse/getAllWarehouseByFilter', async ( data ) => {
    const apiEndPoint = `${generalStoreApi.warehouse.root}/grid`;
    const res = await axios.post( apiEndPoint, data );
    return res.data.warehouses;
} )

export const addNewWarehouse = createAsyncThunk( 'warehouse/addNewWarehouse', async ( data ) => {
    const apiEndPoint = `${generalStoreApi.warehouse.root}`;
    await axios.post( apiEndPoint, data )
        .then( ( res ) => {
            return res.data.warehouse;
        } )
        .catch( ( err ) => {
            toast.error( err.response.data.detail );
            return res.data.warehouse;
        } )
} )

export const updateWarehouse = createAsyncThunk( 'warehouse/updateWarehouse', async ( data ) => {
    const apiEndPoint = `${generalStoreApi.warehouse.root}`;
    await axios.put( apiEndPoint, data )
        .then( ( res ) => {
            return res.data.warehouse;
        } )
        .catch( ( err ) => {
            toast.error( err.response.data.detail );
            return res.data.warehouse;
        } )

} )

export const getWarehouseById = createAsyncThunk( 'warehouse/getWarehouseById', async ( id ) => {
    const apiEndPoint = `${generalStoreApi.warehouse.root}/${id}`;
    const res = await axios.get( apiEndPoint );
    const data = res.data.warehouse;
    const info = {
        ...data,
        countryId: countryId ? { label: data.countryName, value: data.countryId } : null
    }
    return info;
} )


export const warehouseSlice = createSlice( {
    name: 'warehouse',
    initialState: {
        allData: [],
        loading: false,
        totalItems: 0,
        error: null,
        warehouseBasicInfo: initialWarehouseData
    },
    reducers: {
        bindWarehouseInfo: ( state, action ) => {
            if ( action.payload ) {
                state.warehouseBasicInfo = action.payload;
            } else {
                state.warehouseBasicInfo = initialWarehouseData;
            }
        }
    },
    extraReducers: builder => {
        builder
            .addCase( addNewWarehouse.fulfilled, ( state ) => {
                state.loading = false;
            } )
            .addCase( getAllWarehouseByFilter.pending, ( state ) => {
                state.loading = true;
            } )
            .addCase( getAllWarehouseByFilter.rejected, ( state ) => {
                state.loading = false;
            } )
            .addCase( getAllWarehouseByFilter.fulfilled, ( state, action ) => {
                state.allData = action.payload.items
                state.totalItems = action.payload.totalItems
                state.loading = false;
            } )
            .addCase( updateWarehouse.fulfilled, ( state ) => {
                state.loading = false
            } )

            .addCase( getWarehouseById.fulfilled, ( state, action ) => {
                state.warehouseBasicInfo = action.payload;
            } )
    }
} );

export const { bindWarehouseInfo } = warehouseSlice.actions;

export default warehouseSlice.reducer;