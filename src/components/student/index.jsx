import { useDispatch, useSelector } from 'react-redux';
import Navbar from '../../shared/navbar/index' ;
import { useEffect, useState } from 'react';
import server from '../../utils/axios';
import { changeAccessToken } from '../../store/user' ;
import { useNavigate } from 'react-router-dom';

function Student(){
    const { user, accessToken, refreshToken } = useSelector(state => state.user) ;
    const navigate = useNavigate() ;
    const [userData, setUserData] = useState({
        name: null,
        email: null,
        contact: null,
        address: null
    }) ;
    const [updated, setUpdated] = useState(false) ;
    const dispatch = useDispatch() ;
    const refreshAccessToken = async () => {
        try{
            const { data } = await server.post('refresh', {
                refreshToken
            }) ;

            if (data.data.accessToken){
                dispatch(changeAccessToken(data.data?.accessToken)) ;   
            }

        }catch (err){
            console.log(err)
        }
    }

    const change = (ev) => {
        const {name, value} = ev.target ;
        setUserData({
            ...userData,
            [name]: value
        }) ;
    }

    const submit = () => {
        const formData = new FormData() ;
        
        for(let key of Object.keys(userData)){
            console.log('form value', userData[key])
            formData.set(`${key}`, userData[key]) ;
        }

        formData.set("file", document.querySelector('input[type="file"]').files[0]) ;
        console.log(formData)

        server.post('student/details', formData, {
            headers: {
                Accept: 'application/json',
                "Content-Type": 'multipart/form-data'
            }
        }).then( result => {
            console.log(result) ;

        }).catch(err => {
            if (err.response?.data.error === 'jwt expired'){
                refreshAccessToken() ;
            }
        }) ;
    }

    useEffect(() => {
        if (user){
            server.get('student/details', {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }).then(result => {
                const u = result.data.data ;
                if (u){
                    console.log('update state')
                    setUserData({
                        name: u.name,
                        email: u.email,
                        contact: u.contact,
                        address: u.address 
                    }) ;
                    setUpdated(u.updated) ;
                }
            })
            .catch((err) => {
                console.error(err) ;
                if (err.response?.data.error === 'jwt expired'){
                    refreshAccessToken() ;
                }
            })
        }
    }, [user]);
    return (
        <div className="w-100 h-100 d-flex flex-column">
            <Navbar />
            <div className="container d-flex justify-content-center align-items-center flex-grow-1 flex-shrink-1">
                <div className="card" style={{
                    width: '25rem'
                }}>
                    <div className="card-header">
                        Details
                    </div>
                    <div className="card-body">
                        <form>
                            <div className="mb-2">
                                <label htmlFor="fn" className='form-label'>
                                    Full Name
                                </label>
                                <input type='text' id="fn" className='form-control' required name='name' onChange={change} />
                            </div>
                            <div className="mb-2">
                                <label htmlFor="email" className='form-label'>
                                    Email
                                </label>
                                <input type='email' id="email" className='form-control' name='email' required onChange={change}/>
                            </div>
                            <div className="mb-2">
                                <label htmlFor="con" className='form-label'>
                                    Contact Number
                                </label>
                                <input type='tel' id="con" className='form-control' name='contact' required onChange={change}/>
                            </div>
                            <div className="mb-2">
                                <label htmlFor="add" className='form-label'>
                                    Address
                                </label>
                                <textarea id="add" className='form-control' name='address' required onChange={change}/>
                            </div>
                            <div className="mb-2">
                                <label htmlFor="pdf" className='form-label'>
                                    File Upload
                                </label>
                                <input type='file' id="pdf" className='form-control' name='file' required/>
                            </div>
                        </form>
                    </div>
                    <div className="card-footer d-flex justify-content-end">
                        <button className='btn btn-primary' disabled={updated} onClick={submit}>
                            Update
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
} ;

export default Student ;