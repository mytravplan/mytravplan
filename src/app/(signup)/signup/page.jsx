'use client'
import React, { Suspense } from 'react'
import Signup from '../Components/signup'
import loginbg from '../../../../public/images/login-bg.png'

function page() {
  return (
    <div className='popup-bg' style={{ backgroundImage: `url(${loginbg.src})` }}>
      <Suspense fallback={<div>Loading...</div>}>
      <Signup/>
    </Suspense>
    </div>
  )
}

export default page
