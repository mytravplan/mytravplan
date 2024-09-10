'use client';

import React, { useMemo, useState } from 'react';
import Layout from '@/app/_common/layout/layout';
import Topbanner from '@/app/_common/layout/topbanner';
import ContinentPage from './components/continentPage';
import useFetchAllSections from '@/hooks/useLoadApiHook';
import { PER_PAGE_LIMIT } from '@/utils/apis/api';

export default function PageComponent() {
  const [page, setPage] = useState(1);

  const response = useFetchAllSections(page, PER_PAGE_LIMIT);
  const { continents = [], pagination = {} } = response.data || {};
  const { totalContinents = 0 } = pagination;

  const memoizedContinents = useMemo(() => ({
    continents: continents
  }), [continents]);

 
  const reversedContinents = Array.isArray(memoizedContinents.continents) ? [...memoizedContinents.continents].reverse() : [];

  return (
    <Layout>
      <div>
        <Topbanner />
        <ContinentPage
          reversedContinents={reversedContinents}
          setPage={setPage}
          page={page}
          totalContinents={totalContinents}
          limit={PER_PAGE_LIMIT}
        />
      </div>
    </Layout>
  );
}
