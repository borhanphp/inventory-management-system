import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';
import { generalStoreApi } from '../../../../services/api_endpoint';
import { convertQueryString } from '../../../../utility/Utils';
import { initialBrandData } from './model';

export const getAllBrand = createAsyncThunk( 'brand/getAllBrand', async ( params ) => {
    const apiEndPoint = `${generalStoreApi.brands.root}?${convertQueryString( params )}`;
    const res = await axios.get( apiEndPoint );
    return res.data.brands;
} )

export const getAllBrandByFilter = createAsyncThunk( 'brand/getAllBrandByFilter', async ( data ) => {
    const apiEndPoint = `${generalStoreApi.brands.root}/grid`;
    const res = await axios.post( apiEndPoint, data );
    return res.data.brands;
} )

export const addNewBrand = createAsyncThunk( 'brand/addNewBrand', async ( data ) => {
    const apiEndPoint = `${generalStoreApi.brands.root}`;
    const resData = await axios.post( apiEndPoint, data )
        .then( ( res ) => {
            return res.data.brand;
        } )
        .catch( ( err ) => {
            // const errorMsg = JSON.parse( err?.response?.data?.detail )
            // toast.error( errorMsg[0].Message );
            if ( err.response.status === 500 ) {
                toast.error( 'Internal Server Error, Contact with Developers' );
                return res.data.brand;
            } else {
                toast.error( err?.response?.data?.detail );
                return res.data.brand;
            }


        } );
    return resData;
} )

export const updateBrand = createAsyncThunk( 'brand/updateBrand', async ( data ) => {
    const apiEndPoint = `${generalStoreApi.brands.root}`;
    await axios.put( apiEndPoint, data )
        .then( ( res ) => {
            return res.data.brand;
        } )
        .catch( ( err ) => {
            if ( err.response.status === 500 ) {
                toast.error( 'Internal Server Error, Contact with Developers' );
                return res.data.brand;
            } else {
                toast.error( err?.response?.data?.detail );
                return res.data.brand;
            }

        } );

} )

export const getBrandById = createAsyncThunk( 'brand/getBrandById', async ( id ) => {
    const apiEndPoint = `${generalStoreApi.brands.root}/${id}`;
    const res = await axios.get( apiEndPoint );
    const data = res.data.brand;
    const info = {
        ...data,
        countryOfOrigin: { label: data.countryOfOriginName, value: data.countryOfOrigin }
    }
    return info;
} )




export const brandsSlice = createSlice( {
    name: 'brand',
    initialState: {
        allData: [],
        data: initialBrandData,
        loading: false,
        totalItems: 0,
        error: null,
        brandBasicInfo: initialBrandData
    },
    reducers: {
        bindBrandInfo: ( state, action ) => {
            if ( action.payload ) {
                state.brandBasicInfo = action.payload;
            } else {
                state.brandBasicInfo = initialBrandData;
            }
        }
    },
    extraReducers: builder => {
        builder
            .addCase( addNewBrand.fulfilled, ( state ) => {
                state.loading = false;
            } )
            .addCase( getAllBrand.fulfilled, ( state, action ) => {
                state.allData = action.payload.items
                state.totalItems = action.payload.totalItems
            } )
            .addCase( getAllBrandByFilter.pending, ( state ) => {
                state.loading = true;
            } )
            .addCase( getAllBrandByFilter.rejected, ( state ) => {
                state.loading = false;
            } )
            .addCase( getAllBrandByFilter.fulfilled, ( state, action ) => {
                state.allData = action.payload.items;
                state.totalItems = action.payload.totalItems;
                state.loading = false;
            } )
            .addCase( updateBrand.fulfilled, ( state, action ) => {
                state.loading = false
            } )

            .addCase( getBrandById.fulfilled, ( state, action ) => {
                state.brandBasicInfo = action.payload;
            } )
    }
} );

export const { bindBrandInfo } = brandsSlice.actions;

export default brandsSlice.reducer;