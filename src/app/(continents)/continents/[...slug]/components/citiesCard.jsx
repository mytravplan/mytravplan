'use client'
import LoadingBar from '@/app/_common/innerLoader/innerLoader';
import Topbanner from '@/app/_common/layout/topbanner';
import { EXPORT_ALL_APIS, PER_PAGE_LIMIT } from '@/utils/apis/api';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import emptyImage from '../../../../assets/home_images/empty.jpg';



const CitiesExplorations = ({ slug_one, slug_two }) => {
    let api = EXPORT_ALL_APIS()

    let [data, setData] = useState([])

    let loadSingleContinentCities = async () => {
        let resp = await api.loadSingleCountry(slug_two)
        setData(resp)
    }

    useEffect(() => {
        loadSingleContinentCities()
    }, [])

    let result = data ? data.result : []

   

    return (
       <>
       <Topbanner slug={slug_two} />
        <div className="explorations">
            <div className="explorations-grid">
                {result === undefined || result === null ? <EmptyCards/> : (result.map((exploration, index) => (
                    <div key={index} className="exploration-item">
                        <Link href={`/continents/${slug_one}/${slug_two}/${exploration.slug.trim().toLowerCase().replace(/\s+/g, '-')}`}>

                            {exploration.images ? exploration.images.map((e) => (
                                <Image
                                    key={e._id}
                                    src={`/uploads/${e.name}`}
                                    alt={e.title}
                                    width={400}
                                    height={330}
                                    className="exploration-image"
                                />
                            )) : 'No image found'}
                        </Link>
                        <div className="exploration-details">
                            <div className='explore_l'>
                                <h3>Explorations {exploration.title}</h3>
                                <p>Packages In {exploration.title} {exploration.city_packages_count}</p>
                            </div>
                            <div className='icon_custom'>
                                <img src='/images/arrowu.png' />
                            </div>
                        </div>
                    </div>
                )))}
            </div>
        </div>
       </>
    );
};

function EmptyCards() {
    return (
      <>
 
          {Array(PER_PAGE_LIMIT).fill().map((_, index) => (
            <div key={index} className="exploration-item">
              <Link href="#" >
                <div className="skeleton">
                  <div className='skeleton_animation'></div>
                  <Image
                    src={emptyImage.src}
                    alt="cities"
                    width={400}
                    height={330}
                    className="exploration-image"
                  />
                </div>
              </Link>
            </div>
          ))}
      </>
    );
  }

export default CitiesExplorations;
