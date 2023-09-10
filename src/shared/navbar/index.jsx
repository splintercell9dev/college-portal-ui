import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../store/user";
import server from "../../utils/axios";
import { getRefreshToken } from "../../utils/functions";


function Navbar(){
    const { details } = useSelector(state => state.user) ;
    const navigate = useNavigate() ;
    const dispatch = useDispatch() ;

    useEffect(() => {
        console.log('from use effect navbar', details.username)
        if (!details){
            navigate('/', {
                replace: true
            }) ;
        }
    }, [details]) ;

    const logout = () => {
        console.log(getRefreshToken()) ;
        server.delete('logout', {
            data: {
                refreshToken: getRefreshToken()
            }
        }).then( data => {
            console.log(data) ;
            dispatch(logoutUser()) ;
            navigate('/', { replace: true }) ;
        }).catch(err=> {
            console.error(err) ;
            if (err.response.data?.error.default === 'No token provided.'){
                console.error('ran code')
                navigate('/', { replace: true })
            }
        })
    }
    return (
        <div className="navbar bg-light px-3 shadow-sm">
            <span className="navbar-brand">Dashboard</span>
            <div className="flex-grow-1 flex-shrink-1"></div>
            <span className="me-3" style={{fontSize: '12px'}}>Welcome, { details.username || 'User' }</span>
            <button className="btn btn-outline-danger" onClick={logout}>Logout</button>
        </div>
    )
} ;

export default Navbar ;