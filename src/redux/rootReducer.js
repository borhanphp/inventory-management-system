// ** Reducers Imports

import permissions from '@src/views/apps/roles-permissions/store';
import users from '@src/views/apps/user/store';
import pos from '@src/views/sales/pos/store';
import instantSale from '@src/views/sales/quick-sale/store';
import brands from '../views/catalogue/brand/store';
import categories from '../views/catalogue/category/store';
import items from '../views/catalogue/item/store';
import itemtypes from '../views/catalogue/itemtype/store';
import packagetypes from '../views/catalogue/packagetype/store';
import segments from '../views/catalogue/segment/store';
import suppliers from '../views/catalogue/supplier/store';
import units from '../views/catalogue/units/store';
import zones from '../views/catalogue/zone/store';
import area from '../views/configuration/area/store';
import banks from '../views/configuration/banks/store';
import buyers from '../views/configuration/buyer_consignee/store';
import costingHeads from '../views/configuration/cost-head/store';
import currencies from '../views/configuration/currency/store';
import partners from '../views/configuration/partner/store';
import scAdjustments from '../views/configuration/sc-adjustment/store';
import scCostings from '../views/configuration/sc-costing/store';
import scPayments from '../views/configuration/sc-payments/store';
import warehouses from '../views/configuration/warehouse/store';
import featuredCategories from '../views/eshop/featured-category/store';
import offeredItems from '../views/eshop/offered-item/store';
import orders from '../views/eshop/order-management/store';
import centralRequisition from '../views/inventory/center-requisition/store';
import requisitions from '../views/inventory/requisition/store';
import ci from '../views/purchasing/ci/store';
import receivings from '../views/purchasing/goodsreceiving/store';
import instantPurchase from '../views/purchasing/instant-purchase/store';
import localPurchaseApproval from '../views/purchasing/local-purchase-approval/store';
import localPurchase from '../views/purchasing/local-purchase/store';
import pi from '../views/purchasing/pi/store';
import purchase from '../views/purchasing/purchase/store';
import itemForApprove from '../views/purchasing/receive-approval/store';
import sc from '../views/purchasing/sc-lc/store';
import customers from '../views/sales/customer/store';
import posProducts from '../views/sales/pos/store/reducers';
import posReducer from '../views/sales/pos/store/reducers/posReducer';
import tenants from '../views/tenants/store';
import userReducer from '../views/user-management/store';
import auth from './authentication';
import commons from './common/store';
import layout from './layout';
import navbar from './navbar';

const rootReducer = {
  auth,
  users,
  navbar,
  layout,
  permissions,
  posProducts,
  pos,
  itemtypes,
  packagetypes,
  brands,
  segments,
  zones,
  categories,
  commons,
  currencies,
  offeredItems,
  items,
  suppliers,
  customers,
  units,
  posReducer,
  warehouses,
  userReducer,
  purchase,
  receivings,
  tenants,
  itemForApprove,
  orders,
  featuredCategories,
  requisitions,
  centralRequisition,
  banks,
  buyers,
  sc,
  pi,
  costingHeads,
  ci,
  scCostings,
  scPayments,
  scAdjustments,
  partners,
  localPurchase,
  localPurchaseApproval,
  instantPurchase,
  instantSale,
  area
};

export default rootReducer;
