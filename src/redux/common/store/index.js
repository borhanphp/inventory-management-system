import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { generalStoreApi } from '../../../services/api_endpoint';

const baseAxios = axios;

// all customers
export const getAllCustomerCm = createAsyncThunk( 'common/getAllCustomerCm', async () => {
    const apiEndPoint = `${generalStoreApi.partner.root}/grid`;
    const data = {
        page: 1,
        pageSize: 10000000
    }
    const res = await axios.post( apiEndPoint, data );
    const resData = res?.data?.partners?.items?.filter( d => d.isCustomer );
    const info = resData?.map( customer => ( {
        ...customer,
        label: customer.name,
        value: customer.id
    } ) )
        .sort( ( a, b ) => a.label.localeCompare( b.label ) )
    return info;
} )

// all Representative
export const getAllRepresentativeCm = createAsyncThunk( 'common/getAllRepresentativeCm', async () => {
    const apiEndPoint = `${generalStoreApi.partner.root}/grid`;
    const data = {
        page: 1,
        pageSize: 10000000
    }
    const res = await axios.post( apiEndPoint, data );
    const resData = res?.data?.partners?.items?.filter( d => d.isRepresentative );
    const info = resData?.map( representative => ( {
        ...representative,
        label: representative.name,
        value: representative.id
    } ) )
        .sort( ( a, b ) => a.label.localeCompare( b.label ) )
    return info;
} )

// all suppliers

export const getAllSupplierCm = createAsyncThunk( 'common/getAllSupplierCm', async () => {
    const apiEndPoint = `${generalStoreApi.partner.root}/grid`;
    const data = {
        page: 1,
        pageSize: 10000000
    }
    const res = await axios.post( apiEndPoint, data );
    const resData = res?.data?.partners?.items?.filter( d => d.isSupplier );
    const info = resData?.map( supplier => ( {
        ...supplier,
        label: supplier.name + ' ' + '(' + supplier.code + ')',
        value: supplier.id
    } ) )
        .sort( ( a, b ) => a.label.localeCompare( b.label ) )
    return info;
} )


// item types
export const getAllItemTypeCm = createAsyncThunk( 'common/getAllItemTypeCm', async ( data ) => {
    const apiEndPoint = `${generalStoreApi.itemtype.root}/grid`;
    const res = await baseAxios.post( apiEndPoint, data );
    const resData = res.data.types.items;
    const info = resData.map( item => ( {
        ...item,
        label: item.name,
        value: item.id
    } ) )
        .sort( ( a, b ) => a.label.localeCompare( b.label ) )

    return info;
} )

// package types
export const getAllPackageTypeCm = createAsyncThunk( 'common/getAllPackageTypeCm', async ( data ) => {
    const apiEndPoint = `${generalStoreApi.packagetype.root}/grid`;
    const res = await baseAxios.post( apiEndPoint, data );
    const resData = res.data.types.items;
    const info = resData.map( pac => ( {
        ...pac,
        label: pac.name,
        value: pac.id
    } ) )
        .sort( ( a, b ) => a.label.localeCompare( b.label ) )

    return info;
} )

// all category
export const getAllCategoryCm = createAsyncThunk( 'common/getAllCategoryCm', async () => {
    const apiEndPoint = `${generalStoreApi.categories.root}?Page=1&PageSize=10000000`;
    const res = await baseAxios.get( apiEndPoint );
    const data = res.data.categories.items;
    const info = data
        .map( category => ( {
            ...category,
            label: category.name,
            value: category.id
        } ) )
        .sort( ( a, b ) => a.label.localeCompare( b.label ) )
    return info;
} )

// all category Hierarchy
export const allCategoryWithHierarchyCm = createAsyncThunk( 'common/allCategoryWithHierarchyCm', async () => {
    const apiEndPoint = `${generalStoreApi.categories.root}/Hieararchy`;
    const res = await baseAxios.get( apiEndPoint );
    const data = res.data.categories;
    const info = data
        .map( category => ( {
            ...category,
            label: category.category,
            value: category.id
        } ) )
        .sort( ( a, b ) => a.label.localeCompare( b.label ) )
    return info;
} )

