import { useState } from "react" ;
import Login from './components/login/index' ;
import Staff from './components/staff/index' ;
import Student from './components/student/index' ;
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  const [user, setUser] = useState(null) ;

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" index element={<Login/ >}  />
          <Route path="/staff" index element={<Staff/ >}  />
          <Route path="/student" index element={<Student/ >}  />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
