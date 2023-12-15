import axios from 'axios';
import jwt_decode from 'jwt-decode';
import React, { Suspense } from 'react';
// ** Router Import
import Router from './router/Router';


const App = () => {

  // useEffect( () => {
  //   const beforeUnloadHandler = ( e ) => {
  //     e.preventDefault();
  //     e.returnValue = "";
  //     return "Are you sure you want to leave?";
  //   };

  //   window.addEventListener( "beforeunload", beforeUnloadHandler );

  //   return () => {
  //     window.removeEventListener( "beforeunload", beforeUnloadHandler );
  //   };
  // }, [] );
  const userData = JSON.parse( localStorage.getItem( 'userData' ) );
  if ( userData ) {
    const decoded = jwt_decode( userData?.accessToken );
    const apiKey = decoded.ApiKey;
    const tenantId = decoded.TenantId;
    const nameid = decoded.nameid;
    // axios.defaults.headers.common['Authorization'] = `bearer ${userData?.accessToken}`;
    axios.defaults.headers.common['X-Api-Key'] = apiKey;
    axios.defaults.headers.common['TenantId'] = tenantId;
    axios.defaults.headers.common['nameid'] = nameid;
  }
  return (
    <Suspense fallback={null}>
      <Router />
    </Suspense>
  );
};

export default App;
