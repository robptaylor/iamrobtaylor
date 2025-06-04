import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import './Navbar.css'

  export const Navbar = () => {
    return (
      <header>
        <nav>
            <NavLink to='/ukenergy' className='nav-logo'>
                <svg width="50" height="50" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="25" cy="25" r="25" fill="#80bfff"/>
                    <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="30" fill="white" font-weight="bold" text-anchor="middle" dominant-baseline="middle">
                        rt
                    </text>
                </svg>
            </NavLink>
            <NavLink to='/ukenergy' className="nav-item">{'UK ENERGY'}</NavLink>
        </nav>
      </header>
    )
  }