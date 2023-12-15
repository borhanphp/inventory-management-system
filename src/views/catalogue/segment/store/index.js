import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';
import { generalStoreApi } from '../../../../services/api_endpoint';
import { initialSegmentData } from './model';


export const getSegmentByFilter = createAsyncThunk( 'segment/getSegmentByFilter', async ( data ) => {
    const apiEndPoint = `${generalStoreApi.segment.root}/grid`;
    const res = await axios.post( apiEndPoint, data );
    return res.data.segments;
} )

export const addNewSegment = createAsyncThunk( 'segment/addNewSegment', async ( data ) => {
    const apiEndPoint = `${generalStoreApi.segment.root}`;
    const resData = await axios.post( apiEndPoint, data )
        .then( ( res ) => {
            return res.data.segment;
        } )
        .catch( ( err ) => {
            toast.error( err.response.data.detail )
            return res.data.segment;
        } )
    return resData;
} )

export const updateSegment = createAsyncThunk( 'segment/updateSegment', async ( data ) => {
    const apiEndPoint = `${generalStoreApi.segment.root}`;
    const resData = await axios.put( apiEndPoint, data )
        .then( ( res ) => {
            return res.data.segment;
        } )
        .catch( ( err ) => {
            toast.error( err.response.data.detail )
            return res.data.segment;
        } )
    return resData;

} )

export const getSegmentById = createAsyncThunk( 'segment/getSegmentById', async ( id ) => {
    const apiEndPoint = `${generalStoreApi.segment.root}/${id}`;
    const res = await axios.get( apiEndPoint );
    const data = res.data.segment;
    return data;
} )

export const getSegmentsByCategoryId = createAsyncThunk( 'segment/getSegmentsByCategoryId', async ( id ) => {
    const apiEndpoint = `${generalStoreApi.categories.root}/Segments/${id}`;
    const res = await axios.get( apiEndpoint );
    const data = res.data.segments;
    const segments = data.map( dt => ( {
        ...dt,
        options: [],
        isLoaded: true,
        value: null
    } ) )
    // console.log( 'segment by cagegory selected', segments )
    return segments;
} )

// export const bindSegmentsByCategory = createAsyncThunk( "segment/bindSegmentsByCategory", async ( segmentsByCategory ) => {
//     return segmentsByCategory;
// } );



export const segmentSlice = createSlice( {
    name: 'segment',
    initialState: {
        allData: [],
        loading: false,
        totalItems: 0,
        error: null,
        segmentsByCategory: [],
        segmentBasicInfo: initialSegmentData
    },
    reducers: {
        bindSegmentsByCategory: ( state, action ) => {
            state.segmentsByCategory = action.payload;
        },

        bindSegmentInfo: ( state, action ) => {
            if ( action.payload ) {
                state.segmentBasicInfo = action.payload;
            } else {
                state.segmentBasicInfo = initialSegmentData;
            }
        }
    },
    extraReducers: builder => {
        builder
            .addCase( getSegmentByFilter.pending, ( state ) => {
                state.loading = true;
            } )
            .addCase( getSegmentByFilter.rejected, ( state ) => {
                state.loading = false;
            } )
            .addCase( getSegmentByFilter.fulfilled, ( state, action ) => {
                state.allData = action.payload.items;
                state.totalItems = action.payload.totalItems;
                state.loading = false;
            } )
            .addCase( addNewSegment.fulfilled, ( state, action ) => {
                state.allData.push( action.payload );
            } )
            .addCase( getSegmentById.fulfilled, ( state, action ) => {
                state.segmentBasicInfo = action.payload;
            } )
            .addCase( updateSegment.fulfilled, ( state, action ) => {
                state.allData.push( action.payload );
            } )
            .addCase( getSegmentsByCategoryId.fulfilled, ( state, action ) => {
                state.segmentsByCategory = action.payload;
            } )
    }
} );


export const { bindSegmentsByCategory, bindSegmentInfo } = segmentSlice.actions;
export default segmentSlice.reducer;