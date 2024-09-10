'use client'
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { format } from 'date-fns';
import { EXPORT_ALL_APIS } from '@/utils/apis/api';
import Topbanner from '@/app/_common/layout/topbanner';
import Layout from '@/app/_common/layout/layout';

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

    const reversedBookings = Array.isArray(booking.bookings) ? [...booking.bookings].reverse() : [];

    return (
        <Layout>
            <Topbanner slug="my-orders" />
            <div className="my-orders-container">
                {status === 'loading' ? (
                    <EmptyOrders />
                ) : reversedBookings.length === 0 ? (
                    <EmptyOrders>
                        <p className="no-bookings">No bookings found</p>
                    </EmptyOrders>

                ) : (
                    reversedBookings.map((ele) => {
                        const date = format(new Date(ele.createdAt), 'dd MMM yyyy');
                        const dateTime = format(new Date(ele.createdAt), 'HH:mm:ss a');
                        return (
                            <div key={ele._id} className="booking-card">
                                <p className="booking-id">Booking ID: {ele.booking_id}</p>
                                <p className="booking-description">Description: {ele.description}</p>
                                <p className="booking-package-id">Package ID: {ele._id}</p>
                                <p className="booking-date">Date: {date}</p>
                                <p className="booking-date">Time: {dateTime}</p>
                            </div>
                        );
                    })
                )}
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
