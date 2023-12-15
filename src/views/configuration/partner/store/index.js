import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast';
import { generalStoreApi } from '../../../../services/api_endpoint';
import { initialPartnerData } from './model';


export const getPartnerByFilter = createAsyncThunk( 'partner/getPartnerByFilter', async ( data ) => {
    const apiEndPoint = `${generalStoreApi.partner.root}/grid`;
    const res = await axios.post( apiEndPoint, data );
    return res.data.partners;
} )

export const addNewPartner = createAsyncThunk( 'partner/addNewPartner', async ( data ) => {
    const apiEndPoint = `${generalStoreApi.partner.root}`;
    await axios.post( apiEndPoint, data )
        .then( ( res ) => {
            return res.data.partner;
        } )
        .catch( ( err ) => {
            toast.error( err?.response?.data?.detail );
            return res.data.partner;
        } );
} )

export const updatePartner = createAsyncThunk( 'partner/updatePartner', async ( data ) => {
    const apiEndPoint = `${generalStoreApi.partner.root}`;
    await axios.put( apiEndPoint, data )
        .then( ( res ) => {
            return res.data.partner;
        } )
        .catch( ( err ) => {
            toast.error( err?.response?.data?.detail );
            return res.data.partner;
        } );


} )

export const getPartnerById = createAsyncThunk( 'partner/getPartnerById', async ( id ) => {
    const apiEndPoint = `${generalStoreApi.partner.root}/${id}`;
    const res = await axios.get( apiEndPoint );
    const data = res.data.partners;
    const info = {
        ...data,
        logoUrl: data.logo,
        logoWithDetailsUrl: data.logoWithDetails,
        signUrl: data.sign,
        stampUrl: data.stamp,
        contactType: { label: data.contactType, value: data.contactType },
        countryId: { label: data.countryName, value: data.countryId },
        businessType: { label: data.businessType, value: data.businessType },
        zoneId: { label: data.zoneName, value: data.zoneId },
        areaId: { label: data.area, value: data.areaId },
        contactPersonOneName: data.contactPersonOneName,
        contactPersonOneMobileNo: data.contactPersonOneMobileNo,
        contactPersonTwoName: data.contactPersonTwoName,
        contactPersonTwoMobileNo: data.contactPersonTwoMobileNo,
    }
    return info;
} )




export const partnerSlice = createSlice( {
    name: 'partner',
    initialState: {
        allData: [],
        loading: false,
        totalItems: 0,
        error: null,
        partnerBasicInfo: initialPartnerData
    },
    reducers: {
        bindPartnerInfo: ( state, action ) => {
            if ( action.payload ) {
                state.partnerBasicInfo = action.payload;
            } else {
                state.partnerBasicInfo = initialPartnerData;
            }
        }
    },
    extraReducers: builder => {
        builder
            .addCase( getPartnerByFilter.pending, ( state ) => {
                state.loading = true;
            } )
            .addCase( getPartnerByFilter.rejected, ( state ) => {
                state.loading = false;
            } )
            .addCase( getPartnerByFilter.fulfilled, ( state, action ) => {
                state.allData = action.payload.items;
                state.totalItems = action.payload.totalItems;
                state.loading = false;
            } )
            .addCase( addNewPartner.fulfilled, ( state, action ) => {
                state.loading = false;
            } )
            .addCase( getPartnerById.fulfilled, ( state, action ) => {
                state.partnerBasicInfo = action.payload;
            } )
            .addCase( updatePartner.fulfilled, ( state, action ) => {
                state.loading = false;
            } )

    }
} );

export const { bindPartnerInfo } = partnerSlice.actions;

export default partnerSlice.reducer;