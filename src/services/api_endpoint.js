import "dotenv";
// export const API = "http://192.168.0.9:81"
// export const API = "http://192.168.0.9:83"
export const API = "http://qtgenstore-001-site2.mysitepanel.net"


export const generalStoreApi = {
    brands: {
        root: `${API}/api/v1/catalogs/brands`
    },
    segment: {
        root: `${API}/api/v1/catalogs/segments`
    },
    items: {
        root: `${API}/api/v1/catalogs/items`
    },
    zones: {
        root: `${API}/api/v1/catalogs/zones`
    },
    area: {
        root: `${API}/api/v1/catalogs/area`
    },
    units: {
        root: `${API}/api/v1/catalogs/units`
    },
    categories: {
        root: `${API}/api/v1/catalogs/categories`,
        itemCategories: `${API}/api/v1/catalogs/categories/hieararchy/category`
    },
    sales: {
        root: `${API}/api/v1/sales/sales`,
        referenceNo: `${API}/api/v1/sales/sales/reference-no`
    },
    warehouse: {
        root: `${API}/api/v1/catalogs/warehouses`
    },
    supplier: {
        root: `${API}/api/v1/catalogs/suppliers`
    },
    customer: {
        root: `${API}/api/v1/catalogs/customers`
    },
    userByEmail: {
        root: `${API}/api/v1/catalogs/customers`
    },
    userLogin: {
        root: `${API}/api/v1/identity/login`
    },
    users: {
        root: `${API}/api/v1/identity/users`
    },
    purchase: {
        root: `${API}/api/v1/purchase/purchases`
    },
    currency: {
        root: `${API}/api/v1/app/currencies`
    },
    receivings: {
        root: `${API}/api/v1/purchase/receivings`
    },
    approving: {
        root: `${API}/api/v1/purchase/approving`
    },
    tenants: {
        root: `${API}/api/v1/identity/tenants`
    },
    countries: {
        root: `${API}/api/v1/catalogs/countries`
    },
    itemtype: {
        root: `${API}/api/v1/catalogs/item-type`
    },
    packagetype: {
        root: `${API}/api/v1/catalogs/package-type`
    },
    requisition: {
        root: `${API}/api/v1/catalogs/requisitions`
    },
    warehouseTransfer: {
        root: `${API}/api/v1/catalogs/warehouse-transfer`
    },
    banks: {
        root: `${API}/api/v1/app/banks`
    },
    buyers: {
        root: `${API}/api/v1/purchase/buyers-consignees`
    },
    sc: {
        root: `${API}/api/v1/purchase/sales-contract`
    },
    pi: {
        root: `${API}/api/v1/purchase/proforma-invoices`
    },
    ci: {
        root: `${API}/api/v1/purchase/commercial-invoices`
    },
    costingHead: {
        root: `${API}/api/v1/purchase/costing-heads`
    },
    scCostings: {
        root: `${API}/api/v1/purchase/sc-costings`
    },
    scPayments: {
        root: `${API}/api/v1/purchase/sc-payments`
    },
    scAdjustments: {
        root: `${API}/api/v1/purchase/sc-adjustment`
    },
    partner: {
        root: `${API}/api/v1/catalogs/partners`
    },
    localPurchase: {
        root: `${API}/api/v1/purchase/purchase-invoices`
    },
    instantPurchase: {
        root: `${API}/api/v1/purchase/instant-purchases`
    },
    instantSale: {
        root: `${API}/api/v1/sales/instant-sales`
    }
};

export const eshop = {
    featuredCategory: {
        root: `${API}/api/v1/eshop/settings/featured-categories`
    },
    offeredItems: {
        root: `${API}/api/v1/eshop/settings/offered-items`
    },
    ordersItems: {
        root: `${API}/api/v1/eshop/order`
    }
}