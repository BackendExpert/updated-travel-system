import { BrowserRouter, Route, Routes } from 'react-router-dom'
import WebSite from '../layouts/WebSite'
import DefultError from '../component/Errors/DefultError'
import CreateAuth from '../pages/AuthPages/CreateAuth'
import VerifyPassword from '../pages/AuthPages/VerifyPassword'
import EnrollMFA from '../pages/AuthPages/EnrollMFA'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<WebSite />} >
                    <Route path='*' element={<DefultError />} />

                    <Route path='/auth' element={<CreateAuth /> } />
                    <Route path='/verify-password' element={<VerifyPassword /> } />
                    <Route path='/enroll-mfa' element={<EnrollMFA /> } />
                    

                </Route>

            </Routes>
        </BrowserRouter>
    )
}

export default App
