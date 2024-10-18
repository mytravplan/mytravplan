import React, { useEffect, useState } from 'react';
import empty from '../app/assets/home_images/empty.jpg';
 

function Testimonials({ testimonials }) {
    console.log("Testimonials Data:", testimonials); // Debugging line to check testimonials data

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isScaling, setIsScaling] = useState(false);

    const nextTestimonial = () => {
        setIsScaling(false); // Start the scaling out effect
        setTimeout(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
            setIsScaling(true); // Start the scaling in effect after the transition out
        }, 500); // Adjust the timing based on the CSS transition duration
    };

    useEffect(() => {
        if (testimonials.length > 0) {
            const interval = setInterval(nextTestimonial, 3000);
            return () => clearInterval(interval);
        }
    }, [testimonials]);

    if (!testimonials || testimonials.length === 0) {
        return <div>Please wait, loading ....</div>;
    }

    return (
        <div className="test_outer">
            <div className="testi_inner">
                <h2 className='same_heading'>Our Testimonials</h2>
                <div className="test_wrapper">
                    <div className="testi_left_section">
                        <div className={`testi_wrapper ${isScaling ? 'scale' : 'scale-out'}`}>
                            <div className="test_img">
                                {testimonials[currentIndex]?.images && testimonials[currentIndex]?.images.length > 0 ? (
                                    <img
                                        src={`/uploads/${testimonials[currentIndex]?.images[0]?.name}`}
                                        alt={testimonials[currentIndex]?.name || "testimonials"}
                                    />
                                ) : (
                                    <div className="no-image">
                                        <img src={empty.src} alt="empty" />
                                    </div>
                                )}
                            </div>
                            <div className="test_details">
                                <h3>{testimonials[currentIndex]?.name}</h3>
                                <h4>{testimonials[currentIndex]?.designation}</h4>
                                <p>{testimonials[currentIndex]?.description}</p>
                            </div>
                        </div>
                    </div>
                    <div className="testi_right_section">
                        {/* Optional content for the right section */}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Testimonials;
