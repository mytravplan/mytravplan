'use client'
import Layout from "@/app/_common/layout/layout";
import Transferslider from "./components/slider";
import Transfercontent from "./components/content";
import Topbanner from "@/app/_common/layout/topbanner";


export default function page({params}) {
  let {slug}=params
 
 
  return (
        <Layout> 
          <Topbanner />
            <div className='inner-w-container'>
              <Transferslider/>
              <Transfercontent/>
            </div>
            </Layout>
        
   
  );
}
