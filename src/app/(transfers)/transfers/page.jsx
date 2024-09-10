import Layout from '@/app/_common/layout/layout'
import React from 'react'
import CarOptions from '../Components/transferinnersection'
import WelcomeCard from '../Components/sidebar'
import Topbanner from '@/app/_common/layout/topbanner'
import transferbg from '../../assets/home_images/transfer-bg.png';
import TransferPage from './TransferPage'

function page() {
  return (
    <Layout>
        <Topbanner/>

        <div className='vechile-sidebar'style={{ backgroundImage: `url(${transferbg.src})`, backgroundRepeat: 'no-repeat' , backgroundPosition: 'center' }}>
          <div className="inner-w-container vechile-sidebar-inner"> 
            <CarOptions/>
            <WelcomeCard/>
          </div> 
        </div>

        <div className='blog_custom'>
          <TransferPage />
        </div>
        
    </Layout>
  )
}

export default page