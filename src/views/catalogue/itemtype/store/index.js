import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';
import { generalStoreApi } from '../../../../services/api_endpoint';
import { initialItemTypeData } from './model';

export const getAllItemTypeByFilter = createAsyncThunk( 'itemtype/getAllItemTypeByFilter', async ( data ) => {
    const apiEndPoint = `${generalStoreApi.itemtype.root}/grid`;
    const res = await axios.post( apiEndPoint, data );
    return res.data.types;
} )

export const addNewItemType = createAsyncThunk( 'itemtype/addNewItemType', async ( data ) => {
    const apiEndPoint = `${generalStoreApi.itemtype.root}`;
    const resData = await axios.post( apiEndPoint, data )
        .then( ( res ) => {
            return res.data.type;
        } )
        .catch( ( err ) => {
            toast.error( err.response.data.detail );
            return res.data.type;

        } )
    return resData;

} )

export const updateItemType = createAsyncThunk( 'itemtype/updateItemType', async ( data ) => {
    const apiEndPoint = `${generalStoreApi.itemtype.root}`;
    const resData = await axios.put( apiEndPoint, data )
        .then( ( res ) => {
            return res.data.type;
        } )
        .catch( ( err ) => {
            toast.error( err.response.data.detail );
            return res.data.type;

        } )
    return resData;

} )

export const getItemTypeById = createAsyncThunk( 'itemtype/getItemTypeById', async ( id ) => {
    const apiEndPoint = `${generalStoreApi.itemtype.root}/${id}`;
    const res = await axios.get( apiEndPoint );
    return res.data.type;
} )



export const ItemTypeSlice = createSlice( {
    name: 'itemtype',
    initialState: {
        allData: [],
        loading: false,
        totalItems: 0,
        error: null,
        itemTypeBasicInfo: initialItemTypeData
    },
    reducers: {
        bindItemTypeInfo: ( state, action ) => {
            if ( action.payload ) {
                state.itemTypeBasicInfo = action.payload;
            } else {
                state.itemTypeBasicInfo = initialItemTypeData;
            }
        }
    },
    extraReducers: builder => {
        builder
            .addCase( addNewItemType.fulfilled, ( state ) => {
                state.loading = false;
            } )
            .addCase( getAllItemTypeByFilter.fulfilled, ( state, action ) => {
                state.allData = action.payload.items
                state.totalItems = action.payload.totalItems
            } )
            .addCase( updateItemType.fulfilled, ( state ) => {
                state.loading = false
            } )
            .addCase( getItemTypeById.fulfilled, ( state, action ) => {
                state.itemTypeBasicInfo = action.payload;
            } )
    }
} );

export const { bindItemTypeInfo } = ItemTypeSlice.actions;

export default ItemTypeSlice.reducer;