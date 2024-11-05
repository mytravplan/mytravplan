'use client';

import React, { useState } from 'react';
import Layout from '@/app/_common/layout/layout';
import Topbanner from '@/app/_common/layout/topbanner';
import CountryPage from './components/countryPage';
import useFetchAllSections from '@/hooks/useLoadApiHook';
import { PER_PAGE_LIMIT } from '@/utils/apis/api';

export default function PageComponent() {
  const [page, setPage] = useState(1);

  const response = useFetchAllSections(page, PER_PAGE_LIMIT);
  const { countries = [], pagination = {} } = response.data || {};
  const { totalCountries = 0 } = pagination;

  // No need for memoization
  const reversedCountries = Array.isArray(countries) ? [...countries].reverse() : [];

  return (
    <Layout>
      <div className="countryinner">
        <Topbanner />
        <CountryPage 
          country={reversedCountries} 
          setPage={setPage} 
          page={page} 
          totalCountries={totalCountries} 
          limit={PER_PAGE_LIMIT} 
        />
      </div>
    </Layout>
  );
}
