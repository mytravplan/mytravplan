


import Layout from '@/app/_common/layout/layout';
import React from 'react'
import CitiesExplorations from './components/citiesCard';
import ContinentAllpackages from './components/packagesCard';
import ContinentCountrycard from './components/countriesCard';
import { EXPORT_ALL_APIS } from '@/utils/apis/api';
import { LoadscoData } from '@/app/_seo_metadata/metadata';

function page({ params }) {
  let { slug } = params

  const slugArray = Array.isArray(slug) ? slug : slug.split('/');

  return (
    <>
      <Layout>
        {/* {slugArray.length === 1 && (
          <>

           
            <ContinentCountrycard slug={slugArray[0]} />

          </>
        )}

        {slugArray.length === 2 && (
          <>

           
            <CitiesExplorations slug_one={slugArray[0]} slug_two={slugArray[1]} />

          </>
        )}
        
        {slugArray.length === 3 && (
          <>

           
            <ContinentAllpackages slug_one={slugArray[0]} slug_two={slugArray[1]} slug_three={slugArray[2]} />

          </>
        )} */}


        {slugArray.length === 1 && (
          <>

            {/* <Topbanner slug={slugArray[2]} /> */}
            <ContinentAllpackages slug_one={slugArray[0]}/>

          </>
        )}

      </Layout>
    </>
  )
}

export default page



