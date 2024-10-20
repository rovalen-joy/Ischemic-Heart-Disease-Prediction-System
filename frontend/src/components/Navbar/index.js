// Navbar/index.js

import React, { useState, useEffect } from 'react';
import './index.css';
import { UserAuth } from '../../context/AuthContext';
import { NavLink, useNavigate } from 'react-router-dom';
import { MdLogout, MdMenu, MdClose } from 'react-icons/md';
import { FaUser, FaHome, FaRegChartBar, FaListAlt, FaInfoCircle } from 'react-icons/fa'; // Corrected import path
import toast from 'react-hot-toast';

const NavigationBar = () => {
  const { user, logout } = UserAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    // Show tooltip for first-time login users
    const firstLogin = localStorage.getItem('firstLogin');
    if (!firstLogin) {
      setShowTooltip(true);
    }
  }, []);

  const onLogout = async () => {
    try {
      await logout();
      navigate('/');
      toast.success('Logged out successfully.', {
        style: {
          fontSize: '1rem',
          padding: '0.75rem',
        },
      });
    } catch (error) {
      console.error('Logout Error:', error);
      toast.error('Failed to logout. Please try again.', {
        style: {
          fontSize: '1rem',
          padding: '0.75rem',
        },
      });
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleTooltipClose = () => {
    setShowTooltip(false);
    localStorage.setItem('firstLogin', true);
  };

  return (
    <>
      {/* Navbar */}
      <nav className='bg-[#00717A] flex justify-between items-center py-4 px-4 shadow-sm relative'>
        {/* Hamburger Menu with bounce effect */}
        <button
          onClick={toggleSidebar}
          className='text-white focus:outline-none focus:ring-2 focus:ring-white rounded animated-bounce joyride-hamburger-menu'
          aria-label={isSidebarOpen ? "Close menu" : "Open menu"}
        >
          {isSidebarOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
        </button>

        {/* Tooltip pointing to Hamburger Menu */}
        {showTooltip && (
          <div className='absolute top-12 left-4 bg-white p-2 rounded-lg shadow-md z-50'>
            <p className="text-sm text-gray-700">Click the menu icon to navigate.</p>
            <div className="absolute top-[-8px] left-4 h-0 w-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-b-8 border-b-white"></div>
            <button className='text-sm text-blue-600' onClick={handleTooltipClose}>Got it!</button>
          </div>
        )}

        {/* User Info and Logout */}
        <div className='hidden md:flex items-center gap-4'>
          {user && (
            <div className='text-white flex items-center gap-1 text-base'>
              <FaUser size={18} />
              {user.email}
            </div>
          )}

          <button
            className='text-white flex items-center gap-1 text-base hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-white'
            onClick={onLogout}
            aria-label="Logout"
          >
            <MdLogout size={20} />
            Logout
          </button>
        </div>
      </nav>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className='fixed inset-0 bg-black bg-opacity-50 z-40'
          onClick={closeSidebar}
          aria-hidden="true"
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-[#00717A] text-white transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out z-50`}
      >
        <div className='flex flex-col h-full'>
          {/* Sidebar Header */}
          <div className='flex items-center justify-between p-4 border-b border-[#005f61]'>
            <h2 className='text-xl font-semibold'>Menu</h2>
            <button
              onClick={toggleSidebar}
              className='text-white focus:outline-none focus:ring-2 focus:ring-white rounded'
              aria-label="Close menu"
            >
              <MdClose size={24} />
            </button>
          </div>

          {/* Sidebar Links */}
          <nav className='flex-1 p-4'>
            <ul className='space-y-4'>
              <li>
                <NavLink
                  to='/home'
                  className={({ isActive }) =>
                    isActive
                      ? 'flex items-center bg-white text-[#00717A] rounded px-3 py-2 font-medium'
                      : 'flex items-center hover:bg-[#005f61] rounded px-3 py-2 font-medium'
                  }
                  onClick={closeSidebar}
                >
                  <FaHome className="mr-2" />
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  to='/prediction-form'
                  className={({ isActive }) =>
                    isActive
                      ? 'flex items-center bg-white text-[#00717A] rounded px-3 py-2 font-medium'
                      : 'flex items-center hover:bg-[#005f61] rounded px-3 py-2 font-medium'
                  }
                  onClick={closeSidebar}
                >
                  <FaRegChartBar className="mr-2" />
                  Prediction
                </NavLink>
              </li>
              <li>
                <NavLink
                  to='/prediction-table'
                  className={({ isActive }) =>
                    isActive
                      ? 'flex items-center bg-white text-[#00717A] rounded px-3 py-2 font-medium'
                      : 'flex items-center hover:bg-[#005f61] rounded px-3 py-2 font-medium'
                  }
                  onClick={closeSidebar}
                >
                  <FaListAlt className="mr-2" />
                  Patients Record
                </NavLink>
              </li>
              <li>
                <NavLink
                  to='/about-us'
                  className={({ isActive }) =>
                    isActive
                      ? 'flex items-center bg-white text-[#00717A] rounded px-3 py-2 font-medium'
                      : 'flex items-center hover:bg-[#005f61] rounded px-3 py-2 font-medium'
                  }
                  onClick={closeSidebar}
                >
                  <FaInfoCircle className="mr-2" />
                  About Us
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
};

export default NavigationBar;