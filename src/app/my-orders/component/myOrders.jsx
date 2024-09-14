'use client'
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { format } from 'date-fns';
import { EXPORT_ALL_APIS } from '@/utils/apis/api';
import Topbanner from '@/app/_common/layout/topbanner';
import Layout from '@/app/_common/layout/layout';
import LoadingOverlay from '@/app/(admin)/admin/(dashboard)/components/LoadingOverlay';
import LoadingBar from '@/app/_common/innerLoader/innerLoader';

function MyOrders() {
    const { data: session, status } = useSession(); // Include status to handle loading state
    const user_id = session?.user?._id || null;

    
    
   
    const [booking, setBookings] = useState([]);

   
 

    useEffect(() => {
        const fetchAllBookings = async () => {
            if (user_id) {
                try {
                    const api = EXPORT_ALL_APIS(); // Moved inside the useEffect to ensure it's only called when necessary
                    const resp = await api.loadSingleUserbookingsdetails(user_id);
                    setBookings(resp.result || []);
                } catch (error) {
                    console.error('Error fetching bookings:', error);
                }
            }
        };

        fetchAllBookings();
    }, [user_id]); // Re-run effect when user_id changes

    console.log(booking)

    const reversedBookings = Array.isArray(booking.bookings) ? [...booking.bookings].reverse() : [];


   
    return (
        <Layout>
            <Topbanner slug="my-orders" />
            <div className="my-orders-container">
            <div className="my_ouder_wrapper_head">
                
            <h1 id='orders'>Your Booked Orders, {booking?.registerusername}</h1>

                    </div>
                <div className="my_ouder_wrapper">


                {status === 'loading' ? (
                   <LoadingBar/>
                ) : reversedBookings.length === 0 ? (
                    <p className="no-bookings">No bookings found</p>
                ) : (
                    reversedBookings.map((ele,index) => {
                        const date = format(new Date(ele.createdAt), 'dd MMM yyyy');
                        const dateTime = format(new Date(ele.createdAt), 'HH:mm:ss a');
                        return (
                            <div key={index} className="booking-card">
                            <p className="booking-description">You have booked this package <br/>   <b style={{color:'rgb(202, 30, 42)'}}><i>{ele?.title}</i></b></p>
                            <p className="booking-date">Date: {date}</p>
                            <p className="booking-date">Time: {dateTime}</p>
                          </div>
                          
                        );
                    })
                )}
                </div>
            </div>
        </Layout>
    );
}


export function EmptyOrders() {
    return (
        <>
        <div className="my-orders-container">
            {Array(4).fill().map((_, index) => (
                <div key={index} className="booking-card">
                    <div className="myorder-skeleton">
                        <div className='skeleton_animation'></div>

                    </div>
                </div>
            ))}
            </div>
        </>
    );
}

export default MyOrders;
