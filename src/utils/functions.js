import jwtDecode from "jwt-decode";
import server from "./axios";

export function getRefreshToken(){
    return localStorage.getItem('ref_token') ;
}

export function setRefreshToken(val){
    localStorage.setItem('ref_token', val) ;
}

export function setAccessToken(val){
    sessionStorage.setItem('access_token', val) ;
}

export function removeRefToken(){
    localStorage.removeItem('ref_token') ;
}

export function getAccessToken(){
    return sessionStorage.getItem('access_token') ;
}

export function removeAccToken(){
    sessionStorage.removeItem('access_token') ;
}

export function decodedToken(token = null){
    if (!token){
        token = getRefreshToken() ;
    }

    let decoded = null ;

    if (!token)
        return null ;

    try{
        let temp = jwtDecode(token) ;
        if (temp && (temp?.exp * 1000 < Date.now())){
            throw new Error("Token expired") ;
        }
        else if (temp.username && temp.id && temp.role){
            decoded = {
                username: temp.username,
                id: temp.id,
                role: temp.role
            } ;
        }

    }catch(err){
        console.error(err) ;
        removeRefToken() ;
        decoded = null ;
    }

    return decoded ;
} ;

export async function refreshAccessToken(source){
    const { data } = await server.post('refresh', {
        refreshToken: getRefreshToken()
    }, {
        cancelToken: source.token
    }) ;
    const token = data.data.accessToken ;
    if (token){
        setAccessToken(token) ;
    }
} ;

export async function hasDetails(){
    try{
        const { data } = await server.get('student/details', {
            headers: {
                Authorization: `Bearer ${getAccessToken()}`
            }
        }) ;
        
        if (data?.data){
            return [data.data, null] ;
        }
        
        return [null, null] ;
    }
    catch(err){
        console.error(err) ;
        return [null, error] ;
    }
}

export async function getStudentDetails(){
    try{
        const { data } = await server.get('staff/students', {
            headers: {
                Authorization: `Bearer ${getAccessToken()}`
            }
        }) ;

        return [data?.data, null] ;
    }
    catch(err){
        console.error(err) ;
        let message = err.response?.data.error.default ;
        if (message){
            return [null, new Error(message)] ;
        }
        return [null, err] ;
    }
}