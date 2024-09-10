'use client'
import Image from 'next/image';
import Link from 'next/link';
import trending from '../../../../../app/assets/home_images/trending.png';
import ribbon from '../../../../../app/assets/home_images/ribbon.png';
import { useEffect, useState } from 'react';
import { EXPORT_ALL_APIS, PER_PAGE_LIMIT } from '@/utils/apis/api';
import Topbanner from '@/app/_common/layout/topbanner';
import LoadingBar from '@/app/_common/innerLoader/innerLoader';
import emptyImage from '../../../../assets/home_images/empty.jpg'

const ContinentCountrycard = ({slug}) => {
    let api=EXPORT_ALL_APIS()

    let [data,setData]=useState([])

    let loadSingleContinentCountries=async()=>{
        let resp=await api.loadSingleContinent(slug)
        setData(resp)
    }

    useEffect(()=>{
        loadSingleContinentCountries()
    },[])

    let result=data?data.result:[]

    

 

    return (
        <>
        <Topbanner slug={slug}/> 
        <div className="topdestination container inner-w-container country_inner_cards">
            <h2 className='same_heading'>Top Destination By Our Travel Experts</h2>
            <p>Unlimited Choices | Best Prices | Happy Memories | Hot Deals</p>
            <div className="destinations expert-travel">
                { result===null || result===undefined ? <EmptyCards/> : (result.map((country, index) => (
                    <div key={index} className="destination">
                        <Link href={`/continents/${slug}/${country.slug.trim().toLowerCase().replace(/\s+/g, '-')}`}>
                            {country.images ? country.images.map((e) => (
                                <Image
                                    key={e._id}
                                    src={`/uploads/${e.name}`}
                                    alt={country.title}
                                    style={{ width: '100%', height: '100%' }}
                                    width={1000}
                                    height={300}
                                    className="image"
                                />
                            )) : 'No image found'}
                        </Link>
                        <span
                            style={{
                                backgroundImage: `url(${ribbon.src})`,
                                backgroundSize: 'cover',
                                backgroundRepeat: 'no-repeat',
                            }}
                            className="trending"
                        >
                            <img src={trending.src} alt="Trending" />Trending
                        </span>
                        <div className="info">
                            <h3>{country.title}</h3>
                            <p>{country.total_cities} cities</p>
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
          <Link href="#" className="destination" key={index}>
            <div  key={index}>
              <div className="skeleton">
                <div className='skeleton_animation'></div>
                <Image
                  src={emptyImage.src}
                  alt="Loading"
                  width={1000}
                  height={300}
                  className="image-travel-expert"
                  style={{ width: '100%', height: '100%' }}
                />
                <span
                  className="trending"
                >
                </span>
              </div>
              <div className="info">
                <h3></h3>
                <p></p>
              </div>
            </div>
          </Link>
        ))}
      </>
    );
  }

export default ContinentCountrycard;
