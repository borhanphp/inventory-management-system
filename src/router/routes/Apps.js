// ** React Imports
import { lazy } from 'react'
import { Navigate } from 'react-router-dom'

const UserList = lazy( () => import( '../../views/apps/user/list' ) )
const Roles = lazy( () => import( '../../views/apps/roles-permissions/roles' ) )
const Permissions = lazy( () => import( '../../views/apps/roles-permissions/permissions' ) )


const InvoiceAdd = lazy( () => import( '../../views/apps/invoice/add' ) )
const InvoiceList = lazy( () => import( '../../views/apps/invoice/list' ) )
const InvoiceEdit = lazy( () => import( '../../views/apps/invoice/edit' ) )
const InvoicePrint = lazy( () => import( '../../views/apps/invoice/print' ) )
const InvoicePreview = lazy( () => import( '../../views/apps/invoice/preview' ) )


const AppRoutes = [

  {
    element: <UserList />,
    path: '/apps/user/list'
  },
  {
    path: '/apps/user/view',
    element: <Navigate to='/apps/user/view/1' />
  },
  {
    element: <Roles />,
    path: '/apps/roles'
  },
  {
    element: <Permissions />,
    path: '/apps/permissions'
  },
  {
    element: <InvoiceList />,
    path: '/apps/invoice/list'
  },
  {
    element: <InvoicePreview />,
    path: '/apps/invoice/preview'
  },
  {
    path: '/apps/invoice/preview',
    element: <Navigate to='/apps/invoice/preview/4987' />
  },
  {
    element: <InvoiceEdit />,
    path: '/apps/invoice/edit/:id'
  },
  {
    path: '/apps/invoice/edit',
    element: <Navigate to='/apps/invoice/edit/4987' />
  },
  {
    element: <InvoiceAdd />,
    path: '/apps/invoice/add'
  },
  {
    path: '/apps/invoice/print',
    element: <InvoicePrint />,
    meta: {
      layout: 'blank'
    }
  },
]

export default AppRoutes
