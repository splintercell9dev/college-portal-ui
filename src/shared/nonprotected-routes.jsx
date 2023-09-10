import { Navigate, Outlet } from "react-router-dom";
import { decodedToken, getRefreshToken } from "../utils/functions";

function NonProtectedRoutes(){
    const token = getRefreshToken() ;
    const details = decodedToken(token) ;

    return (
        token && details ?
        <Navigate to={details.role === 'STUDENT' ? 'student' : 'staff'} replace />
        :
        <Outlet />        
    )
} ;

export default NonProtectedRoutes ;