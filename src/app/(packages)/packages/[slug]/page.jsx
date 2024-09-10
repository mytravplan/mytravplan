 
import Layout from "@/app/_common/layout/layout";
import PackagePage from "./components/packagePage";
 

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
