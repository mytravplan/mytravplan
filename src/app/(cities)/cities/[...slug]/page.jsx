import Layout from "@/app/_common/layout/layout";
import CityAllpackages from "./components/cityAllPackages";
 

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
                  <CityAllpackages slug_one={slugArray[0]} />
          
          </>
        )}
        
      </Layout>
    </>
  )
}

export default page
