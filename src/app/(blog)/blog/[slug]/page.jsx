
import React from 'react'
import BlogInnerPageSlug from './components/blogInnerPage';


export default async function page({ params }) {
  let { slug } = params





  return (
    <>
      <BlogInnerPageSlug slug={slug} />
    </>
  );
}
