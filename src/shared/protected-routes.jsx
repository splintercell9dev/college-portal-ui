import { Navigate, Outlet } from "react-router-dom";
import { decodedToken, getRefreshToken } from "../utils/functions";

function ProtectedRoutes({ role }){
    const token = getRefreshToken() ;
    const details = decodedToken(token) ;

    return (
        token && details ?
        (
            details.role === role ?
            <Outlet />
            :
            <Navigate to={role === 'STUDENT' ? 'staff' : 'student'} replace />
        )
        :
        <Navigate to="/" replace />
    )
} ;

export default ProtectedRoutes ;