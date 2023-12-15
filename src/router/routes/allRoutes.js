import { lazy } from 'react';
import { Navigate } from 'react-router-dom';


// user routes
const UserList = lazy( () => import( '../../views/user-management/list' ) );
const UserView = lazy( () => import( '../../views/user-management/details' ) );

// item
const ItemList = lazy( () => import( '../../views/catalogue/item/list' ) );
const ItemDetails = lazy( () => import( '../../views/catalogue/item/details' ) );
const ItemForm = lazy( () => import( '../../views/catalogue/item/form' ) );
const ItemEditForm = lazy( () => import( '../../views/catalogue/item/form/ItemEditForm' ) );

// segments
const SegmentList = lazy( () => import( '../../views/catalogue/segment/list' ) );
const SegmentForm = lazy( () => import( '../../views/catalogue/segment/form' ) );
const SegmentEditForm = lazy( () => import( '../../views/catalogue/segment/form/SegmentEditForm' ) );


//category
const CategoryList = lazy( () => import( '../../views/catalogue/category/list' ) );

// brand
const BrandList = lazy( () => import( '../../views/catalogue/brand/list' ) );

// zone
const ZoneList = lazy( () => import( '../../views/catalogue/zone/list' ) );

//area
const AreaList = lazy( () => import( '../../views/configuration/area/list' ) )

// package type
const PackageType = lazy( () => import( '../../views/catalogue/packagetype/list' ) );

// item type
const ItemType = lazy( () => import( '../../views/catalogue/itemtype/list' ) );

// units
const UnitList = lazy( () => import( '../../views/catalogue/units/list' ) );
const AssignUnit = lazy( () => import( '../../views/catalogue/units/asign-unit' ) );

// sales
const AllSales = lazy( () => import( '../../views/sales/pos/list/AllSales' ) );
const Invoice = lazy( () => import( '../../views/sales/pos/details' ) );


// partner
const PartnerList = lazy( () => import( '../../views/configuration/partner/list' ) );
const PartnerForm = lazy( () => import( '../../views/configuration/partner/form' ) );
const EditPartnerForm = lazy( () => import( '../../views/configuration/partner/form/EditForm' ) );
const PartnerDetails = lazy( () => import( '../../views/configuration/partner/details' ) );

// customer
const CustomerList = lazy( () => import( '../../views/sales/customer/list' ) );
const CustomerForm = lazy( () => import( '../../views/sales/customer/form' ) );
const CustomerEditForm = lazy( () => import( '../../views/sales/customer/form/CustomerEditForm' ) );
const CustomerDetails = lazy( () => import( '../../views/sales/customer/details' ) );

// warehouse
const Warehouse = lazy( () => import( '../../views/configuration/warehouse/list' ) );

// banks
const Bank = lazy( () => import( '../../views/configuration/banks/list' ) );


// Costing Head
const CostingHead = lazy( () => import( '../../views/configuration/cost-head/list' ) );

// SC Costings
const ScCosting = lazy( () => import( '../../views/configuration/sc-costing/list' ) );

// SC Payments
const ScPayment = lazy( () => import( '../../views/configuration/sc-payments/list' ) );

// SC Adjustments
const ScAdjustment = lazy( () => import( '../../views/configuration/sc-adjustment/list' ) );

// banks
const BuyerConsignee = lazy( () => import( '../../views/configuration/buyer_consignee/list' ) );

// currency
const Currency = lazy( () => import( '../../views/configuration/currency/list' ) );

// tenants
const TenantsList = lazy( () => import( '../../views/tenants/list' ) );

// purchase
const PurchaseList = lazy( () => import( '../../views/purchasing/purchase/list' ) );
const PurchaseForm = lazy( () => import( '../../views/purchasing/purchase/form' ) );
const EditPurchase = lazy( () => import( '../../views/purchasing/purchase/form/EditPurchase' ) );
const PurchaseDetails = lazy( () => import( '../../views/purchasing/purchase/details' ) );


// instant purchase
const InstantPurchaseList = lazy( () => import( '../../views/purchasing/instant-purchase/list' ) );
const InstantPurchaseDetails = lazy( () => import( '../../views/purchasing/instant-purchase/details' ) );

// instant sales
const InstantSalesList = lazy( () => import( '../../views/sales/quick-sale/list' ) );
const InstantSalesDetails = lazy( () => import( '../../views/sales/quick-sale/details' ) );

