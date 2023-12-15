// ** Icons Import
import { Aperture, Circle, Grid, Layers, Package, ShoppingBag } from 'react-feather';

export default [
  // {
  //   id: 'roles-permissions',
  //   title: 'Roles & Permissions',
  //   icon: <Shield size={20} />,
  //   children: [
  //     {
  //       id: 'roles',
  //       title: 'Roles',
  //       icon: <Circle size={12} />,
  //       navLink: '/apps/roles'
  //     },
  //     {
  //       id: 'permissions',
  //       title: 'Permissions',
  //       icon: <Circle size={12} />,
  //       navLink: '/apps/permissions'
  //     }
  //   ]
  // },
  {
    id: 'configuration',
    title: 'Configurations',
    icon: <Layers size={20} />,
    children: [
      {
        id: 'list',
        title: 'Users & Roles',
        icon: <Circle size={12} />,
        navLink: '/user/list'
      },
      {
        id: 'partner',
        title: 'Partners',
        icon: <Circle size={12} />,
        navLink: '/partner-list'
      },
      {
        id: 'warehouse',
        title: 'Warehouse',
        icon: <Circle size={12} />,
        navLink: '/warehouse-list'
      },
      {
        id: 'currency',
        title: 'Currency Setup',
        icon: <Circle size={12} />,
        navLink: '/currency-list'
      },
      {
        id: 'zone',
        title: 'Zone',
        icon: <Circle size={12} />,
        navLink: '/catalogue/zone/list'
      },
      {
        id: 'area',
        title: 'Area',
        icon: <Circle size={12} />,
        navLink: '/configurations/area/list'
      },
      {
        id: 'bank-list',
        title: 'Banks',
        icon: <Circle size={12} />,
        navLink: '/bank-list'
      },
      {
        id: 'buyer-consignee',
        title: 'Consignee',
        icon: <Circle size={12} />,
        navLink: '/buyer-consignee'
      },
      {
        id: 'costing-head',
        title: 'Costing Head',
        icon: <Circle size={12} />,
        navLink: '/costing-head'
      }

    ]
  },

  {
    id: 'inventory',
    title: 'Inventory',
    icon: <Aperture size={20} />,
    children: [
      {
        id: 'catalog',
        title: 'Item Catalog',
        icon: <Circle size={20} />,
        children: [
          {
            id: 'brand',
            title: 'Brands',
            icon: <Circle size={12} />,
            navLink: '/catalogue/brand/list'
          },
          {
            id: 'category',
            title: 'Categories',
            icon: <Circle size={12} />,
            navLink: '/catalogue/category/list'
          },
          {
            id: 'item',
            title: 'Items',
            icon: <Circle size={12} />,
            navLink: '/catalogue/item/list'
          },
          {
            id: 'item-type',
            title: 'Item Types',
            icon: <Circle size={12} />,
            navLink: '/item-type-list'
          },
          {
            id: 'segment',
            title: 'Item Variants',
            icon: <Circle size={12} />,
            navLink: '/catalogue/segment/list'
          },
          {
            id: 'package-type',
            title: 'Package Types',
            icon: <Circle size={12} />,
            navLink: '/package-type-list'
          },
          {
            id: 'units',
            title: 'Unit Set',
            icon: <Circle size={12} />,
            navLink: '/catalogue/units/list'
          },
        ]
      },
      {
        id: 'mrr',
        title: 'MRR / GRN Entry',
        icon: <Circle size={20} />,
        navLink: '/receiving-list'
      },

      {
        id: 'receive-approval',
        title: 'Receive Approval',
        icon: <Circle size={12} />,
        navLink: '/receive-approval'
      },
      {
        id: 'warehouses',
        title: 'Warehouses',
        icon: <Circle size={20} />,
        children: [
          {
            id: 'item-requisition',
            title: "Transfer Req...",
            icon: <Circle size={12} />,
            navLink: '/item-requisition-list'
          },
          {
            id: 'central-requisition',
            title: 'Approve Req...',
            icon: <Circle size={12} />,
            navLink: '/central-requisition'
          }
        ]
      },
      // {
      //   id: 'stock-adjustment',
      //   title: 'Stock Adjustment',
      //   icon: <Circle size={12} />,
      //   navLink: '/#'
      // },
      // {
      //   id: 'price-adjustment',
      //   title: 'Price Adjustment',
      //   icon: <Circle size={12} />,
      //   navLink: '/#'
      // },
    ]
  },

  {
    id: 'purchasee',
    title: 'Purchase',
    icon: <Grid size={20} />,
    children: [
      {
        id: 'purchase',
        title: 'Import',
        icon: <Circle size={20} />,
        children: [
          {
            id: 'purchase-order',
            title: 'Purchase Order',
            icon: <Circle size={12} />,
            navLink: '/purchase-list'
          },
          {
            id: 'sc',
            title: 'Sales Contract',
            icon: <Circle size={12} />,
            navLink: '/sc-lc-list'
          },
          {
            id: 'pi',
            title: `Proforma Inv...`,
            icon: <Circle size={12} />,
            navLink: '/pi-list'
          },
          {
            id: 'ci',
            title: 'Com. Invoice',
            icon: <Circle size={12} />,
            navLink: '/ci-list'
          },
          {
            id: 'sc-costing',
            title: 'Expenses',
            icon: <Circle size={12} />,
            navLink: '/sc-costings'
          },
          {
            id: 'sc-payment',
            title: 'Payments',
            icon: <Circle size={12} />,
            navLink: '/sc-payments'
          },
          {
            id: 'sc-adjustment',
            title: 'Adjustments',
            icon: <Circle size={12} />,
            navLink: '/sc-adjustment'
          },
          // {
          //   id: 'item-receive',
          //   title: 'Item Receive',
          //   icon: <Circle size={12} />,
          //   navLink: '/receiving-list'
          // },
          // {
          //   id: 'receive-approval',
          //   title: 'Receive Approval',
          //   icon: <Circle size={12} />,
          //   navLink: '/receive-approval'
          // }
        ]
      },
      {
        id: 'local-purchase',
        title: 'Local Purchase',
        icon: <Circle size={20} />,
        children: [
          {
            id: 'purchase-invoice',
            title: 'Purchase Inv...',
            icon: <Circle size={12} />,
            navLink: '/local-purchase-list'
          },
          {
            id: 'local-approval',
            title: 'Invoice approval',
            icon: <Circle size={12} />,
            navLink: '/local-approval'
          }
        ]
      },
      {
        id: 'instant-purchase',
        title: 'Instant Purchase',
        icon: <Circle size={12} />,
        navLink: '/instant-purchase-list'
      },
    ]
  },
  {
    id: 'sales',
    title: 'Sales ',
    icon: <Package size={20} />,
    children: [
      {
        id: 'pos',
        title: 'Sales Point',
        icon: <Circle size={12} />,
        navLink: '/sales/pos/list'
      },
      {
        id: 'allsales',
        title: 'All Sales',
        icon: <Circle size={12} />,
        navLink: '/sales/all-sales'
      },
      {
        id: 'installSales',
        title: 'Q-Sales',
        icon: <Circle size={12} />,
        navLink: '/instant-sales-list'
      },

    ]
  },
  {
    id: 'eshop',
    title: 'E-Shop',
    icon: <ShoppingBag size={20} />,
    children: [
      {
        id: 'featured-category',
        title: 'Featured Category',
        icon: <Circle size={12} />,
        navLink: '/featured-category-list'
      },
      {
        id: 'offered-item',
        title: 'Offered Item',
        icon: <Circle size={12} />,
        navLink: '/offered-item-form'
      },
      {
        id: 'orders-list',
        title: 'Manage Orders',
        icon: <Circle size={12} />,
        navLink: '/orders-list'
      }
    ]
  }
];
