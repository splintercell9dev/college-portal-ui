import { createSlice } from '@reduxjs/toolkit' ;
import { decodedToken, getRefreshToken, removeAccToken, removeRefToken } from '../utils/functions';

let initialState = {
    details: decodedToken() || {
        id: null,
        username: null,
        role: 'STUDENT'
    },
    refreshToken: getRefreshToken() 
} ;

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            const { details, refreshToken } = action.payload ;
            state.details.id = details.id ;
            state.details.username = details.username ;
            state.details.role = details.role ;
            state.refreshToken = refreshToken ;
        },
        logoutUser: (state, action) => {
            state.details.id = null ;
            state.details.username = null ;
            state.details.role = 'STUDENT' ;
            state.refreshToken = null ;
            removeAccToken() ;
            removeRefToken() ;
        }
    }
}) ;

export const { setUser, logoutUser } = userSlice.actions ;

export default userSlice.reducer ;