// local purchase
const LocalPurchaseList = lazy( () => import( '../../views/purchasing/local-purchase/list' ) );
const LocalPurchaseForm = lazy( () => import( '../../views/purchasing/local-purchase/form' ) );
const EditLocalPurchase = lazy( () => import( '../../views/purchasing/local-purchase/form/EditLocalPurchase' ) );
const LocalPurchaseDetails = lazy( () => import( '../../views/purchasing/local-purchase/details' ) );
const LocalApproval = lazy( () => import( '../../views/purchasing/local-purchase-approval/form' ) );



// SC / LC
const CreateSc = lazy( () => import( '../../views/purchasing/sc-lc/form/CreateSc' ) );
const ScList = lazy( () => import( '../../views/purchasing/sc-lc/list' ) );
const ScDetails = lazy( () => import( '../../views/purchasing/sc-lc/details' ) );
const ScEdit = lazy( () => import( '../../views/purchasing/sc-lc/form/EditSc' ) );

// CI
const CreateCi = lazy( () => import( '../../views/purchasing/ci/form' ) );
const CiList = lazy( () => import( '../../views/purchasing/ci/list' ) );
const CiDetails = lazy( () => import( '../../views/purchasing/ci/details' ) );
const CiEdit = lazy( () => import( '../../views/purchasing/ci/form/EditCi' ) );

// PI
const CreatePi = lazy( () => import( '../../views/purchasing/pi/form' ) );
const PiList = lazy( () => import( '../../views/purchasing/pi/list' ) );
const PiDetails = lazy( () => import( '../../views/purchasing/pi/details' ) );
const PiEdit = lazy( () => import( '../../views/purchasing/pi/form/EditPi' ) );

// receivings
const ReceivingList = lazy( () => import( '../../views/purchasing/goodsreceiving/list' ) );
const ReceivingForm = lazy( () => import( '../../views/purchasing/goodsreceiving/form' ) );
const EditReceiving = lazy( () => import( '../../views/purchasing/goodsreceiving/form/EditReceiving' ) );
const ReceivingDetails = lazy( () => import( '../../views/purchasing/goodsreceiving/details' ) );
const ReceiveApproval = lazy( () => import( '../../views/purchasing/receive-approval/form' ) );

// item requisitions
const ItemRequisition = lazy( () => import( '../../views/inventory/requisition/form' ) );
const RequisitionList = lazy( () => import( '../../views/inventory/requisition/list' ) );
const EditRequisitionForm = lazy( () => import( '../../views/inventory/requisition/form/EditRequisition' ) );

// managing central requisitions
const CentralRequisitionList = lazy( () => import( '../../views/inventory/center-requisition/list' ) );
const CentralRequisitionDetails = lazy( () => import( '../../views/inventory/center-requisition/details' ) );
const CentralRequisitionApproval = lazy( () => import( '../../views/inventory/center-requisition/form/ApprovalForm' ) );


