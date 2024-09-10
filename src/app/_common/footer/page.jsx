'use client'
import React, { useMemo } from 'react'
import PaymentMethods from '../footer/components/payment'
import Destinations from './components/destinations'
import FooterLinks from './components/otherlinks'
import ContactLinks from './components/contact'
import footerb from '../../assets/home_images/footerbackground.png';
import Offer from './components/offer';
import useFetchAllSections from '@/hooks/useLoadApiHook'

function Footer() {
  let response=useFetchAllSections()
  let {footer,countries}=response.data||{}


  let footerMemoization=useMemo(()=>({
    footer:footer,
    countries:countries
  }),[footer,countries])

  

   
   
  return (

   <div className='offer_footer'>
    <Offer/>


    <div className='footer_main' style={{ backgroundImage: `url(${footerb.src})`}}>

      
      <div className='footer_section'>
      <PaymentMethods />
      <Destinations result={footerMemoization.countries}/>
      <FooterLinks result={footerMemoization.footer}/>
      <ContactLinks result={footerMemoization.footer}/>

      </div>
      <div className='copyright_footer'>
        <p>© 2024 My Travel Plan | All Rights Reserved | Design By Spark Web Solutions</p>
      </div>
    </div>
    </div>
  )
}

export default Footer
