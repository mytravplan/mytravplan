'use client'

import BookingAndLogin from '@/app/_common/bookingAndLogin';
import LoadingBar from '@/app/_common/innerLoader/innerLoader';
import Topbanner from '@/app/_common/layout/topbanner';
import { EXPORT_ALL_APIS } from '@/utils/apis/api';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const CountryAllpackages = ({ slug_two }) => {

    let api = EXPORT_ALL_APIS()
    let [data, setData] = useState([])

    let loadSingleCityPackages = async () => {
        let resp = await api.loadSingleCity(slug_two)
        setData(resp)
    }

    useEffect(() => {
        loadSingleCityPackages()
    }, [])

    let result = data ? data.result : []

    return (
        <>
            <Topbanner slug={slug_two} />
            <div className="container card_main_section">
                <div className="card_discount">
                    <div className="packages">
                        {result === undefined || result === null ? <LoadingBar /> : (result?.map((pkg, index) => (
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

export default CountryAllpackages;
