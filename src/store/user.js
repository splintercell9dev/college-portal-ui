import { createSlice } from '@reduxjs/toolkit' ;

let initialState = {
    user: {
        username: null,
        id: null,
        role: null
    },
    accessToken: null,
    refreshToken: null
}
try{
    const temp = JSON.parse(localStorage.getItem('user')) ;
    if (temp){
        initialState = temp ;
    }
}catch(err){
    console.log(err) ;
    
}
console.log(initialState) ;

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            const { user, accessToken, refreshToken } = action.payload ;
            state.user = user ;
            state.accessToken = accessToken ;
            state.refreshToken = refreshToken ;
            localStorage.setItem('user', JSON.stringify(state)) ;
        },
        logoutUser: (state, action) => {
            state.accessToken = null ;
            state.refreshToken = null ;
            state.user = null ;
            localStorage.setItem('user', null) ;
        },
        changeAccessToken: (state, action) => {
            state.accessToken = action.payload ;
            localStorage.setItem("user", JSON.stringify(state)) ;
        }
    }
}) ;

export const { setUser, logoutUser, changeAccessToken } = userSlice.actions ;

export default userSlice.reducer ;