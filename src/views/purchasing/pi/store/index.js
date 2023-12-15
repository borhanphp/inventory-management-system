import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import moment from 'moment';
import toast from "react-hot-toast";
import { generalStoreApi } from "../../../../services/api_endpoint";
import { initialPiData } from "./model";

export const fetchAllPiByFilter = createAsyncThunk( "pi/fetchAllPiByFilter", async ( data ) => {
    const apiEndPoint = `${generalStoreApi.pi.root}/grid`;
    const res = await axios.post( apiEndPoint, data );
    return res.data.pIs;
} )



export const getPiById = createAsyncThunk( 'pi/getPiById', async ( id ) => {
    const apiEndPoint = `${generalStoreApi.pi.root}/${id}`;

    const res = await axios.get( apiEndPoint );
    const data = res.data.pi;
    // const scRes = await axios.get( apiForSc );
    // console.log( 'sc get by id data', scRes.data )
    const info = {
        ...data,
        scId: { label: data.salesContractCode, value: data.scId },
        currencyId: { label: data.currency, value: data.currencyId },
        buyerId: { label: data.buyerName, value: data.buyerId },
        sellerBankId: { label: data.sellerBankName, value: data.sellerBankId },
        piDate: data.piDate ? moment( data.piDate ).format( 'YYYY-MM-DD' ) : null,
        latestShipmentDate: data.latestShipmentDate ? moment( data.latestShipmentDate ).format( 'YYYY-MM-DD' ) : null,
        groups: data.groups.map( item => ( {
            ...item,
            uoMId: { label: item.uoM, value: item.uomId }
        } ) )
        // items: data?.items?.map( ( item ) => ( {
        //     ...item,
        //     uoMId: { label: item.uom, value: item.uomId }
        // } ) ),
    }
    console.log( 'info', info )
    return info;
} )

export const deletePi = createAsyncThunk( 'pi/deletePi', async ( id ) => {
    const apiEndPoint = `${generalStoreApi.pi.root}/${id}`;
    await axios.delete( apiEndPoint )
        .then( ( res ) => {
            return res.data.pi
        } )
        .catch( err => console.log( 'res from pi delete', err ) )

} )

export const deletePiGroup = createAsyncThunk( 'pi/deletePiGroup', async ( row ) => {
    const apiEndPoint = `${generalStoreApi.pi.root}/${row.piId}/group/${row.id}`;
    const res = await axios.delete( apiEndPoint )
    return res.data.pi
} )

const addNewPiWithGroupList = async ( piId, scItemData, piGroupsData ) => {
    const apiEndPoint = `${generalStoreApi.pi.root}/groups-list`;
    const submittedData = {
        piId: piId,
        groups: [...scItemData, ...piGroupsData],
    };
    console.log( 'submittedData', JSON.stringify( submittedData, null, 2 ) )
    await axios.post( apiEndPoint, submittedData )
        .then( ( res ) => {
        } )
        .catch( ( err ) => {
            deletePi( piId );
        } )

}

const updatePiWithGroupList = async ( piId, scItemData, piGroupsData ) => {
    const apiEndPoint = `${generalStoreApi.pi.root}/groups-list`;
    const submittedData = {
        piId: piId,
        groups: [...scItemData, ...piGroupsData],
    };
    console.log( 'submittedData', JSON.stringify( submittedData, null, 2 ) )
    await axios.put( apiEndPoint, submittedData )
        .then( ( res ) => {
        } )
        .catch( ( err ) => {
            deletePi( piId );
        } )

}

export const addNewPi = createAsyncThunk( 'pi/addNewPi', async ( data ) => {
    const apiEndPoint = `${generalStoreApi.pi.root}`;
    const resData = await axios.post( apiEndPoint, data.data )
        .then( ( res ) => {
            addNewPiWithGroupList( res?.data?.pi?.id, data.scItemData, data.piGroupsData );
            return res.data.pi;
        } )
        .catch( ( err ) => {
            toast.error( err.response.data.detail );
            return res.data.pi;
        } )
    return resData;
} )

export const updatePi = createAsyncThunk( 'pi/updatePi', async ( data ) => {
    const apiEndPoint = `${generalStoreApi.pi.root}`;
    const resData = await axios.put( apiEndPoint, data.data )
        .then( ( res ) => {
            updatePiWithGroupList( res?.data?.pi?.id, data.scItemData, data.piGroupsData );
            return res.data.pi;
        } )
        .catch( ( err ) => {
            toast.error( err.response.data.detail );
            return res.data.pi;
        } )
    return resData;
} )


export const getUngroupedPiData = createAsyncThunk( 'pi/getUngroupedPiData', async ( data ) => {
    const apiEndPoint = `${generalStoreApi.pi.root}/${data.piId}/${data.scId}`;
    const resData = await axios.get( apiEndPoint )
        .then( ( res ) => {
            return res.data.items;
        } )
        .catch( ( err ) => {
            toast.error( err.response.data.detail );
            return res.data.items;
        } )
    return resData;
} )





const piSlice = createSlice( {
    name: 'pi',
    initialState: {
        allPi: [],
        totalItems: '',
        loading: false,
        piData: initialPiData
    },
    reducers: {
        bindPiInfo: ( state, action ) => {
            if ( action.payload ) {
                state.piData = action.payload;
            } else {
                state.piData = initialPiData;
            }
        }

    },
    extraReducers: ( builder ) => {
        builder
            .addCase( fetchAllPiByFilter.fulfilled, ( state, action ) => {
                state.allPi = action.payload.items.map( pi => ( {
                    ...pi,
                    label: pi.piCode,
                    value: pi.id
                } ) )
                state.totalItems = action.payload.totalItems;
            } )
            .addCase( getPiById.fulfilled, ( state, action ) => {
                state.piData = action.payload;
            } )
            .addCase( addNewPi.fulfilled, ( state ) => {
                state.loading = false;
            } )
            .addCase( updatePi.fulfilled, ( state, action ) => {
                state.allPi = action.payload;
            } )
            .addCase( deletePi.fulfilled, ( state, action ) => {
                state.allPi = action.payload;
            } )
            .addCase( deletePiGroup.fulfilled, ( state, action ) => {
                state.allPi = action.payload;
            } )
            .addCase( getUngroupedPiData.fulfilled, ( state ) => {
                state.loading = false;
            } )
    }
} )

export const { bindPiInfo } = piSlice.actions;

export default piSlice.reducer