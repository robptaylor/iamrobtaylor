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
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    return (
      <header>
        <nav>
          {/* Logo */}
          {/* <NavLink to='/' className='font-bold'>
            NavigationBar
          </NavLink> */}
          {/* Navigation Links Container */}
          <div className='nav-links'>
              <div key={'Home'}>
                <NavLink to='/'>{'Home'}</NavLink>
              </div>|
              <div key={'UKEnergy'}>
                <NavLink to='/ukenergy'>{'UKEnergy'}</NavLink>
              </div>

            {/* {navLinks.map((link) => (
              <div key={link.name}>
                <NavLink to={link.path}>{link.name}</NavLink>
              </div>
            ))} */}
            {/* <a href='https://chinwike.space'>Explore Further</a> */}
          </div>
          {/* Mobile Menu Button */}
          {/* <button>{isMenuOpen ? <XIcon /> : <MenuIcon />}</button> */}
        </nav>
      </header>
    )
  }