'use client';

import LoadingBar from '@/app/_common/innerLoader/innerLoader';
import Topbanner from '@/app/_common/layout/topbanner';
import { EXPORT_ALL_APIS } from '@/utils/apis/api';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const CountryCitiesExplorations = ({ slug_one }) => {
  let api = EXPORT_ALL_APIS();

  let [data, setData] = useState([]);

  let loadSingleCountryCities = async () => {
    let resp = await api.loadSingleCountry(slug_one);
    setData(resp);
  };

  useEffect(() => {
    loadSingleCountryCities();
  }, []);

  let result = data ? data.result : [];

  return (
    <>
      <Topbanner slug={slug_one} />
      <div className="explorations">
        <div className="explorations-grid">
          {result === undefined || result === null
            ? <LoadingBar/>
            : result.map((exploration, index) => (
              <div key={index} className="exploration-item">
                <Link
                  href={`/countries/${slug_one}/${exploration.slug
                    .trim()
                    .toLowerCase()
                    .replace(/\s+/g, '-')}`}
                >
                  {exploration.images
                    ? exploration.images.map((e) => (
                      <Image
                        key={e._id}
                        src={`/uploads/${e.name}`}
                        alt={e.title}
                        width={400}
                        height={330}
                        className="exploration-image"
                      />
                    ))
                    : 'No image found'}
                </Link>
                <div className="exploration-details">
                  <div className="explore_l">
                    <h3>Explorations {exploration.title}</h3>
                    <p>
                      Packages In {exploration.title}{' '}
                      {exploration.city_packages_count}
                    </p>
                  </div>
                  <div className="icon_custom">
                    <img src="/images/arrowu.png" />
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </>

  );
};

export default CountryCitiesExplorations;
