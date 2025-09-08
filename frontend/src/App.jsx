import { Routes, Route, Navigate } from 'react-router-dom'

import { Loader } from 'lucide-react'
import { Toaster } from 'react-hot-toast'

import Navbar from './components/Navbar'

import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Settings from './pages/Settings'
import Profile from './pages/Profile'

import {useAuthStore} from './store/useAuthStore'
import { useEffect } from 'react'

const App = () => {
   const {authUser, checkAuth, isCheckingAuth, onlineUsers} = useAuthStore();

    console.log({onlineUsers});

   useEffect(() => {
    checkAuth();
   }, [checkAuth]);

   console.log("Auth User:", authUser);

   if(isCheckingAuth && !authUser){
    return (
        <div className='flex items-center justify-center h-screen'>
            <Loader className='animate-spin' />
        </div>
    )
}
    
  return (
    <div>
        <Navbar />
        <Toaster position="top-center" reverseOrder={false} />
        <Routes>
            <Route path='/' element={authUser? <Home /> : <Navigate to='/login'/>} />
            <Route path='/login' element={!authUser? <Login /> : <Navigate to='/'/>} />
            <Route path='/signup' element={!authUser? <Signup /> : <Navigate to='/'/> } />
            <Route path='/settings' element={<Settings />} />
            <Route path='/profile/' element={authUser? <Profile /> : <Navigate to='/login'/>} />
        </Routes>
    </div>
  )
}

export default App