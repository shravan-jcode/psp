// src/layouts/MainLayout.jsx
import Navbar from "../components/Navbar"
import React from 'react'
import { Outlet } from 'react-router-dom'

const MainLayout = () => {
    return (
        // Added max-w-full and overflow-x-hidden for cleaner layout
        <div className='min-h-screen bg-gray-50 font-inter max-w-full overflow-x-hidden'> 
            <Navbar/>
            {/* Added pt-4 to give some spacing below the sticky Navbar */}
            <main className='relative pt-4'> 
                <Outlet/>
            </main>
        </div>
    )
}

export default MainLayout