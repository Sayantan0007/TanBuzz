import React from 'react'
import { menuItemsData } from '../assets/assets'
import { NavLink } from 'react-router-dom'

const MenuItems = ({ setIsSidebarOpen }) => {
  return (
    <div>
      {
        menuItemsData.map((item) => {
          return (
            <NavLink key={item.label} to={item.to} end={item.to === '/'} onClick={() => setIsSidebarOpen(false)} className={({ isActive }) => `px-6 py-3 flex items-center gap-3 rounded-xl ${isActive ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-50 text-indigo-900'}`}>
              <item.Icon className='w-5 h-5' />
              {item.label}
            </NavLink>
          )
        })
      }
    </div>
  )
}

export default MenuItems
