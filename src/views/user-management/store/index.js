import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { generalStoreApi } from "../../../services/api_endpoint";
import { convertQueryString } from "../../../utility/Utils";
import { initialUserData } from "./model";

// Define an async thunk for fetching all users
export const fetchAllUsers = createAsyncThunk( "user/fetchAllUsers", async ( params ) => {
    const apiEndPoint = `${generalStoreApi.users.root}?${convertQueryString( params )}`;
    const response = await axios.get( apiEndPoint );
    return response.data.identityUsers.items;
} );

export const getAllUserByFilter = createAsyncThunk( 'user/getAllUserByFilter', async ( data ) => {
    const apiEndPoint = `${generalStoreApi.users.root}/grid`;
    const res = await axios.post( apiEndPoint, data );
    return res.data.identityUsers;
} )

// Define an async thunk for adding a new user
export const addNewUser = createAsyncThunk( "user/addNewUser", async ( userData ) => {
    const apiEndPoint = `${generalStoreApi.users.root}`;
    await axios.post( apiEndPoint, userData )
        .then( ( res ) => {
            return res.data;
        } )
        .catch( ( err ) => {
            const errorMsg = JSON.parse( err.response.data.detail );
            toast.error( errorMsg[0]?.Message );
            return res.data;
        } )
} );
export const updateUser = createAsyncThunk( "user/updateUser", async ( userData ) => {
    const apiEndPoint = `${generalStoreApi.users.root}`;
    await axios.put( apiEndPoint, userData )
        .then( ( res ) => {
            return res.data;
        } )
        .catch( ( err ) => {
            const errorMsg = JSON.parse( err.response.data.detail );
            toast.error( errorMsg[0]?.Message );
            return res.data;
        } )
} );

export const getUserById = createAsyncThunk( 'user/getUserById', async ( id ) => {
    const apiEndPoint = `${generalStoreApi.users.root}/${id}`;
    const res = await axios.get( apiEndPoint );
    const data = res.data.identityUser;
    const info = {
        ...data,
        roles: { label: data?.roles[0], value: data?.roles[0] }
    }
    return info;
} )



const userSlice = createSlice( {
    name: "user",
    initialState: {
        allUsers: [],
        totalItems: 0,
        userData: initialUserData
    },
    reducers: {
        bindUserInfo: ( state, action ) => {
            if ( action.payload ) {
                state.userData = action.payload;
            } else {
                state.userData = initialUserData;
            }
        }
    },
    extraReducers: ( builder ) => {
        builder
            .addCase( fetchAllUsers.fulfilled, ( state, action ) => {
                state.allUsers = action.payload;
            } )
            .addCase( getAllUserByFilter.fulfilled, ( state, action ) => {
                state.allUsers = action.payload.items;
                state.totalItems = action.payload.totalItems;
            } )
            .addCase( updateUser.fulfilled, ( state, action ) => {
                state.userData = action.payload;
            } )
            .addCase( getUserById.fulfilled, ( state, action ) => {
                state.userData = action.payload;
            } )
            .addCase( addNewUser.fulfilled, ( state, action ) => {
                state.allUsers.push( action.payload );
            } );

    },
} );

export const { bindUserInfo } = userSlice.actions;
export default userSlice.reducer;





// import { createSlice } from "@reduxjs/toolkit";
// import axios from "axios";
// import toast from "react-hot-toast";
// import { generalStoreApi } from "../../../services/api_endpoint";


// const userSlice = createSlice( {
//     name: 'user',
//     initialState: {
//         allUsers: []
//     },
//     reducers: {
//         allUsers: ( state, action ) => {
//             const apiEndPoint = `${generalStoreApi.users.root}`;
//             axios.get( apiEndPoint )
//                 .then( response => {
//                     if ( response.status === 200 ) {
//                         console.log( state )
//                     }
//                 } ).catch( error => {
//                     console.log( error );
//                     // loading( false );
//                 } );
//         },

//         addNewUser: ( state, action ) => {
//             const apiEndPoint = `${generalStoreApi.users.root}`;
//             axios.post( apiEndPoint, action.payload )
//                 .then( response => {
//                     if ( response.status === 201 ) {
//                         toast.success( 'Successfully added user' )
//                     }
//                 } ).catch( error => {
//                     console.log( error );
//                     // loading( false );
//                 } );
//         }
//     }
// } )

// export const { allUsers, addNewUser } = userSlice.actions;
// export default userSlice.reducer