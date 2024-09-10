'use client'
import React from 'react'
import Navbar from './components/navbar'
import logo from '../../assets/home_images/logo.png'
import ContactUs from './components/profile'
import Link from 'next/link'



function Header() {
  return (
    <div className='header'>
     <div className='outer_header'>
     <div className='top_header'>

      <div className='header_logo'>
        <Link href={'/'}>
          <img src={logo.src}/>
        </Link>
      </div>
      <Navbar/>
         <ContactUs/>
       
      </div>
      </div> 
    </div>
  )
}

export default Header
