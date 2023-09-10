import { useDispatch, useSelector } from "react-redux" ;
import Navbar from '../../shared/navbar/index' ;
import { useEffect, useRef, useState } from "react";
import { getAccessToken, hasDetails, refreshAccessToken } from "../../utils/functions";
import axios from "axios";
import { logoutUser } from "../../store/user";
import { useNavigate } from "react-router-dom";
import server from "../../utils/axios";

function Student(){
    const [show, setShow] = useState(true) ;
    const [success, setSuccess] = useState(false) ;
    const detailsSource = axios.CancelToken.source() ;
    const fileRef = useRef() ;
    const dispatch = useDispatch() ;
    const navigate = useNavigate() ;
    const [busy, setBusy] = useState(false) ;
    const [data, setData] = useState({
        fullName: '',
        email: '',
        contact: '',
        address: ''
    })
    const [formErrors, setFormErrors] = useState({
        fullName: '',
        email: '',
        contact: '',
        address: '',
        file: '',
        default: ''
    }) ;

    const logout = () => {
        dispatch(logoutUser()) ;
        navigate('/', { replace: true }) ;
    } ;

    const inputChange = (ev) => {
        const {name, value} = ev.target ;
        setData({
            ...data,
            [name]: value
        }) ;
    } ;

    const loadDetails = async () => {
        const [data, error] = await hasDetails() ;
        setShow(false) ;
        if (!error && data === null){
            setSuccess(false) ;
        }
        else if (!error && data !== null){
            setData({
                fullName: data.fullName,
                email: data.email,
                contact: data.contact,
                address: data.address
            }) ;
            setSuccess(true) ;
        }
    }

    const submit = () => {
        setBusy(true) ;
        const f = new FormData() ;

        for(let [key, value] of Object.entries(data)){
            f.set(key, value) ;
        }

        f.set('file', fileRef.current.files[0]) ;


        server.post('student/details', f, {
            headers: {
                Accept: 'application/json',
                "Content-Type": 'mutipart/form-data',
                Authorization: `Bearer ${getAccessToken()}`
            }
        }).then(res => {
            console.log(res.data) ;
            if (res.data?.success){
                setSuccess(true) ;
            }
        }).catch(err => {
            console.error(err) ;
            const error = err?.response?.data?.error ;
            if (error){
                setFormErrors({
                    fullName: error.fullName || '',
                    email: error.email || '',
                    contact: error.contact || '',
                    address: error.address || '',
                    file: error.file || '',
                    default: error.default || ''
                }) ;
            }
        }).finally(() => {
            setBusy(false) ;
        }) ;
    }

    useEffect(() => {
        const accToken = getAccessToken() ;
        let source = axios.CancelToken.source() ;

        if (!accToken){
            console.log('refreshing accesstoken on null') ;
            refreshAccessToken(source).catch(err => {
                if (err.repsonse.data?.error.default === 'jwt expired'){
                    console.log('logout called') ;
                    logout() ;
                }
            }) ;
        }

        
        let interval = setInterval(() => {
            console.log('refreshing access token every 10min')
            let newS = axios.CancelToken.source() ;
            refreshAccessToken(newS).catch(err => {
                console.error(err) ;
                if (err?.repsonse?.data?.error.default === 'jwt expired'){
                    console.log('logout called') ;
                    logout() ;
                }
            }) ;
        }, 10 * 60 * 1000) ;


        return () => {
            clearInterval(interval) ;
            source.cancel() ;
            detailsSource.cancel() ;
        }
    }, []) ;

    return (
        <>
            <div className="w-100 h-100 d-flex flex-column">
                <Navbar />

                <div className="container d-flex justify-content-center align-items-center flex-grow-1 flex-shrink-1">
                    {
                        show ?
                        <button onClick={loadDetails} className="btn btn-primary">Fetch Details</button>
                        :
                        <div className="card" style={{ width: '25rem' }}>
                            <div className="card-header">
                                Student Details
                            </div>
                            <div className="card-body">
                                <form>
                                    <div className="mb-2">
                                        <label htmlFor="fn" className='form-label'>
                                            Full Name
                                        </label>
                                        <input type='text' id="fn" className='form-control' defaultValue={data.fullName} required name='fullName' disabled={success} onChange={inputChange}  />
                                        {
                                            formErrors.fullName && <div className="mt-1 text-danger">{ formErrors.fullName }</div>
                                        }
                                    </div>
                                    <div className="mb-2">
                                        <label htmlFor="email" className='form-label'>
                                            Email
                                        </label>
                                        <input type='email' id="email1" className='form-control' disabled={success} name='email' defaultValue={data.email} required onChange={inputChange} />
                                        {
                                            formErrors.email && <div className="mt-1 text-danger">{ formErrors.email }</div>
                                        }
                                    </div>
                                    <div className="mb-2">
                                        <label htmlFor="con" className='form-label'>
                                            Contact Number
                                        </label>
                                        <input type='tel' id="con" className='form-control' disabled={success} name='contact' defaultValue={data.contact} required onChange={inputChange} />
                                        {
                                            formErrors.contact && <div className="mt-1 text-danger">{ formErrors.contact }</div>
                                        }
                                    </div>
                                    <div className="mb-2">
                                        <label htmlFor="add" className='form-label'>
                                            Address
                                        </label>
                                        <textarea id="add" className='form-control' disabled={success} name='address' defaultValue={data.address}  required onChange={inputChange} />
                                        {
                                            formErrors.address && <div className="mt-1 text-danger">{ formErrors.address }</div>
                                        }
                                    </div>
                                    <div className="mb-2">
                                        <label htmlFor="pdf" className='form-label'>
                                            File Upload
                                        </label>
                                        <input ref={fileRef} type='file' id="pdf" className='form-control' disabled={success} name='file' accept="application/pdf" required/>
                                        {
                                            formErrors.file && <div className="mt-1 text-danger">{ formErrors.file }</div>
                                        }
                                    </div>
                                </form>
                                {
                                    formErrors.default && <p className="text-danger text-center">{ formErrors.default }</p>
                                }
                            </div>
                            <div className="card-footer d-flex justify-content-end">
                                <button className="btn btn-primary" disabled={busy ^ success} onClick={submit}>Update</button>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </>
    )
} ;

export default Student ;