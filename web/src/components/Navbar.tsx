import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import './Navbar.css'

interface NavLinkType {
    name: string
    path: string
  }
  
  const navLinks: NavLinkType[] = [
    { name: 'Home', path: '/' },
    { name: 'UKEnergy', path: '/ukenergy' },
  ]

  export const Navbar = () => {
    return (
      <header>
        <nav>
            <NavLink to='/ukenergy' className="nav-left">{'UK ENERGY'}</NavLink>
            <NavLink to='/' className='font-bold'>
                <svg width="50" height="50" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="25" cy="25" r="25" fill="#80bfff"/>
                    <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="30" fill="white" font-weight="bold" text-anchor="middle" dominant-baseline="middle">
                        rt
                    </text>
                </svg>
            </NavLink>
          <NavLink to='/' className="nav-right">{'ABOUT'}</NavLink>
        </nav>
      </header>
    )
  }