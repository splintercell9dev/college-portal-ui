import { useEffect } from 'react';
import Login from './components/login/index' ;
import Staff from './components/staff/index' ;
import Student from './components/student/index' ;
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useSelector } from 'react-redux';
import axios from 'axios';
import ProtectedRoutes from './shared/protected-routes';
import NonProtectedRoutes from './shared/nonprotected-routes';

function App() {
  const details = useSelector(state => state.details) ;
  // const navigate = useNavigate() ;

  useEffect(() => {
    let interval, source = axios.CancelToken.source() ;
    console.log('use effect top', details) ;
    if (details){
      interval = setInterval(async () => {
        console.log('time collection')
        // await refreshAccessToken(source) ;
      }, 6 * 1000) ;
    }

    return () => {
      console.log('destroy')
      clearInterval(interval) ;
      source.cancel() ;
    }
  }, []) ;

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<NonProtectedRoutes />}>
            <Route path="/" index element={<Login />} />
          </Route>
          <Route element={<ProtectedRoutes role="STAFF" />}>
            <Route path="staff" index element={<Staff/ >} />
          </Route>
          <Route element={<ProtectedRoutes role="STUDENT" />}>
            <Route path="student" index element={<Student/ >} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
