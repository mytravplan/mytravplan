 
import Layout from "@/app/_common/layout/layout";
import PackagePage from "./components/packagePage";
import { EXPORT_ALL_APIS } from "@/utils/apis/api";
 

export default function page({ params }) {
  let { slug } = params
 

  return (
    <div>
      <Layout>

       <PackagePage slug={slug}/>

      </Layout>
    </div>
  );
}


export async function generateMetadata({ params }) {
  const { slug } = params;

  try {
    const resp = await fetch(`http://localhost:3000/api/v1/package/getbyslug/${slug}`);
    if (!resp.ok) {
      throw new Error(`Failed to fetch package: ${resp.status}`);
    }

    const data = await resp.json();
    const { result = [] } = data;

   
    const packageData = result[0] || {};

    console.log(packageData)

    return {
      title: packageData.sco_title ,
      description: packageData.sco_description ,
      openGraph:{
        title: 'Default Title',
        description: 'Default Description',
      }
    };
  } catch (error) {
    console.error('Error generating metadata:', error);

 
  }
}



