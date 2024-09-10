// 'use client' 
// import React from 'react'
// import { Hourglass } from 'react-loader-spinner'
 
// function loading() {
//     return (
//         <div className="loader_wrapper">
//           <Hourglass
//                         visible={true}
//                         height="80"
//                         width="80"
//                         ariaLabel="hourglass-loading"
//                         wrapperStyle={{}}
//                         wrapperClass=""
//                         colors={['#CF0C2A', '#1802A0']}
//                     />
            
//         </div>


//     )
// }

// export default loading




'use client';
import React from 'react';
import Image from 'next/image';
import logo from './assets/home_images/logo.png';

function Loading() {
  return (
    <div className="loader-container">
      <div className="loader">
        <div className="logo-container">
          <Image src={logo} alt="Logo" className="logo" />
        </div>
        <div className="loader-ring">
          <div className="inner-ring"></div>
          <div className="outer-ring"></div>
        </div>
        <p className="loading-text">Loading, please wait...</p>
      </div>
    </div>
  );
}

export default Loading;
