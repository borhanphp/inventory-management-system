import { lazy } from 'react';


// featured category routes
const FeaturedCategoryList = lazy( () => import( '../../views/eshop/featured-category/list' ) );

// offered item routes
const OfferedItemForm = lazy( () => import( '../../views/eshop/offered-item/form' ) );

// orders management routes
const OrdersList = lazy( () => import( '../../views/eshop/order-management/list' ) );
const OrdersDetails = lazy( () => import( '../../views/eshop/order-management/details' ) );



const eshopRoutes = [
    {
        element: <FeaturedCategoryList />,
        path: '/featured-category-list'
    },
    {
        element: <OfferedItemForm />,
        path: '/offered-item-form'
    },
    {
        element: <OrdersList />,
        path: '/orders-list'
    },
    {
        element: <OrdersDetails />,
        path: '/order-details'
    }
];

export default eshopRoutes;