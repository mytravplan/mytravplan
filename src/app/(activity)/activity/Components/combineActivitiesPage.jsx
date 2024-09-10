'use client'
import Topbanner from '@/app/_common/layout/topbanner'
import React, { useMemo } from 'react'
import TopActivities from './top_activities'
import TopDiscountedActivities from './top_discounted_activities'
import TopDestinations from './Top_destination'
import LatestBlog from '@/Components/blogs'
import useFetchAllSections from '@/hooks/useLoadApiHook'

function CombineActivitiesPage() {
    let response=useFetchAllSections()
    const { cities = [], blogs = [], activities = [] } = response.data || {};


    const memoActivities = useMemo(() => ({
      cities: cities,
      blogs: blogs,
      activities: activities
    }), [ cities,  blogs, activities]);
 
   
  
  return (
     <>
      <div className='outer_section_abanner'>
      <Topbanner/>
     </div> 
      <TopActivities result={memoActivities.activities}/>
      <TopDiscountedActivities result={memoActivities.activities}/>
      <TopDestinations response={memoActivities.cities}/>
     <div className='blog_custom'>
      <LatestBlog blogs={memoActivities.blogs}/>
      </div>
     </>
  )
}

export default CombineActivitiesPage