const allRoutes = [
  {
    element: <UserList />,
    path: '/user/list'
  },
  {
    path: '/user/view',
    element: <Navigate to='/user/view/1' />
  },
  {
    element: <UserView />,
    path: '/user/view/:id'
  },
  {
    element: <ItemList />,
    path: '/catalogue/item/list'
  },
  {
    element: <ItemDetails />,
    path: '/item-details'
  },
  {
    element: <ItemForm />,
    path: '/add-item'
  },
  {
    element: <ItemEditForm />,
    path: '/edit-item'
  },
  {
    element: <SegmentList />,
    path: '/catalogue/segment/list'
  },
  {
    element: <SegmentForm />,
    path: '/segment-add'
  },
  {
    element: <SegmentEditForm />,
    path: '/segment-edit'
  },
  {
    element: <CategoryList />,
    path: '/catalogue/category/list'
  },
  {
    element: <UnitList />,
    path: '/catalogue/units/list'
  },
  {
    element: <AssignUnit />,
    path: '/catalogue/units/asign-unit'
  },
  {
    element: <BrandList />,
    path: '/catalogue/brand/list'
  },
  {
    element: <ZoneList />,
    path: '/catalogue/zone/list'
  },
  {
    element: <AreaList />,
    path: '/configurations/area/list'
  },

  {
    element: <PartnerList />,
    path: '/partner-list'
  },
  {
    element: <PartnerForm />,
    path: '/add-new-partner'
  },

  {
    element: <EditPartnerForm />,
    path: '/edit-partner-form'
  },
  {
    element: <PartnerDetails />,
    path: '/partner-details'
  },
  {
    element: <CustomerList />,
    path: '/sales/customer/list'
  },
  {
    element: <CustomerForm />,
    path: '/addnewcustomer'
  },
  {
    element: <CustomerEditForm />,
    path: '/editcustomer'
  },
  {
    element: <CustomerDetails />,
    path: '/catelogue/sales/customer-details'
  },
  {
    element: <AllSales />,
    path: '/sales/all-sales'
  },
  {
    element: <Invoice />,
    path: '/sales-invoice'
  },
  {
    element: <Warehouse />,
    path: '/warehouse-list'
  },
  {
    element: <Currency />,
    path: '/currency-list'
  },
  {
    element: <TenantsList />,
    path: '/tenants/list'
  },
  {
    element: <PurchaseList />,
    path: '/purchase-list'
  },
  {
    element: <PurchaseForm />,
    path: '/add-purchase'
  },
  {
    element: <EditPurchase />,
    path: '/edit-purchase'
  },
  {
    element: <PurchaseDetails />,
    path: '/purchase-details'
  },
  {
    element: <LocalPurchaseList />,
    path: '/local-purchase-list'
  },
  {
    element: <LocalPurchaseForm />,
    path: '/add-local-purchase'
  },
  {
    element: <EditLocalPurchase />,
    path: '/edit-local-purchase'
  },
  {
    element: <LocalPurchaseDetails />,
    path: '/local-purchase-details'
  },
  {
    element: <LocalApproval />,
    path: '/local-approval'
  },
  {
    element: <ReceivingList />,
    path: '/receiving-list'
  },
  {
    element: <ReceivingForm />,
    path: '/add-receiving'
  },
  {
    element: <EditReceiving />,
    path: '/edit-receiving'
  },
  {
    element: <ReceivingDetails />,
    path: '/receiving-details'
  },
  {
    element: <ReceiveApproval />,
    path: '/receive-approval'
  },
  {
    element: <ItemType />,
    path: '/item-type-list'
  },
  {
    element: <PackageType />,
    path: '/package-type-list'
  },
  {
    element: <CreateSc />,
    path: '/create-sc'
  },
  {
    element: <ScList />,
    path: '/sc-lc-list'
  },
  {
    element: <ScDetails />,
    path: '/sc-details'
  },
  {
    element: <ScEdit />,
    path: '/edit-sc'
  },
  {
    element: <CreateCi />,
    path: '/create-ci'
  },
  {
    element: <CiList />,
    path: '/ci-list'
  },
  {
    element: <CiDetails />,
    path: '/ci-details'
  },
  {
    element: <CiEdit />,
    path: '/edit-ci'
  },
  {
    element: <PiList />,
    path: '/pi-list'
  },
  {
    element: <CreatePi />,
    path: '/create-pi'
  },
  {
    element: <PiDetails />,
    path: '/pi-details'
  },
  {
    element: <PiEdit />,
    path: '/pi-edit'
  },
  {
    element: <ItemRequisition />,
    path: '/item-requisition'
  },
  {
    element: <RequisitionList />,
    path: '/item-requisition-list'
  },
  {
    element: <EditRequisitionForm />,
    path: '/item-requisition-edit'
  },
  {
    element: <CentralRequisitionList />,
    path: '/central-requisition'
  },
  {
    element: <CentralRequisitionDetails />,
    path: '/central-requisition-details'
  },
  {
    element: <CentralRequisitionApproval />,
    path: '/central-requisition-approval'
  },
  {
    element: <Bank />,
    path: '/bank-list'
  },
  {
    element: <BuyerConsignee />,
    path: '/buyer-consignee'
  },
  {
    element: <CostingHead />,
    path: '/costing-head'
  },
  {
    element: <ScCosting />,
    path: '/sc-costings'
  },
  {
    element: <ScPayment />,
    path: '/sc-payments'
  },
  {
    element: <ScAdjustment />,
    path: '/sc-adjustment'
  },
  {
    element: <InstantPurchaseList />,
    path: '/instant-purchase-list'
  },
  {
    element: <InstantPurchaseDetails />,
    path: '/instant-purchase-details'
  },
  {
    element: <InstantSalesList />,
    path: '/instant-sales-list'
  },
  {
    element: <InstantSalesDetails />,
    path: '/instant-sales-details'
  }
];

export default allRoutes;
