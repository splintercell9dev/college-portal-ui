import { useEffect, useState } from 'react' ;
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Navbar from "../../shared/navbar";
import server from '../../utils/axios';
import { changeAccessToken } from '../../store/user' ;


function Staff(){
    const { user, accessToken, refreshToken} = useSelector(state => state.user) ;
    const dispatch = useDispatch() ;
    const [students, setStudents] = useState([]) ;
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

    const view = () => {
        server.get()
    } ;

    const download = () => {

    }

    useEffect(() => {
        if (user){
            server.get('staff/students', {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }).then(result => {
                const u = result.data.data ;
                if (u){
                    console.log('update state')
                    setStudents(u) ;
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
        <div className="w-100 h-100">
            <Navbar />
            <div className="container p-3 w-100">
                <table className='w-100'>
                    <thead>
                        <tr>
                            <th scope='col'>#</th>
                            <th scope='col'>Name</th>
                            <th scope='col'>Email</th>
                            <th scope='col'>Contact</th>
                            <th scope='col'>Address</th>
                            <th scope='col'>Date Uploaded</th>
                            <th scope='col'>File</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            students.map((student, index) => (
                                <tr key={index} style={{
                                    fontSize: '12px'
                                }}>
                                    <th>{ index+1 }</th>
                                    <th>{ student.name }</th>
                                    <th>{ student.email }</th>
                                    <th>{ student.contact }</th>
                                    <th>{ student.address }</th>
                                    <th>{ new Date(student.updatedAt).toDateString() }</th>
                                    <th>
                                        <button className='btn btn-primary me-2' onClick={view}>View</button>
                                        <button className='btn btn-secondary'>Download</button>
                                    </th>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
} ;

export default Staff ;