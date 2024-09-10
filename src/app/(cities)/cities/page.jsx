'use client';
import React, { useMemo, useState } from 'react';
import Explorations from './Components/citiesinnercards';
import Layout from '../../_common/layout/layout';
import Topbanner from '@/app/_common/layout/topbanner';
import useFetchAllSections from '@/hooks/useLoadApiHook';
import { PER_PAGE_LIMIT } from '@/utils/apis/api';

export default function Page() {
  const [page, setPage] = useState(1);

  // Fetch data with pagination
  const response = useFetchAllSections(page, PER_PAGE_LIMIT);

  const { cities = [],pagination = {}} = response.data || {};
  
  const { totalCities = 0 } = pagination;

  const memoizedCity = useMemo(() => ({
    cities: cities,
  }), [ cities]);

  const reversedCities = Array.isArray(memoizedCity.cities) ? [...memoizedCity.cities].reverse() : [];

  return (
    <Layout>
      <div>
        <Topbanner />
        <Explorations
          reversedCities={reversedCities}
          setPage={setPage}
          page={page}
          totalCities={totalCities}
          limit={PER_PAGE_LIMIT}
        />
      </div>
    </Layout>
  );
}
