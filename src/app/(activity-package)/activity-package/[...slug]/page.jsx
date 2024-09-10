
import React from 'react'
import PackagesCatPackages from './component/packagesCatPackages'
import Topbanner from '@/app/_common/layout/topbanner'
import Layout from '@/app/_common/layout/layout'


function page({params}) {
    let {slug}=params
    
  return (
     <>
     <Layout>

     <Topbanner slug={slug}/>
     <PackagesCatPackages slug={slug}/>

     </Layout>
     </>
  )
}

export default page
