import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import moment from 'moment';
import toast from "react-hot-toast";
import { generalStoreApi } from "../../../../services/api_endpoint";
import { initialScData } from "./model";

export const fetchAllScByFilter = createAsyncThunk( "sc/fetchAllScByFilter", async ( data ) => {
    const apiEndPoint = `${generalStoreApi.sc.root}/grid`;
    const res = await axios.post( apiEndPoint, data );
    return res.data.salesContracts;
} )

export const getScById = createAsyncThunk( 'sc/getScById', async ( id ) => {
    const apiEndPoint = `${generalStoreApi.sc.root}/${id}`;
    const res = await axios.get( apiEndPoint );
    const data = res.data.salesContract;

    const info = {
        ...data,
        poId: { label: data.poCode, value: data.poId },
        currencyId: { label: data.currency, value: data.currencyId },
        buyerId: { label: data.buyerName, value: data.buyerId },
        consigneeId: { label: data.consigneeName, value: data.consigneeId },
        buyerBankId: { label: data.buyerBankName, value: data.buyerBankId },
        sellerBankId: { label: data.sellerBankName, value: data.sellerBankId },
        termsPayment: { label: data.termsPayment, value: data.termsPayment },
        salesContractDate: data.salesContractDate ? moment( data.salesContractDate ).format( 'YYYY-MM-DD' ) : null,
        lastDateOfShipment: data.lastDateOfShipment ? moment( data.lastDateOfShipment ).format( 'YYYY-MM-DD' ) : null,
        items: data?.items?.map( ( item ) => ( {
            ...item,
            isDefault: false, // getting this for pi create
            uoMId: { label: item.uom, value: item.uomId }
        } ) ),
    }
    return info;
} )

export const addNewSc = createAsyncThunk( 'sc/addNewSc', async ( data ) => {
    const apiEndPoint = `${generalStoreApi.sc.root}`;
    const resData = await axios.post( apiEndPoint, data )
        .then( ( res ) => {
            return res.data.salesContract;
        } )
        .catch( ( err ) => {
            toast.error( err.response.data.detail );
            return res.data.salesContract;
        } )

    return resData;
} )

export const updateSc = createAsyncThunk( 'sc/updateSc', async ( data ) => {
    const apiEndPoint = `${generalStoreApi.sc.root}`;
    await axios.put( apiEndPoint, data )
        .then( ( res ) => {
            return res.data.salesContract;
        } )
        .catch( ( err ) => {
            toast.error( err.response.data.detail );
            return res.data.salesContract;
        } )
} )


const scSlice = createSlice( {
    name: 'sc',
    initialState: {
        allSc: [],
        totalItems: '',
        selectedData: [],
        scData: initialScData
    },
    reducers: {
        bindScInfo: ( state, action ) => {
            if ( action.payload ) {
                state.scData = action.payload;
            } else {
                state.scData = initialScData;
            }
        },

        storeSelectedData: ( state, action ) => {
            state.selectedData = action.payload
        }

    },
    extraReducers: ( builder ) => {
        builder
            .addCase( fetchAllScByFilter.fulfilled, ( state, action ) => {
                state.allSc = action.payload.items.map( ( item ) => ( {
                    ...item,
                    label: item.salesContractCode,
                    value: item.id
                } ) );
                state.totalItems = action.payload.totalItems;
            } )
            .addCase( getScById.fulfilled, ( state, action ) => {
                state.scData = action.payload;
            } )
            .addCase( addNewSc.fulfilled, ( state, action ) => {
                state.allSc = action.payload;
            } )
            .addCase( updateSc.fulfilled, ( state, action ) => {
                state.allSc = action.payload;
            } )
    }
} )

export const { bindScInfo, storeSelectedData } = scSlice.actions;

export default scSlice.reducer