// all category only for items creation and updates
export const getAllCategoryForItem = createAsyncThunk( 'common/getAllCategoryForItem', async () => {
    const apiEndPoint = `${generalStoreApi.categories.itemCategories}`;
    const res = await baseAxios.get( apiEndPoint );
    const data = res.data.categories;
    const info = data
        .map( category => ( {
            ...category,
            label: category.category,
            value: category.id
        } ) )
        .sort( ( a, b ) => a.label.localeCompare( b.label ) )
    return info;
} )

// all items
export const getAllItemsCm = createAsyncThunk( 'common/getAllItemsCm', async () => {
    const apiEndPoint = `${generalStoreApi.items.root}?Page=1&PageSize=10000000`;
    const res = await baseAxios.get( apiEndPoint );
    const data = res.data.items.items
    const info = data
        .map( item => ( {
            ...item,
            label: item.description,
            value: item.id
        } ) )
        .sort( ( a, b ) => a.label.localeCompare( b.label ) )
    return info;
} )

// all segments
export const getAllSegmentCm = createAsyncThunk( 'common/getAllSegmentCm', async ( data ) => {
    const apiEndPoint = `${generalStoreApi.segment.root}/grid`;
    const res = await baseAxios.post( apiEndPoint, data );
    const resData = res.data.segments.items;
    const info = resData
        .map( segment => ( {
            ...segment,
            label: segment.name,
            value: segment.id
        } ) )
        .sort( ( a, b ) => a.label.localeCompare( b.label ) )
    return info;
} )


// all segments values
export const getSegmentValuesCm = createAsyncThunk( 'common/getSegmentValuesCm', async ( id ) => {
    const apiEndPoint = `${generalStoreApi.segment.root}/${id}`;
    const res = await baseAxios.get( apiEndPoint );
    const resData = res.data?.segment?.values
    const info = resData
        .map( segment => ( {
            ...segment,
            label: segment.value,
            value: segment.id
        } ) )
        .sort( ( a, b ) => a.label.localeCompare( b.label ) )
    return info;
} )

// all zone
export const getAllZoneCm = createAsyncThunk( 'common/getAllZoneCm', async () => {
    const apiEndPoint = `${generalStoreApi.zones.root}?Page=1&PageSize=5000000`;
    const res = await baseAxios.get( apiEndPoint );
    const data = res.data.zones.items
    const info = data
        .map( zone => ( {
            ...zone,
            label: zone.name,
            value: zone.id
        } ) )
        .sort( ( a, b ) => a.label.localeCompare( b.label ) )
    return info;
} )

// all units
export const getAllUnitCm = createAsyncThunk( 'common/getAllUnitCm', async () => {
    const apiEndPoint = `${generalStoreApi.units.root}/UOMS`;
    const res = await baseAxios.get( apiEndPoint );
    const data = res.data.uoM
    const info = data
        .map( unit => ( {
            ...unit,
            label: unit.name,
            value: unit.id
        } ) )
        .sort( ( a, b ) => a.label.localeCompare( b.label ) )
    return info;
} )


// all Warehouse
export const getAllWarehouseCm = createAsyncThunk( 'common/getAllWarehouseCm', async () => {
    const apiEndPoint = `${generalStoreApi.warehouse.root}?Page=1&PageSize=5000000`;
    const res = await baseAxios.get( apiEndPoint );
    const data = res.data.warehouses.items;
    const info = data
        .map( warehouse => ( {
            ...warehouse,
            label: warehouse.name,
            value: warehouse.id
        } ) )
        .sort( ( a, b ) => a.label.localeCompare( b.label ) )
    return info;
} )

