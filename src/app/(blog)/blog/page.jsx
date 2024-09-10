import Layout from '@/app/_common/layout/layout'
import React from 'react'
import Topbanner from '@/app/_common/layout/topbanner'
import BlogCardsContainer from '../Components/blogpage';

function page() {
 
    return (
      <Layout>
          <Topbanner/>   
          <div className="inner-w-container">
            <div className="blog_page_wrapper">
            <BlogCardsContainer/>  
          </div>
          </div>
          
      </Layout>
    )
  }
  
  export default page