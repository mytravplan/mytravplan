'use client'
import { EXPORT_ALL_APIS, PER_PAGE_LIMIT } from '@/utils/apis/api';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Topbanner from '@/app/_common/layout/topbanner';
import emptyImage from '../../../../assets/home_images/empty.jpg';
import BookingAndLogin from '@/app/_common/bookingAndLogin';


const ContinentAllpackages = ({ slug_three }) => {

  let api = EXPORT_ALL_APIS()
  let [data, setData] = useState([])

  let loadSingleCityPackages = async () => {
    let resp = await api.loadSingleCity(slug_three)
    setData(resp)
  }

  useEffect(() => {
    loadSingleCityPackages();
  }, [])

  let result = data ? data.result : []

  return (

    <>
      <Topbanner slug={slug_three} />
      <div className="container card_main_section" style={{ margin: '50px auto' }}>
        <div className="card_discount">
          <div className="packages">
            {result === undefined || result === null ? <EmptyCards /> : (result?.map((pkg, index) => (
              <div key={index} className="package">
                {pkg.images ? pkg.images.map((e) => (
                  <Image
                    key={e._id}
                    src={`/uploads/${e.name}`}
                    alt={e.title}
                    width={333} height={380}
                    className="image"
                  />
                )) : 'No image found'}
                <div className="info">
                  <h3>{pkg.title}</h3>
                  <p>{pkg.package_nights || 0} nights / {pkg.package_days || 0} days</p>
                  <p className="rating">
                    <span className="star">⭐</span> {pkg.rating} ({pkg.reviews})
                  </p>
                  <p className="price">From ₹ {pkg.package_price || 0}</p>
                  <div className="buttons">
                    <Link href={`/packages/${pkg.slug.trim().toLowerCase().replace(/\s+/g, '-')}`}>
                      <button className="details-btn">View Details</button>
                    </Link>
                    <BookingAndLogin pkg={pkg}/>
                  </div>
                </div>
              </div>
            )))}
          </div>
        </div>
      </div>
    </>

  );
};

function EmptyCards() {
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

export default ContinentAllpackages;