// all brands
export const getAllBrandCm = createAsyncThunk( 'common/getAllBrandCm', async () => {
    const apiEndPoint = `${generalStoreApi.brands.root}?Page=1&PageSize=5000000`;
    const res = await baseAxios.get( apiEndPoint );
    const data = res.data.brands.items;
    const info = data
        .map( brand => ( {
            ...brand,
            label: brand.name,
            value: brand.id
        } ) )
        .sort( ( a, b ) => a.label.localeCompare( b.label ) )
    return info;
} )


// all Currencies
export const getAllCurrencyCm = createAsyncThunk( 'common/getAllCurrencyCm', async () => {
    const apiEndPoint = `${generalStoreApi.currency.root}?Page=1&PageSize=5000000`;
    const res = await baseAxios.get( apiEndPoint );
    const data = res.data.currencies.items;
    const info = data
        .map( currency => ( {
            ...currency,
            label: currency.name,
            value: currency.id
        } ) )
        .sort( ( a, b ) => a.label.localeCompare( b.label ) )
    return info;
} )


//get all countries
export const getAllCountriesCm = createAsyncThunk( 'common/getAllCountriesCm', async () => {
    const apiEndPoint = `${generalStoreApi.countries.root}?Page=1&PageSize=500`;
    const res = await baseAxios.get( apiEndPoint );
    const data = res.data.countries.items
    const info = data
        .map( country => ( {
            ...country,
            label: country.name,
            value: country.id
        } ) )
        .sort( ( a, b ) => a.label.localeCompare( b.label ) )
    return info;
} )

// get all buyers
export const getAllBuyersCm = createAsyncThunk( 'common/getAllBuyersCm', async ( data ) => {
    const apiEndPoint = `${generalStoreApi.buyers.root}/grid`;
    const res = await baseAxios.post( apiEndPoint, data );
    const resData = res.data.data.items;
    const info = resData
        .map( buyer => ( {
            ...buyer,
            label: buyer.name,
            value: buyer.id
        } ) )
        .sort( ( a, b ) => a.label.localeCompare( b.label ) )
    return info;
} )

// get banks
export const getAllBanksCm = createAsyncThunk( 'common/getAllBanksCm', async ( data ) => {
    const apiEndPoint = `${generalStoreApi.banks.root}/grid`;
    const res = await baseAxios.post( apiEndPoint, data );
    const resData = res.data.banks.items;
    const info = resData
        .map( bank => ( {
            ...bank,
            label: bank.bankName,
            value: bank.id
        } ) )
        .sort( ( a, b ) => a.label.localeCompare( b.label ) )
    return info;
} )

// get all costing heads
export const getAllCostingHeadCm = createAsyncThunk( 'common/getAllCostingHeadCm', async ( data ) => {
    const apiEndPoint = `${generalStoreApi.costingHead.root}/grid`;
    const res = await baseAxios.post( apiEndPoint, data );
    const resData = res.data.costingHeads.items;
    const info = resData
        .map( item => ( {
            ...item,
            label: item.name,
            value: item.id
        } ) )
        .sort( ( a, b ) => a.label.localeCompare( b.label ) )
    return info;
} )

// get all SC
export const getAllScCm = createAsyncThunk( 'common/getAllScCm', async ( data ) => {
    const apiEndPoint = `${generalStoreApi.sc.root}/grid`;
    const res = await baseAxios.post( apiEndPoint, data );
    const resData = res.data.salesContracts.items;
    const info = resData
        .map( item => ( {
            ...item,
            label: item.salesContractCode,
            value: item.id
        } ) )
        .sort( ( a, b ) => a.label.localeCompare( b.label ) )
    return info;
} )


// get all CI
export const getAllCiCm = createAsyncThunk( 'common/getAllCiCm', async ( data ) => {
    const apiEndPoint = `${generalStoreApi.ci.root}/grid`;
    const res = await baseAxios.post( apiEndPoint, data );
    const resData = res.data.cIs.items;
    const info = resData
        .map( item => ( {
            ...item,
            label: item.ciCode,
            value: item.id
        } ) )
        .sort( ( a, b ) => a.label.localeCompare( b.label ) )
    return info;
} )


