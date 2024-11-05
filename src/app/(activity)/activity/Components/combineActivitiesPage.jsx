'use client';

import Topbanner from '@/app/_common/layout/topbanner';
import React from 'react';
import TopActivities from './top_activities';
import TopDiscountedActivities from './top_discounted_activities';
import TopDestinations from './Top_destination';
import LatestBlog from '@/Components/blogs';
import useFetchAllSections from '@/hooks/useLoadApiHook';

function CombineActivitiesPage() {
  const response = useFetchAllSections();
  const { cities = [], blogs = [], activities = [] } = response.data || {};

  return (
    <>
      <div className='outer_section_abanner'>
        <Topbanner />
      </div>
      <TopActivities result={activities} />
      <TopDiscountedActivities result={activities} />
      <TopDestinations response={cities} />
      <div className='blog_custom'>
        <LatestBlog blogs={blogs} />
      </div>
    </>
  );
}

export default CombineActivitiesPage;
