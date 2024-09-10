import Layout from "@/app/_common/layout/layout";
import CountryAllpackages from "./components/packagesCard";
import CountryCitiesExplorations from "./components/cityCard";


function page({ params }) {
  let { slug } = params

  const slugArray = Array.isArray(slug) ? slug : slug.split('/');

  console.log(slug)


  return (
    <>
      <Layout>
        {slugArray.length===1&&(
          <>
          
                  {/* <Topbanner slug_one={slugArray[0]} /> */}
                  <CountryCitiesExplorations slug_one={slugArray[0]} />
          
          </>
        )}
         {slugArray.length===2&&(
          <>
          
                  {/* <Topbanner slug_two={slugArray[1]} /> */}
                  <CountryAllpackages slug_two={slugArray[1]} />
          
          </>
        )}
      </Layout>
    </>
  )
}

export default page
