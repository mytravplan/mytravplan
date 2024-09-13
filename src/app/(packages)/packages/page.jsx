import React from 'react'
import Topbanner from '@/app/_common/layout/topbanner'
import Allpackages from '../components/cardsp'
import Layout from '@/app/_common/layout/layout'
import { EXPORT_ALL_APIS } from '@/utils/apis/api'
import useFetchAllSections from '@/hooks/useLoadApiHook'

export default async function page() {
  

  return (
    <Layout>
      <div className='packages_inner'>
        <Topbanner />
        <div className='card_images'>
          <div className='card_sections'>
            <Allpackages />
          </div>

        </div>

      </div>

    </Layout>
  )
}





