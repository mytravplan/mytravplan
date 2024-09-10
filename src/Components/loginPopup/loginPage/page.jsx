'use client'
import React, { Suspense } from 'react'
import loginbg from '../../../../public/images/login-bg.png'
import LoginPopup from '../Components/popup'

function LoginPage() {
  return (
    <div className='popup-bg' style={{ backgroundImage: `url(${loginbg.src})` }}>
      <Suspense fallback={<div>Loading...</div>}>
      <LoginPopup/>
    </Suspense>
    </div>
  )
}

export default LoginPage
