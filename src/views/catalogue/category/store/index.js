import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';
import { generalStoreApi } from '../../../../services/api_endpoint';
import { convertQueryString } from '../../../../utility/Utils';
import { initialCategoryData } from './model';

const ROOT = generalStoreApi.categories.root;

export const getAllCategory = createAsyncThunk( 'category/getAllCategory', async ( params ) => {
    const apiEndPoint = `${ROOT}?${convertQueryString( params )}`;
    const res = await axios.get( apiEndPoint );
    return res.data.categories;
} )

export const getAllCategoryByFilter = createAsyncThunk( 'category/getAllCategoryByFilter', async ( data ) => {
    const apiEndPoint = `${ROOT}/grid`;
    const res = await axios.post( apiEndPoint, data );
    return res.data.categories;
} )

export const addNewCategory = createAsyncThunk( 'category/addNewCategory', async ( data ) => {
    const apiEndPoint = `${ROOT}`;
    const resData = await axios.post( apiEndPoint, data )
        .then( ( res ) => {
            return res.data.category;
        } )
        .catch( ( err ) => {
            toast.error( err?.response?.data?.detail );
            return res.data.category;
        } )
    return resData;

} )

export const updateCategory = createAsyncThunk( 'category/updateCategory', async ( data ) => {
    const apiEndPoint = `${ROOT}`;
    await axios.put( apiEndPoint, data )
        .then( ( res ) => {
            return res.data.category;
        } )
        .catch( ( err ) => {
            toast.error( err?.response?.data?.detail );
            return res.data.category;
        } )

} )

export const getCategoryById = createAsyncThunk( 'category/getCategoryById', async ( id ) => {
    const apiEndPoint = `${ROOT}/${id}`;
    const res = await axios.get( apiEndPoint );
    const data = res.data.category
    console.log( 'res from category data', data )
    const info = {
        ...data,
        parentCategoryId: { label: data.parentCategoryName, value: data.parentCategoryId },
        checkSub: data.parentCategoryName === null ? false : true,
        categorySegments: data.categorySegments.map( segData => ( {
            ...segData,
            label: segData.segmentName,
            value: segData.segmentId
        } ) )

    }
    return info;
} )



export const categorySlice = createSlice( {
    name: 'category',
    initialState: {
        allData: [],
        loading: false,
        totalItems: 0,
        error: null,
        categoryBasicInfo: initialCategoryData
    },
    reducers: {
        bindCategoryInfo: ( state, action ) => {
            if ( action.payload ) {
                state.categoryBasicInfo = action.payload;
            } else {
                state.categoryBasicInfo = initialCategoryData;
            }
        }
    },
    extraReducers: builder => {
        builder
            .addCase( addNewCategory.pending, ( state ) => {
                state.loading = true;
            } )
            .addCase( addNewCategory.rejected, ( state ) => {
                state.loading = false;
            } )
            .addCase( addNewCategory.fulfilled, ( state, action ) => {
                state.allData.push( action.payload );
            } )
            .addCase( getAllCategory.fulfilled, ( state, action ) => {
                state.allData = action.payload.items
                state.totalItems = action.payload.totalItems
            } )
            .addCase( getAllCategoryByFilter.pending, ( state ) => {
                state.loading = true;
            } )
            .addCase( getAllCategoryByFilter.rejected, ( state ) => {
                state.loading = false;
            } )
            .addCase( getAllCategoryByFilter.fulfilled, ( state, action ) => {
                state.allData = action.payload.items;
                state.totalItems = action.payload.totalItems;
                state.loading = false;
            } )
            .addCase( updateCategory.fulfilled, ( state, action ) => {
                state.loading = false
            } )
            .addCase( getCategoryById.fulfilled, ( state, action ) => {
                state.categoryBasicInfo = action.payload;
            } )
    }
} );

export const { bindCategoryInfo } = categorySlice.actions;
export default categorySlice.reducer;