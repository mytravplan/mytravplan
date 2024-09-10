'use client'
import React, { useEffect, useMemo, useState } from 'react';


import { PER_PAGE_LIMIT } from '@/utils/apis/api';

import BlogCard from './blogCard';
import useFetchAllSections from '@/hooks/useLoadApiHook';
 
const BlogCardsContainer = () => {

const [page, setPage] = useState(1);

  const response = useFetchAllSections(page, PER_PAGE_LIMIT);
  const { blogs = [], pagination = {} } = response.data || {};
  const { totalBlogs = 0 } = pagination;

  const memoizedBlogs = useMemo(() => ({
    blogs: blogs,
  }), [ blogs]);

  

  let reversedBlogs=Array.isArray(memoizedBlogs.blogs)?[...memoizedBlogs.blogs].reverse():[]
  return (
    <>
      <BlogCard 
      result={reversedBlogs} 
      setPage={setPage}
      page={page}
      totalBlogs={totalBlogs}
      limit={PER_PAGE_LIMIT}
      />
    </>
  );
};

export default BlogCardsContainer;
