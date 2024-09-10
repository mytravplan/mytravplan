import React from 'react'
import Topbanner from '@/app/_common/layout/topbanner'
import Allpackages from '../components/cardsp'
import Layout from '@/app/_common/layout/layout'
export default function page() {
  return (
    <Layout>
    <div className='packages_inner'>
     <Topbanner/>
      <div className='card_images'>
        <div className='card_sections'>
          <Allpackages/>
        </div>

      </div>

    </div>
    
    </Layout>
  )
}
