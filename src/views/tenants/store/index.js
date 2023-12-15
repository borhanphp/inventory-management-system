import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import moment from 'moment';
import { generalStoreApi } from "../../../services/api_endpoint";
import { convertQueryString } from "../../../utility/Utils";
import { initialTenantsData } from "./model";
export const fetchAllTenants = createAsyncThunk( "tenants/fetchAllTenants", async ( params ) => {
    const apiEndPoint = `${generalStoreApi.tenants.root}?${convertQueryString( params )}`;
    const res = await axios.get( apiEndPoint );
    return res.data.tenants.items;
} )

export const getTenantsById = createAsyncThunk( 'tenants/getTenantsById', async ( id ) => {
    const apiEndPoint = `${generalStoreApi.tenants.root}/${id}`;
    const res = await axios.get( apiEndPoint );
    const data = res.data.tenant;
    const info = {
        ...data,
        subscriptionStartDate: moment( data.subscriptionStartDate ).format( 'YYYY-MM-DD' ),
        subscriptionEndDate: moment( data.subscriptionEndDate ).format( 'YYYY-MM-DD' ),
    }
    return info;
} )
export const addNewTenants = createAsyncThunk( 'tenants/addNewTenants', async ( data, { dispatch, getState } ) => {
    const apiEndPoint = `${generalStoreApi.tenants.root}`;
    const res = await axios.post( apiEndPoint, data );
    const { params } = getState().tenants.allTenants;
    dispatch( fetchAllTenants( params ) )
    return res.data.tenant;
} )
export const updateTenants = createAsyncThunk( 'tenants/updateTenants', async ( data, { dispatch, getState } ) => {
    const apiEndPoint = `${generalStoreApi.tenants.root}`;
    const res = await axios.put( apiEndPoint, data );
    const { params } = getState().tenants.allTenants;
    dispatch( fetchAllTenants( params ) )
    return res.data.tenant;
} )


const tenantsSlice = createSlice( {
    name: 'tenants',
    initialState: {
        allTenants: [],
        totalItems: '',
        tenantsData: initialTenantsData
    },
    reducers: {
        bindTenantsInfo: ( state, action ) => {
            if ( action.payload ) {
                state.tenantsData = action.payload;
            } else {
                state.tenantsData = initialTenantsData;
            }
        }
    },
    extraReducers: ( builder ) => {
        builder
            .addCase( fetchAllTenants.fulfilled, ( state, action ) => {
                state.allTenants = action.payload;
            } )
            .addCase( getTenantsById.fulfilled, ( state, action ) => {
                state.tenantsData = action.payload;
            } )
            .addCase( addNewTenants.fulfilled, ( state, action ) => {
                state.allTenants = action.payload;
            } )
            .addCase( updateTenants.fulfilled, ( state, action ) => {
                state.allTenants = action.payload;
            } )
    }
} )

export const { bindTenantsInfo } = tenantsSlice.actions;
export default tenantsSlice.reducer