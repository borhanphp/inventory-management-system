import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import moment from 'moment';
import toast from 'react-hot-toast';
import { eshop } from '../../../../services/api_endpoint';
import { initialFeaturedData } from './model';



export const getAllFeaturedCategoryByFilter = createAsyncThunk( 'featuredCategory/getAllFeaturedCategoryByFilter', async ( data ) => {
    const apiEndPoint = `${eshop.featuredCategory.root}/grid`;
    const res = await axios.post( apiEndPoint, data );
    return res.data.categories;
} )

export const addNewFeaturedCategory = createAsyncThunk( 'featuredCategory/addNewFeaturedCategory', async ( data ) => {
    const apiEndPoint = `${eshop.featuredCategory.root}`;
    await axios.post( apiEndPoint, data )
        .then( ( res ) => {
            return res.data.category;
        } )
        .catch( ( err ) => {
            toast.error( err.response.data.detail )
            return res.data.category;
        } )

} )

export const updateFeaturedCategory = createAsyncThunk( 'featuredCategory/updateFeaturedCategory', async ( data ) => {
    const apiEndPoint = `${eshop.featuredCategory.root}`;
    await axios.put( apiEndPoint, data )
        .then( ( res ) => {
            return res.data.category;
        } )
        .catch( ( err ) => {
            toast.error( err.response.data.detail )
            return res.data.category;
        } )

} )
export const deleteFeaturedCategory = createAsyncThunk( 'featuredCategory/deleteFeaturedCategory', async ( id ) => {
    const apiEndPoint = `${eshop.featuredCategory.root}/${id}`;
    const res = await axios.delete( apiEndPoint );
    return res.data.category;

} )
export const deleteFeaturedCategoryItem = createAsyncThunk( 'featuredCategory/deleteFeaturedCategoryItem', async ( data ) => {
    const apiEndPoint = `${eshop.featuredCategory.root}/${data?.featuredCategoryId}/items/${data?.id}`;
    const res = await axios.delete( apiEndPoint );
    return res.data;

} )

export const getFeaturedCategoryById = createAsyncThunk( 'featuredCategory/getFeaturedCategoryById', async ( id ) => {
    const apiEndPoint = `${eshop.featuredCategory.root}/${id}`;
    const res = await axios.get( apiEndPoint );
    const data = res.data.category;
    const info = {
        ...data,
        categoryId: { label: data.categoryName, value: data.categoryId },
        stringStartDate: moment( data.startDate ).format( 'YYYY-MM-DD' ),
        stringEndDate: moment( data.endDate ).format( 'YYYY-MM-DD' ),
    }
    console.log( info )
    return info;
} )

export const updateAllDataWithItems = createAsyncThunk( 'featuredCategory/updateAllDataWithItems', async ( id ) => {
    const apiEndPoint = `${eshop.featuredCategory.root}/${id}`;
    const res = await axios.get( apiEndPoint );
    const data = res.data.category.items;
    return data;
} )



export const featuredCategorySlice = createSlice( {
    name: 'featuredCategory',
    initialState: {
        allData: [],
        loading: false,
        totalItems: 0,
        error: null,
        featuredCategoryBasicInfo: initialFeaturedData
    },
    reducers: {
        bindFeaturedCategoryInfo: ( state, action ) => {
            if ( action.payload ) {
                state.featuredCategoryBasicInfo = action.payload;
            } else {
                state.featuredCategoryBasicInfo = initialFeaturedData;
            }
        }
    },
    extraReducers: builder => {
        builder
            .addCase( addNewFeaturedCategory.fulfilled, ( state, action ) => {
                state.allData.push( action.payload );
            } )
            .addCase( getAllFeaturedCategoryByFilter.pending, ( state ) => {
                state.loading = true;
            } )
            .addCase( getAllFeaturedCategoryByFilter.rejected, ( state ) => {
                state.loading = false;
            } )
            .addCase( getAllFeaturedCategoryByFilter.fulfilled, ( state, action ) => {
                state.allData = action.payload.items;
                state.totalItems = action.payload.totalItems;
                state.loading = false;
            } )
            .addCase( updateFeaturedCategory.fulfilled, ( state ) => {
                state.loading = false
            } )
            .addCase( getFeaturedCategoryById.fulfilled, ( state, action ) => {
                state.featuredCategoryBasicInfo = action.payload;
            } )
            .addCase( deleteFeaturedCategory.pending, ( state ) => {
                state.loading = true;
            } )
            .addCase( deleteFeaturedCategory.fulfilled, ( state ) => {
                state.loading = false;
            } )
            .addCase( deleteFeaturedCategoryItem.fulfilled, ( state ) => {
                state.loading = false;
            } )
            .addCase( updateAllDataWithItems, ( state, action ) => {
                state.allData['items'] = action.payload;
            } )
    }
} );

export const { bindFeaturedCategoryInfo } = featuredCategorySlice.actions;

export default featuredCategorySlice.reducer;