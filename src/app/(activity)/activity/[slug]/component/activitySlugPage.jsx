'use client'
import BookingAndLogin from "@/app/_common/bookingAndLogin";
import LoadingBar from "@/app/_common/innerLoader/innerLoader";
import { EXPORT_ALL_APIS } from "@/utils/apis/api";
import Image from "next/image";
import { useEffect, useState } from "react";
import emptyImage from '../../../../assets/home_images/empty.jpg'
import Link from "next/link";

const ActivityBloggallery = ({ slug }) => {
    let [data, setData] = useState([])
    let api = EXPORT_ALL_APIS()
    let fetchSingleActivity = async () => {
        let resp = await api.loadSingleActivity(slug)
        setData(resp)

    }
    useEffect(() => {
        fetchSingleActivity()
    }, [])

    let result = data ? data.result : []


    return (
        <>
            {result === undefined || result === null || result === 0 ?
                <EmptyComponent />
                : (result.map((ele) => {
                    return <div className='overview blog-inner-page' key={ele._id} >

                        <div className='summary_slider'>
                            <div className="itinerary_inner">
                                <div className='itenary_contact'>
                                    <div className='top_summary'>
                                        <div className='top_summary_inner'>
                                            <h2 className='heading_inner_page'>Top Summary</h2>
                                            <p>{ele.activity_overview}
                                            </p>
                                            <div className="card_main_section">
                                                <div className="buttons">
                                                    <BookingAndLogin pkg={ele} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className='right_query'>
                                    <div className='card_contact'>

                                        <div className='question'>
                                            <h1>Have a Question?</h1>
                                            <p>Do not hesitage to give us a call. We are an expert team and we are happy to talk to you</p>
                                            <div className='contact_card'>
                                                <a href='tel:+91 8627814386'>+91 8627814386</a>
                                                <a href='mailto:booking@streetromeo.com'>booking@streetromeo.com</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                }))}

        </>


    );
};

function EmptyComponent() {
    return (
        <>
            {Array(1).fill().map((_, index) => (
                <div className='overview blog-inner-page' key={index} >
                    <div className='summary_slider'>
                        <div className="itinerary_inner">
                            <div className='itenary_contact'>
                                <div className='top_summary'>
                                    <div className='top_summary_inner'>
                                        <div className="package_skeleton">
                                            <div className="skeleton">
                                                <div className='skeleton_animation'></div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>

                            <div className='right_query'>
                                <div className='card_contact'>
                                    <div className='question'>
                                        <div className="package_skeleton">
                                            <div className="skeleton">
                                                <div className='skeleton_animation'></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            ))}
        </>
    );
}



export default ActivityBloggallery;