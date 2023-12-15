import { randomIdGenerator } from "../../../../utility/Utils";

export const initialItemState = {
    categoryId: null,
    brandId: null,
    unitOfMeasureId: null,
    partNo: '',
    sku: '',
    purchasePrice: 0, // Number
    salesPrice: 0, // Number
    reorderPoint: 0, // Number
    vatPercentage: null, // Number
    applicableDiscount: 0, // Number
    discountPercentage: 0, // Number
    note: '',
    vat: 0,
    additionalInfo: "",
    packageTypeSizeId: null,
    isActive: true,
    statusExpiryDate: new Date(),
    manufacturedCountry: null,
    itemType: null,
    vatType: null,
    discountType: null,
    stock: 0,
    hasSegments: false,
    segments: [{ rowId: randomIdGenerator(), value: null }],
    images: [],


    itemName: "",
    hsCode: "",
    wholeSalePrice: 0,
    itemService: { label: 'Product', value: 'Product' },
    itemTypeId: 0,
    packageTypeId: 0,
    packageSizeId: null,

    isAvailableOnOutlets: true,
    showAvailableQtyOnOutlets: true,
    outOfStockMsgOutlets: "",
    isAvailableOnEcommerce: false,
    showAvailableQtyOnEcommerce: true,
    outOfStockMsgEcommerce: "",
    eshopStockPercentage: 0,
    otherCharge: 0,
    otherChargeType: "",
    otherChargePercentage: 0,
    isFeaturedInECommerce: true,
};
