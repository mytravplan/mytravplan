import React from 'react'

function HotelActivities({ hotel_activities }) {
    return (
        <>
            <div>
                <h3>( Hotel Activities )</h3>
                {hotel_activities === null || hotel_activities === undefined ? ('no result found') : (
                    hotel_activities.map((ele) => {
                        return <div className="hotel_act" key={ele?._id}>
                            <h3>{ele?.hotel_name}</h3>
                            <ul>
                                <li>{ele?.activity_description}</li>
                            </ul>
                        </div>

                    })
                )}
            </div>
        </>
    )
}
export default HotelActivities
