import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../store/user";
import server from "../../utils/axios";


function Navbar(){
    const { user, refreshToken} = useSelector(state => state.user) ;
    const navigate = useNavigate() ;
    const dispatch = useDispatch() ;

    useEffect(() => {
        if (!user){
            navigate('/', {
                replace: true
            }) ;
        }
    }, [user]) ;

    const logout = () => {
        server.delete('logout', {
            refreshToken
        }).then( data => {
            console.log(data) ;
            dispatch(logoutUser()) ;
        }).catch(err=> {
            console.error(err) ;
        })
    }
    return (
        <div className="navbar bg-light px-3 shadow-sm">
            <span className="navbar-brand">College Portal</span>
            <div className="flex-grow-1 flex-shrink-1"></div>
            <span className="me-3" style={{fontSize: '12px'}}>Welcome, { user?.username }</span>
            <button className="btn btn-outline-danger" onClick={logout}>Logout</button>
        </div>
    )
} ;

export default Navbar ;