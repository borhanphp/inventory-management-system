import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import moment from 'moment';
import toast from 'react-hot-toast';
import { generalStoreApi } from '../../../../services/api_endpoint';
import { initialItemState } from '../model';

export const getAllItem = createAsyncThunk( 'item/getAllItem', async ( params ) => {
    const apiEndPoint = `${generalStoreApi.items.root}?${convertQueryString( params )}`;
    const res = await axios.get( apiEndPoint );
    return res.data.items;
} )

export const getItemsByFilter = createAsyncThunk( 'item/getAllItemByFilter', async ( data ) => {
    const apiEndPoint = `${generalStoreApi.items.root}/grid`;
    const res = await axios.post( apiEndPoint, data );
    return res.data.items;
} )

export const addNewItem = createAsyncThunk( 'item/addNewItem', async ( data ) => {
    const apiEndPoint = `${generalStoreApi.items.root}`;
    const resData = await axios.post( apiEndPoint, data )
        .then( ( res ) => {
            return res.data.item
        } )
        .catch( ( err ) => {
            toast.error( err.response.data.detail );
            return res.data.item
        } )
    return resData;

} )

export const updateItems = createAsyncThunk( 'item/updateItem', async ( data ) => {
    const apiEndPoint = `${generalStoreApi.items.root}`;
    const resData = await axios.put( apiEndPoint, data )
        .then( ( res ) => {
            return res.data.item
        } )
        .catch( ( err ) => {
            console.log( err )
            toast.error( err.response.data.detail );
            return res.data.item
        } )
    return resData;

} )

export const getItemById = createAsyncThunk( 'item/getItemById', async ( id, { dispatch, getState } ) => {
    const apiEndPoint = `${generalStoreApi.items.root}/${id}`;
    const res = await axios.get( apiEndPoint );
    const data = res?.data?.items;

    const info = {
        ...data,
        // categoryId: { label: data.category, value: data.categoryId },
        categoryId: { label: data.categoryHierarchy, value: data.categoryId },
        itemType: { label: data.itemType, value: data.itemType },
        itemTypeId: { label: data.itemTypeName, value: data.itemTypeId },
        packageTypeId: { label: data.packageTypeName, value: data.packageTypeId },
        packageTypeSizeId: { label: data.packageTypeSize, value: data.packageTypeSizeId },
        itemService: { label: data.itemService, value: data.itemService },
        manufacturedCountry: { label: data.manufacturedCountryName, value: data.manufacturedCountry },
        vatType: { label: data.vatType, value: data.vatType },
        discountType: data.discountType !== null ? { label: data.discountType, value: data.discountType } : null,
        otherChargeType: data.otherChargeType !== null ? { label: data.otherChargeType, value: data.otherChargeType } : null,
        vatPercentage: { label: data.vatPercentage, value: data.vatPercentage },
        statusExpiryDate: moment( data.statusExpiryDate ).format( 'YYYY-MM-DD' ),
        brandId: { label: data.brand, value: data.brandId },
        unitOfMeasureId: { label: data.unitOfMeasure, value: data.unitOfMeasureId },
        contactPersonOneName: data.contactPersonOneName,
        contactPersonOneMobileNo: data.contactPersonOneMobileNo,
        contactPersonTwoName: data.contactPersonTwoName,
        contactPersonTwoMobileNo: data.contactPersonTwoMobileNo,
        segments: data.segments.map( segment => ( {
            ...segment,
            label: segment.segmentName,
            value: segment.segmentName,
            values: {
                label: segment.segmentValue,
                value: segment.segmentValue,
                serial: segment?.serial,
                segmentId: segment?.segmentId,

            }
        } ) ),
        images: data?.images
    }

    console.log( 'info', info )
    return info;
} );



export const deleteItemImage = createAsyncThunk( 'item/deleteItemImage', async ( data ) => {
    const apiEndPoint = `${generalStoreApi.items.root}/${data.itemId}/image/${data.id}`;
    const res = await axios.delete( apiEndPoint );
    return res.data.item;

} )


export const itemSlice = createSlice( {
    name: 'item',
    initialState: {
        allData: [],
        loading: false,
        totalItems: 0,
        error: null,
        success: "",
        serial: 0,
        itemBasicInfo: initialItemState
    },
    reducers: {
        bindItemInfo: ( state, action ) => {
            if ( action.payload ) {
                state.itemBasicInfo = action.payload;
            } else {
                state.itemBasicInfo = initialItemState;
            }
        }
    },
    extraReducers: builder => {
        builder
            .addCase( addNewItem.fulfilled, ( state, action ) => {
                state.loading = false;
            } )
            .addCase( addNewItem.pending, ( state ) => {
                state.loading = true;
            } )
            .addCase( addNewItem.rejected, ( state ) => {
                state.loading = false;
            } )
            .addCase( getAllItem.fulfilled, ( state, action ) => {
                state.allData = action.payload.items?.map( ( item ) => ( {
                    ...item,
                    label: item.description,
                    value: item.description
                } ) );
                state.totalItems = action.payload.totalItems;
            } )
            .addCase( getItemsByFilter.pending, ( state ) => {
                state.loading = true;
            } )
            .addCase( getItemsByFilter.rejected, ( state ) => {
                state.loading = false;
            } )
            .addCase( getItemsByFilter.fulfilled, ( state, action ) => {
                state.allData = action.payload.items;
                state.totalItems = action.payload.totalItems;
                state.loading = false;
            } )
            .addCase( updateItems.fulfilled, ( state ) => {
                state.loading = false
            } )

            .addCase( getItemById.fulfilled, ( state, action ) => {
                state.itemBasicInfo = action.payload;
            } )
            .addCase( deleteItemImage.fulfilled, ( state ) => {
                state.success = "Image Deleted";
            } )
    }
} );

export const { bindItemInfo } = itemSlice.actions;

export default itemSlice.reducer;