import { useState } from 'react';
import server from '../../utils/axios' ;
import './index.css' ;
import { useNavigate } from 'react-router-dom';
import { setUser } from '../../store/user'; 
import { useDispatch } from 'react-redux';

function Login(){
    const navigate = useNavigate() ;
    const dispatch = useDispatch() ;
    const [signUp, setSignUp] = useState(false) ;
    const [form, setForm] = useState({
        username: '',
        password: ''
    }) ;

    const [formValid, setValid] = useState(true) ;

    const [formErrors, setFormErros] = useState({
        username: false,
        password: false,
    }) ;

    const [serverError, setServerError] = useState('') ;

    const toggle = () => setSignUp(!signUp) ;

    const change = (ev) => {
        const {name, value} = ev.target ;
        setForm({
            ...form,
            [name]: value
        }) ;
        // validate(name, value) ;
    }

    const validate = (name, value) => {
        if (name === 'username' && value && value.length >= 5 && value.length <= 20){
            setFormErros({
                ...formErrors,
                username: false 
            }) ;
        }
        else{
            setFormErros({
                ...formErrors,
                username: true 
            }) ;
        }

        if (name === 'password' && value){
            if (value.length <= 8 && value.length >= 16){
                setFormErros({
                    ...formErrors,
                    password: true 
                }) ;
            }
        }
    } ;

    const submit = (staff = false) => {
        console.log('submit started')
        if (!formErrors.username && !formErrors.password){
            console.log('no form errors')
            server.post(signUp ? 'signup' : 'login', {
                ...form,
                role: staff ? 'STAFF' : 'STUDENT'
            }).then( result => {
                console.log(result) ;
                dispatch(setUser(result.data.data)) ;
                navigate(staff ? 'staff' : 'student', {
                    replace: true
                })
            })
            .catch(err => {
                console.log(err) ;
                setServerError(err.response?.data.error || err.message) ;
            })
        }
    }


    return (
        <div id="login-container" className="container">
            <div className="card" id="login-card" style={{
                width: '22rem'
            }}>
                <div className="card-header text-center">
                    {
                        signUp ? 'SignUp' : 'Login'
                    }
                </div>
                <div className="card-body">
                    <form>
                        <div className="mb-2">
                            <label htmlFor="user1" className='form-label'>
                                Username
                            </label>
                            <input type='text' id="user1" className='form-control' required name='username' onChange={change} />
                        </div>
                        <div className="mb-2">
                            <label htmlFor="pass1" className='form-label'>
                                Password
                            </label>
                            <input type='password' id="pass2" className='form-control' name='password' required onChange={change}/>
                        </div>
                    </form>
                    {
                        signUp ?
                        <>
                            <div className="mb-2">
                                <label htmlFor="pass2" className='form-label'>
                                    Re-Enter Password
                                </label>
                                <input type='password' id="pass2" className='form-control' name='recheck' required onChange={change} />
                            </div>
                            <p id="signup-link" className='py-2 mb-0' style={{
                                fontSize: '12px'
                            }}>
                                Already a User ? SignIn <a className='text-decoration-none' onClick={toggle}>here</a>
                            </p>
                        </>
                        :
                        <p id="signup-link" className='py-2 mb-0' style={{
                            fontSize: '12px'
                        }}>
                            Not a User ? SignUp <a className='text-decoration-none' onClick={toggle}>here</a>
                        </p>
                    }

                    {
                        serverError ?
                        <p className='text-danger'>{ serverError }</p>
                        :
                        null
                    }
                </div>
                <div className="card-footer d-flex flex-wrap justify-content-center p-3">
                    <button className='btn btn-primary me-3' onClick={() => submit()} disabled={!formValid}>
                        Student
                    </button>
                    <button className='btn btn-secondary' onClick={() => submit(true)} disabled={!formValid}>
                        Staff
                    </button>
                </div>
            </div>
        </div>
    )
} ;

export default Login ;