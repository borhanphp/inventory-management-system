import { lazy } from 'react';

const Profile = lazy( () => import( '../../views/pages/profile' ) );
const Error = lazy( () => import( '../../views/pages/misc/Error' ) );
const NotAuthorized = lazy( () => import( '../../views/pages/misc/NotAuthorized' ) );
const DashboardEcommerce = lazy( () => import( '../../views/dashboard/ecommerce' ) );

const PagesRoutes = [
  {
    path: '/pages/profile',
    element: <Profile />
  },
  {
    path: '/',
    element: <DashboardEcommerce />,
  },
  {
    path: '/misc/error',
    element: <Error />,
    meta: {
      publicRoute: true,
      layout: 'blank'
    }
  }
];

export default PagesRoutes;
