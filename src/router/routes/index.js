// ** React Imports
import PrivateRoute from '@components/routes/PrivateRoute';
// ** Route Components
import PublicRoute from '@components/routes/PublicRoute';
// ** Layouts
import BlankLayout from '@layouts/BlankLayout';
import LayoutWrapper from '@src/@core/layouts/components/layout-wrapper';
import HorizontalLayout from '@src/layouts/HorizontalLayout';
import VerticalLayout from '@src/layouts/VerticalLayout';
// ** Utils
import { isObjEmpty } from '@utils';
import { Fragment } from 'react';
import allRoutes from './allRoutes';
// ** Routes Imports
import AppRoutes from './Apps';
import AuthenticationRoutes from './Authentication';
import DashboardRoutes from './Dashboards';
import eshopRoutes from './eshopRoutes';
import PagesRoutes from './Pages';



const getLayout = {
  blank: <BlankLayout />,
  vertical: <VerticalLayout />,
  horizontal: <HorizontalLayout />
};

// ** Document title
const TemplateTitle = '%s - Vuexy React Admin Template';

// ** Default Route
const DefaultRoute = '/dashboard/ecommerce';

// ** Merge Routes
const Routes = [
  ...AuthenticationRoutes,
  ...DashboardRoutes,
  ...AppRoutes,
  ...PagesRoutes,
  ...allRoutes,
  ...eshopRoutes
];

const getRouteMeta = route => {
  if ( isObjEmpty( route.element.props ) ) {
    if ( route.meta ) {
      return { routeMeta: route.meta };
    } else {
      return {};
    }
  }
};

// ** Return Filtered Array of Routes & Paths
const MergeLayoutRoutes = ( layout, defaultLayout ) => {
  const LayoutRoutes = [];

  if ( Routes ) {
    Routes.filter( route => {
      let isBlank = false;
      // ** Checks if Route layout or Default layout matches current layout
      if (
        ( route.meta && route.meta.layout && route.meta.layout === layout ) ||
        ( ( route.meta === undefined || route.meta.layout === undefined ) && defaultLayout === layout )
      ) {
        let RouteTag = PrivateRoute;

        // ** Check for public or private route
        if ( route.meta ) {
          route.meta.layout === 'blank' ? ( isBlank = true ) : ( isBlank = false );
          RouteTag = route.meta.publicRoute ? PublicRoute : PrivateRoute;
        }
        if ( route.element ) {
          const Wrapper =
            // eslint-disable-next-line multiline-ternary
            isObjEmpty( route.element.props ) && isBlank === false
              ? // eslint-disable-next-line multiline-ternary
              LayoutWrapper
              : Fragment;

          route.element = (
            <Wrapper {...( isBlank === false ? getRouteMeta( route ) : {} )}>
              <RouteTag route={route}>{route.element}</RouteTag>
            </Wrapper>
          );
        }

        // Push route to LayoutRoutes
        LayoutRoutes.push( route );
      }
      return LayoutRoutes;
    } );
  }
  return LayoutRoutes;
};

const getRoutes = layout => {
  const defaultLayout = layout || 'vertical';
  const layouts = ['vertical', 'horizontal', 'blank'];

  const AllRoutes = [];

  layouts.forEach( layoutItem => {
    const LayoutRoutes = MergeLayoutRoutes( layoutItem, defaultLayout );

    AllRoutes.push( {
      path: '/',
      element: getLayout[layoutItem] || getLayout[defaultLayout],
      children: LayoutRoutes
    } );
  } );
  return AllRoutes;
};

export { DefaultRoute, TemplateTitle, Routes, getRoutes };
