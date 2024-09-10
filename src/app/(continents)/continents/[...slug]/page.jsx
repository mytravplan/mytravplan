

 
import Layout from '@/app/_common/layout/layout';
import React from 'react'
import CitiesExplorations from './components/citiesCard';
import ContinentAllpackages from './components/packagesCard';
import ContinentCountrycard from './components/countriesCard';
 
function page({ params }) {
  let { slug } = params

  const slugArray = Array.isArray(slug) ? slug : slug.split('/');

  return (
    <>
      <Layout>
        {slugArray.length===1&&(
          <>
          
                  {/* <Topbanner slug={slugArray[0]} /> */}
                  <ContinentCountrycard slug={slugArray[0]} />
          
          </>
        )}
           {slugArray.length===2&&(
          <>
          
                  {/* <Topbanner slug={slugArray[1]} /> */}
                  <CitiesExplorations slug_one={slugArray[0]} slug_two={slugArray[1]} />
          
          </>
        )}
           {slugArray.length===3&&(
          <>
          
                  {/* <Topbanner slug={slugArray[2]} /> */}
                  <ContinentAllpackages slug_one={slugArray[0]} slug_two={slugArray[1]} slug_three={slugArray[2]}/>
          
          </>
        )}
      
      </Layout>
    </>
  )
}

export default page
