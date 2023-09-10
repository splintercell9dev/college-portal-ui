import { useEffect, useState } from "react";
import Navbar from "../../shared/navbar";
import axios from "axios";
import { getAccessToken, getStudentDetails, refreshAccessToken } from "../../utils/functions";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../store/user";
import { useNavigate } from "react-router-dom";
import Table from "./table";

function Staff(){
    const dispatch = useDispatch() ;
    const navigate = useNavigate() ;
    const [error, setError] = useState('') ;
    const [show, setShow] = useState(false) ;
    const [data, setData] = useState([]) ;

    const logout = () => {
        dispatch(logoutUser()) ;
        navigate('/', { replace: true }) ;
    } ;

    const refAccToken = () => {
        refreshAccessToken(axios.CancelToken.source()).catch(err => {
            if (err.response?.data?.error.default === 'jwt expired'){
                logout() ;
            }
        }) ;
    }

    const fetchDetails = async () => {
        setError(false) ;
        const [data, error] = await getStudentDetails() ;
        setShow(false) ;
        if (error){
            setError(error.message) ;
            if (error.message === 'jwt expired'){
                refAccToken() ;
            }
        }
        else if (data){
            setShow(true) ;
            setData(data) ;
            console.log(data) ;
        }
    } ;

    useEffect(() => {
        let source ;
        if (!getAccessToken()){
            source = axios.CancelToken.source() ;
            refreshAccessToken(source).catch(err => {
                console.error(err) ;
                if (err.repsonse?.data?.error.default === 'jwt expired'){
                    logout() ;
                }
            }) ;
        }

        let interval = setInterval(() => {
            const innerS = axios.CancelToken.source() ;
            console.log('Refreshing access token 10min.') ;
            refreshAccessToken(innerS).catch(err => {
                if (err.response?.data?.error.default === 'jwt expired'){
                    console.error(err) ;
                    logout() ;
                }
            }) ;
        }, 10 * 60 * 1000) ;

        return () => {
            clearInterval(interval) ;
            if (source){
                source.cancel() ;
            }
        } ;
    }, []) ;

    return (
        <div className="w-100 h-100 d-flex flex-column">
            <Navbar />
            {
                !show ?
                <div className="container d-flex justify-content-center align-items-center flex-grow-1 mt-3">
                    <div className="d-flex flex-column text-danger">
                        {
                            error && <p className="text-center">{error}</p>
                        }
                        <button className="btn btn-primary" onClick={fetchDetails}>Fetch Details</button>
                    </div>
                </div>            
                :
                <Table data={data} onRefresh={fetchDetails} onAccRef={refAccToken} />
            }
        </div>
    )
} ;

export default Staff ;