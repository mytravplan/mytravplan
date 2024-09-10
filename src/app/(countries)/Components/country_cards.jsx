'use client'
import Image from 'next/image';
import Link from 'next/link';
import trending from '../../../app/assets/home_images/trending.png';
import ribbon from '../../../app/assets/home_images/ribbon.png';
import { useEffect, useState } from 'react';
import { EXPORT_ALL_APIS } from '@/utils/apis/api';

const Countrycard = ({slug}) => {
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
        <div className="topdestination container inner-w-container country_inner_cards">
            <h2 className='same_heading'>Top Destination By Our Travel Experts</h2>
            <p>Unlimited Choices | Best Prices | Happy Memories | Hot Deals</p>
            <div className="destinations expert-travel">
                { result===null || result===undefined ? ('No destinations found') : (result.map((country, index) => (
                    <div key={index} className="destination">
                        <Link href={`/continent/${country.slug.trim().toLowerCase().replace(/\s+/g, '-')}`}>
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
    );
};

export default Countrycard;
