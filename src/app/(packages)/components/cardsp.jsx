'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import useFetchAllSections from '@/hooks/useLoadApiHook';
import Paginations from '@/app/_common/_paginations/paginations';
import { PER_PAGE_LIMIT } from '@/utils/apis/api';
import emptyImage from '../../assets/home_images/empty.jpg';
import BookingAndLogin from '@/app/_common/bookingAndLogin';

const Allpackages = () => {
  const [page, setPage] = useState(1);

  const response = useFetchAllSections(page, PER_PAGE_LIMIT);
  const { packages = [], pagination = {} } = response.data;
  const { totalPackages = 0 } = pagination;

  // Remove memoization
  const reversedPackages = Array.isArray(packages) ? [...packages].reverse() : [];

  return (
    <>
      <div className="container card_main_section">
        <div className="card_discount">
          <div className="packages">
            {
              reversedPackages.length === 0 ?
                <EmptyPackageComponent />
                : reversedPackages.map((pkg, index) => (
                  <div key={index} className="package">
                    {pkg.images ? pkg.images.map((e) => (
                      <Image
                        key={e._id}
                        src={`/uploads/${e.name}`}
                        alt={e.title}
                        width={333} height={380}
                        className="image"
                      />
                    )) : <img src={emptyImage.src} alt='package' width={333} height={380} />}
                    <div className="info">
                      <h3>{pkg.title}</h3>
                      <p>{pkg.package_nights || 0} nights / {pkg.package_days} days</p>
                      <p className="price">Per Person - ₹{pkg.package_price || 0}</p>
                      <div className="buttons">
                        <Link href={`/packages/${pkg.slug}`}>
                          <button className="details-btn">View Details</button>
                        </Link>
                        <BookingAndLogin pkg={pkg} />
                      </div>
                    </div>
                  </div>
                ))}
          </div>
        </div>
        {packages && <Paginations
          page={page}
          limit={PER_PAGE_LIMIT}
          totalItems={totalPackages}
          setPage={setPage}
        />}
      </div>
    </>
  );
};

function EmptyPackageComponent() {
  return (
    <>
      {Array(PER_PAGE_LIMIT).fill().map((_, index) => (
        <div key={index} className="package">
          <div className="skeleton">
            <div className='skeleton_animation'></div>
            <Image
              src={emptyImage.src}
              alt="Loading"
              width={333}
              height={380}
              className="image"
            />
          </div>
        </div>
      ))}
    </>
  );
}

export default Allpackages;
