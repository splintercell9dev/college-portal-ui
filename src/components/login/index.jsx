import { useState, useRef } from 'react';
import server from '../../utils/axios';
import './index.css' ;
import { decodedToken, getRefreshToken, setAccessToken, setRefreshToken } from '../../utils/functions';
import { useDispatch } from 'react-redux';
import { setUser } from '../../store/user';
import { useNavigate } from 'react-router-dom';

function Login(){
    const [login, setLogin] = useState(true) ;
    const dispatch = useDispatch() ;
    const navigate = useNavigate() ;
    const formRef = useRef() ;
    const [formErrors, setFormErrors] = useState({
        name: '',
        password: '',
        default: '',
        repass: '',
        role: ''
    }) ;

    const [formValid, setFormValid] = useState(true) ;
    const [busy, setBusy] = useState(false) ;
    const toggleLogin = () => setLogin(!login) ;


    const pwdCheck = (ev) => {
        if (ev.target.value !== formRef.current.password.value){
            console.log('not same') ;
            setFormValid(false) ;
            setFormErrors(e => ({
                ...e,
                repass: 'Password must be same.'
            })) ;
        }
        else{
            setFormValid(true) ;
            setFormErrors(e => ({
                ...e,
                repass: ''
            })) ;
        }
    } ;

    const submit = () => {
        console.log('inside submit')
        if (formValid){
            console.log('inside call');
            setBusy(true) ;
            
            server.post(login ? 'login': 'signup', {
                username: formRef.current.username.value,
                password: formRef.current.password.value,
                role: formRef.current.role.value
            }).then( resp => {
                const result = resp.data.data ;
                if (result){
                    setAccessToken(result.accessToken) ;
                    setRefreshToken(result.refreshToken) ;
                    const payload = {
                        details: decodedToken(),
                        refreshToken: getRefreshToken()
                    } ;
                    dispatch(setUser(payload));

                    navigate(payload.details.role === 'STUDENT' ? 'student':'staff', { replace: true }) ;
                }
                setBusy(false) ;
                setFormErrors(e => ({
                    name: '',
                    password: '',
                    repass: '',
                    default: '',
                    role: ''
                })) ;
            }).catch(err => {
                console.error(err);
                setBusy(false) ;
                const error = err.response?.data?.error ;
                if (error && error.default){
                    setFormErrors(e => ({
                        ...e,
                        default: error.default
                    })) ;
                }
                else if (error){
                    console.log('set form errors', error) ;
                    setFormErrors(e => ({
                        ...e,
                        name: error.username || '',
                        password: error.password || '',
                        role: error.role || ''
                    })) ;
                }

            })
        }
    }

    return (
        <div id="login-container" className="container h-100 d-flex justify-content-center align-items-center">
            <div className="card" id="login-card" style={{
                width: '22rem'
            }}>
                <div className="card-header text-center">
                    {
                        login ? 'Login' : 'SignUp'
                    }
                </div>
                <div className="card-body">
                    <form ref={formRef}>
                        <div className="mb-2">
                            <label htmlFor="user1" className='form-label'>
                                Username
                            </label>
                            <input type='text' id="user1" className='form-control' required name='username' />
                            {
                                formErrors.name && <div className='text-danger mt-1'>{ formErrors.name }</div>
                            }
                        </div>
                        <div className="mb-2">
                            <label htmlFor="role" className='form-label'>
                                Role
                            </label>
                            <select type='text' id="role" className='form-control form-select' required name='role' defaultValue="STUDENT">
                                <option value="STUDENT">Student</option>
                                <option value="STAFF">Staff</option>
                            </select>
                            {
                                formErrors.role && 
                                <div className='text-danger mt-1'>{ formErrors.role }</div>
                            }
                        </div>
                        <div className="mb-2">
                            <label htmlFor="pass1" className='form-label'>
                                Password
                            </label>
                            <input type='password' id="pass1" className='form-control' name='password' required />
                            {
                                formErrors.password && 
                                <div className='text-danger mt-1'>{ formErrors.password }</div>
                            }
                        </div>
                    </form>
                    {
                        !login ?
                        <>
                            <div className="mb-2">
                                <label htmlFor="pass2" className='form-label'>
                                    Re-Enter Password
                                </label>
                                <input type='password' id="pass2" className='form-control' name='recheck' required onChange={pwdCheck} />
                                {
                                    formErrors.repass && <div className="text-danger mt-1">{ formErrors.repass }</div>
                                }
                            </div>
                            <p id="signup-link" className='py-2 mb-0' style={{
                                fontSize: '12px'
                            }}>
                                Already a User ? SignIn <a className='text-decoration-none' onClick={toggleLogin}>here</a>
                            </p>
                        </>
                        :
                        <p id="signup-link" className='py-2 mb-0' style={{
                            fontSize: '12px'
                        }}>
                            Not a User ? SignUp <a className='text-decoration-none' onClick={toggleLogin}>here</a>
                        </p>
                    }

                    {
                        formErrors.default && <p className='text-danger'>{ formErrors.default }</p>
                    }
                </div>
                <div className="card-footer d-flex justify-content-end p-3">
                    <button className='btn btn-primary' onClick={submit} disabled={formValid && busy}>
                        {
                            login ? 'Login': 'SignUp'
                        }
                    </button>
                </div>
            </div>
        </div>
    )
} ;

export default Login ;