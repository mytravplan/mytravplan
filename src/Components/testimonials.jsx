import React, { useEffect, useState } from 'react';
import empty from '../app/assets/home_images/empty.jpg';

function Testimonials({ testimonials, testimonialvideos }) {
    const [currentIndex, setCurrentIndex] = useState(0); // For testimonials
    const [isScaling, setIsScaling] = useState(false);
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0); // For videos


    console.log(testimonials)
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

    // Handle next and previous video navigation
    const nextVideo = () => {
        setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % testimonialvideos.length);
    };

    const prevVideo = () => {
        setCurrentVideoIndex((prevIndex) =>
            prevIndex === 0 ? testimonialvideos.length - 1 : prevIndex - 1
        );
    };

    return (
        <>
        
        <div className="test_outer">
            <div className="testi_inner">
                <h2 className='same_heading'>Our Testimonials</h2>
                <div className="test_wrapper">
              
                    <div className="testi_left_section">
                        <div className={`testi_wrapper ${isScaling ? 'scale' : 'scale-out'}`}>
                            <div className="test_img">
                                {testimonials[currentIndex]?.images?.length > 0 ? (
                                    testimonials[currentIndex]?.images?.map((image, index) => (
                                        <img
                                            src={`/uploads/${image?.name}`}
                                            alt="testimonials"
                                            key={index}
                                            onError={(e) => { e.target.src = empty.src; }}  
                                        />
                                    ))
                                ) : (
                                    <img src={empty.src} alt="No image available" />
                                )}
                            </div>
                            <div className="test_details">
                                <h3>{testimonials[currentIndex]?.name}</h3>
                                <h4>{testimonials[currentIndex]?.designation}</h4>
                                <p>{testimonials[currentIndex]?.description}</p>
                            </div>
                        </div>
                    </div>

                    {/* Right section for videos */}
                    <div className="testi_right_section">
                        <div className="video_wrapper">
                            <div key={currentVideoIndex} className='videro_wrapper-inner'>
                                <div className="test_desc_wrapper">
                                    <div className="video_name">
                                        <h4>{testimonialvideos[currentVideoIndex]?.name}</h4>
                                    </div>
                                    <div className="video_description">
                                        <p>{testimonialvideos[currentVideoIndex]?.description}</p>
                                    </div>
                                </div>
                                <div className="video_renderr">
                                    <video width='100%' controls height='400px'>
                                        <source
                                            src={testimonialvideos[currentVideoIndex]?.videoUrl}
                                            type="video/mp4"
                                        />
                                        Your browser does not support the video tag.
                                    </video>
                                </div>
                            </div>
                        </div>

                        {/* Video navigation buttons */}
                        <div className="video_navigation">
                            <button onClick={prevVideo}>{'<<'}</button>
                            <button onClick={nextVideo}>{'>>'}</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

         
        </>
    );
}

export default Testimonials;
