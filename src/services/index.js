import axios from "axios";

export const baseAxios = axios.create( {
    baseURL: "http://192.168.0.9:81"
    // cancelToken: cancelationToken.token
} );

// const accessToken = JSON.parse( localStorage.getItem( cookieName ) )?.access_token;
const accessToken = JSON.parse( localStorage.getItem( 'userData' ) );
// console.log( accessToken );
if ( accessToken ) {
    // baseAxios.defaults.headers.common['Authorization'] = `bearer ${accessToken}`;
    axios.defaults.headers.common['X-Api-Key'] = 'API101';
    axios.defaults.headers.common['nameid'] = 'nameid';

}