export const commonSlice = createSlice( {
    name: 'common',
    initialState: {
        itemCategories: [],
        categoryDataCm: [],
        segmentDataCm: [],
        brandDataCm: [],
        categoryHierarchyCm: [],
        unitDataCm: [],
        itemsDataCm: [],
        zoneDataCm: [],
        customerDataCm: [],
        supplierDataCm: [],
        representativeDataCm: [],
        currencyDataCm: [],
        warehouseDataCm: [],
        itemTypeDataCm: [],
        packageTypeDataCm: [],
        segmentValuesCm: [],
        countriesData: [],
        buyersDataCm: [],
        banksDataCm: [],
        scDataCm: [],
        ciDataCm: [],
        costingHeadDataCm: [],
        dropDownCategorySegmentCm: [],
        isDropDownCategorySegmentLoadedCm: true,
        menuCollapsedCm: false,
        loading: false,
        error: null
    },
    reducers: {
        visibilityAction: ( state, action ) => {
            state.menuCollapsedCm = action.payload
        }
    },
    extraReducers: builder => {
        builder
            .addCase( getAllCategoryForItem.fulfilled, ( state, action ) => {
                state.itemCategories = action.payload
            } )
            .addCase( getAllCategoryCm.fulfilled, ( state, action ) => {
                state.categoryDataCm = action.payload
            } )
            .addCase( allCategoryWithHierarchyCm.fulfilled, ( state, action ) => {
                state.categoryHierarchyCm = action.payload
            } )
            .addCase( getAllItemsCm.fulfilled, ( state, action ) => {
                state.itemsDataCm = action.payload
            } )
            .addCase( getAllZoneCm.fulfilled, ( state, action ) => {
                state.zoneDataCm = action.payload
            } )
            .addCase( getAllUnitCm.fulfilled, ( state, action ) => {
                state.unitDataCm = action.payload
            } )
            .addCase( getAllBrandCm.fulfilled, ( state, action ) => {
                state.brandDataCm = action.payload
            } )
            .addCase( getAllCustomerCm.fulfilled, ( state, action ) => {
                state.customerDataCm = action.payload
            } )
            .addCase( getAllSupplierCm.fulfilled, ( state, action ) => {
                state.supplierDataCm = action.payload
            } )
            .addCase( getAllItemTypeCm.fulfilled, ( state, action ) => {
                state.itemTypeDataCm = action.payload
            } )
            .addCase( getAllPackageTypeCm.fulfilled, ( state, action ) => {
                state.packageTypeDataCm = action.payload
            } )
            .addCase( getAllCountriesCm.fulfilled, ( state, action ) => {
                state.countriesData = action.payload
            } )
            .addCase( getAllSegmentCm.fulfilled, ( state, action ) => {
                state.segmentDataCm = action.payload
            } )
            .addCase( getAllWarehouseCm.fulfilled, ( state, action ) => {
                state.warehouseDataCm = action.payload
            } )
            .addCase( getAllCurrencyCm.fulfilled, ( state, action ) => {
                state.currencyDataCm = action.payload
            } )
            .addCase( getSegmentValuesCm.fulfilled, ( state, action ) => {
                state.segmentValuesCm = action.payload
            } )
            .addCase( getAllBuyersCm.fulfilled, ( state, action ) => {
                state.buyersDataCm = action.payload
            } )
            .addCase( getAllBanksCm.fulfilled, ( state, action ) => {
                state.banksDataCm = action.payload
            } )
            .addCase( getAllCostingHeadCm.fulfilled, ( state, action ) => {
                state.costingHeadDataCm = action.payload
            } )
            .addCase( getAllScCm.fulfilled, ( state, action ) => {
                state.scDataCm = action.payload
            } )
            .addCase( getAllCiCm.fulfilled, ( state, action ) => {
                state.ciDataCm = action.payload
            } )
            .addCase( getAllRepresentativeCm.fulfilled, ( state, action ) => {
                state.representativeDataCm = action.payload
            } )
    }
} );

export const { visibilityAction } = commonSlice.actions

export default commonSlice.reducer;