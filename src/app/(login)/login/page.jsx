'use client'
import React, { Suspense } from 'react'
import Login from '../Components/login'
import loginbg from '../../../../public/images/login-bg.png'

function page() {
  return (
    <div className='popup-bg' style={{ backgroundImage: `url(${loginbg.src})` }}>
      <Suspense fallback={<div>Loading...</div>}>
      <Login/>
    </Suspense>
    </div>
  )
}

export default page
