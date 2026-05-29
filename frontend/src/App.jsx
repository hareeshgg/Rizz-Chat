import { Routes, Route, Navigate } from 'react-router-dom'

import { Loader } from 'lucide-react'
import { Toaster } from 'react-hot-toast'

import Navbar from './components/Navbar'

import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Settings from './pages/Settings'
import Profile from './pages/Profile'

import { useAuthStore } from './store/useAuthStore'
import { useEffect } from 'react'
import AuthLayout from './layouts/AuthLayout'
import MainLayout from './layouts/MainLayout'

const App = () => {
    const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore();

    console.log({ onlineUsers });

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    console.log("Auth User:", authUser);

    if (isCheckingAuth && !authUser) {
        return (
            <div className='flex items-center justify-center h-screen'>
                <Loader className='animate-spin' />
            </div>
        )
    }

    return (
        <div>
            <Toaster position="top-center" reverseOrder={false} />
            <Routes>
                <Route path='/auth' element={<AuthLayout />}>
                    <Route path='login' element={!authUser ? <Login /> : <Navigate to='/' />} />
                    <Route path='signup' element={!authUser ? <Signup /> : <Navigate to='/' />} />
                </Route>
                <Route path='/' element={authUser ? <MainLayout /> : <Navigate to='/auth/login' />}>
                    <Route index element={<Home />} />
                    <Route path='chat' element={<Home />} />
                    <Route path='settings' element={<Settings />} />
                    <Route path='profile' element={<Profile />} />
                </Route>
            </Routes>
        </div>
    )
}

export default App