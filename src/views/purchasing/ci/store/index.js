import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import moment from 'moment';
import toast from "react-hot-toast";
import { generalStoreApi } from "../../../../services/api_endpoint";
import { initialCiData } from "./model";

export const fetchAllCiByFilter = createAsyncThunk( "ci/fetchAllCiByFilter", async ( data ) => {
    const apiEndPoint = `${generalStoreApi.ci.root}/grid`;
    const res = await axios.post( apiEndPoint, data );
    return res.data.cIs;
} )

export const fetchAllPiFoCi = createAsyncThunk( "ci/fetchAllPiFoCi", async ( data ) => {
    const apiEndPoint = `${generalStoreApi.pi.root}/grid`;
    const res = await axios.post( apiEndPoint, data );
    const resData = res.data.pIs;
    return resData;
} )

export const getCiById = createAsyncThunk( 'ci/getCiById', async ( id ) => {
    const apiEndPoint = `${generalStoreApi.ci.root}/${id}`;
    const res = await axios.get( apiEndPoint );
    const data = res.data.ci;

    const info = {
        ...data,
        piId: { label: data.piCode, value: data.piId },
        currencyId: { label: data.currency, value: data.currencyId },
        ciDate: moment( data.ciDate ).format( 'YYYY-MM-DD' ),
        customsReferenceDate: data.customsReferenceDate ? moment( data.customsReferenceDate ).format( 'YYYY-MM-DD' ) : null,
        items: data?.items?.map( item => ( {
            ...item,
            weightUnit: { label: item?.weightUoM, value: item?.weightUnit },
            quantityUnit: { label: item?.quantityUoM, value: item?.quantityUnit }
        } ) )
    }
    return info;
} )

export const getPiForCiById = createAsyncThunk( 'ci/getPiForCiById', async ( id ) => {
    const apiEndPoint = `${generalStoreApi.ci.root}/pi-groups/${id}`;

    const res = await axios.get( apiEndPoint );
    const data = res.data.pi;
    const info = {
        ...data,
        scId: { label: data.salesContractCode, value: data.scId },
        currencyId: { label: data.currency, value: data.currencyId },
        buyerId: { label: data.buyerName, value: data.buyerId },
        sellerBankId: { label: data.sellerBankName, value: data.sellerBankId },
        piDate: data.piDate ? moment( data.piDate ).format( 'YYYY-MM-DD' ) : null,
        latestShipmentDate: data.latestShipmentDate ? moment( data.latestShipmentDate ).format( 'YYYY-MM-DD' ) : null,
        customsReferenceDate: data.customsReferenceDate ? moment( data.customsReferenceDate ).format( 'YYYY-MM-DD' ) : null,
        // items: data?.items?.map( ( item ) => ( {
        //     ...item,
        //     uoMId: { label: item.uom, value: item.uomId }
        // } ) ),
    }
    return info;
} )

export const addNewCi = createAsyncThunk( 'ci/addNewCi', async ( data ) => {
    const apiEndPoint = `${generalStoreApi.ci.root}`;
    await axios.post( apiEndPoint, data )
        .then( ( res ) => {
            return res.data.ci;
        } )
        .catch( ( err ) => {
            toast.error( err.response.data.detail );
            return res.data.ci;
        } )
} )

export const updateCi = createAsyncThunk( 'ci/updateCi', async ( data ) => {
    const apiEndPoint = `${generalStoreApi.ci.root}`;
    await axios.put( apiEndPoint, data )
        .then( ( res ) => {
            return res.data.ci;
        } )
        .catch( ( err ) => {
            toast.error( err.response.data.detail );
            return res.data.ci;
        } )
} )


const ciSlice = createSlice( {
    name: 'ci',
    initialState: {
        allCi: [],
        piForCi: [],
        totalItems: '',
        selectedData: [],
        ciData: initialCiData,
        piData: initialCiData
    },
    reducers: {
        bindCiInfo: ( state, action ) => {
            if ( action.payload ) {
                state.ciData = action.payload;
            } else {
                state.ciData = initialCiData;
            }
        }

    },
    extraReducers: ( builder ) => {
        builder
            .addCase( fetchAllCiByFilter.fulfilled, ( state, action ) => {
                state.allCi = action.payload.items.map( ( item ) => ( {
                    ...item,
                    label: item.ciCode,
                    value: item.id
                } ) );
                state.totalItems = action.payload.totalItems;
            } )
            .addCase( fetchAllPiFoCi.fulfilled, ( state, action ) => {
                state.piForCi = action.payload.items?.map( d => ( {
                    ...d,
                    label: d.piCode,
                    value: d.id
                } ) );
                state.totalItems = action.payload.totalItems;
            } )
            .addCase( getCiById.fulfilled, ( state, action ) => {
                state.ciData = action.payload;
            } )
            .addCase( addNewCi.fulfilled, ( state, action ) => {
                state.allCi = action.payload;
            } )
            .addCase( updateCi.fulfilled, ( state, action ) => {
                state.allCi = action.payload;
            } )
            .addCase( getPiForCiById.fulfilled, ( state, action ) => {
                state.piData = action.payload;
            } )
    }
} )

export const { bindCiInfo } = ciSlice.actions;

export default ciSlice.reducer