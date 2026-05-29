import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'

const MainLayout = () => {
    return (
        <div className="flex h-screen w-full overflow-hidden bg-base-100">
            <Navbar />
            <div className="flex-1 w-full md:pl-20 pb-20 md:pb-0 h-full overflow-hidden">
                <Outlet />
            </div>
        </div>
    )
}

export default MainLayout