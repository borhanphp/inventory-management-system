// ** Router imports
// ** Hooks Imports
import { useLayout } from '@hooks/useLayout';
// ** Layouts
import BlankLayout from '@layouts/BlankLayout';
import { lazy } from 'react';
// ** Router imports
import { Navigate, useRoutes } from 'react-router-dom';
// ** Utils
import { getHomeRouteForLoggedInUser, getUserData } from '../utility/Utils';
// ** GetRoutes
import { getRoutes } from './routes';


// ** Components
const Error = lazy( () => import( '../views/pages/misc/Error' ) );
const LoginBasic = lazy( () => import( '../views/pages/authentication/LoginBasic' ) );
const NotAuthorized = lazy( () => import( '../views/pages/misc/NotAuthorized' ) );
const PosList = lazy( () => import( '../views/sales/pos/list' ) );

const Router = () => {
  // ** Hooks
  const { layout } = useLayout();

  const allRoutes = getRoutes( layout );
  const getHomeRoute = () => {
    const user = getUserData();
    if ( user ) {
      return getHomeRouteForLoggedInUser( user.role );
    } else {
      return '/login';
    }
  };

  const routes = useRoutes( [
    {
      path: '/',
      index: true,
      element: <Navigate replace to={getHomeRoute()} />
    },
    {
      path: '/login',
      element: <BlankLayout />,
      children: [{ path: '/login', element: <LoginBasic /> }]
    },
    {
      path: '/auth/not-auth',
      element: <BlankLayout />,
      children: [{ path: '/auth/not-auth', element: <NotAuthorized /> }]
    },
    {
      path: '*',
      element: <BlankLayout />,
      children: [{ path: '*', element: <Error /> }]
    },
    {
      path: '/sales/pos/list',
      element: <BlankLayout />,
      children: [{ path: '/sales/pos/list', element: <PosList /> }]
    },
    ...allRoutes
  ] );

  return routes;
};

export default Router;
