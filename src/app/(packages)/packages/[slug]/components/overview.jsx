'use client';

import React, { useState } from 'react';
import Inclusions from './inclusions';
import LoadingBar from '@/app/_common/innerLoader/innerLoader';
import BookingAndLogin from '@/app/_common/bookingAndLogin';
import emptyImage from '../../../../assets/home_images/empty.jpg';

const Itinerary = ({ result }) => {
  const [openDay, setOpenDay] = useState(null);
  const [activeTab, setActiveTab] = useState('inclusions');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState('');

  const toggleDay = (day) => {
    setOpenDay(openDay === day ? null : day);
  };

  const openModal = (imageSrc) => {
    setCurrentImage(imageSrc);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setCurrentImage('');
  };

  return (
    <>
      {result === undefined || result === null ? (
        <div className='overview' style={{ margin: '20px auto' }}>
          <EmptyComponent />
        </div>
      ) : (
        result.map((ele) => (
          <div className='overview' key={ele._id}>
            <div className='over'>
              <h2 className='heading_inner_page'>Overview</h2>
              <p>{ele.packageOverview || null}</p>
            </div>

            <div className='summary_slider'>
              <div className="itinerary_inner">
                <div className='itenary_contact'>
                  <div className='top_summary'>
                    <div className='top_summary_inner'>
                      <h2 className='heading_inner_page'>Top Summary</h2>
                      <p>{ele.packageTopSummary}</p>
                    </div>
                  </div>

                  <div className='iten_inner'>
                    <h2 className='heading_inner_page'>Itinerary</h2>
                    <div className='day_content'>
                      {ele.packageItinerary === null || ele.packageItinerary === undefined ? (
                        <LoadingBar />
                      ) : (
                        ele.packageItinerary.map((item) => (
                          <div key={item._id} className="day">
                            <div className="dayHeader" onClick={() => toggleDay(item.day)}>
                              <span>Day {item.day}: {item.location}</span>
                              <span>{openDay === item.day ? '↑' : '↓'}</span>
                            </div>
                            {openDay === item.day && (
                              <div className="dayContent">
                                <p>{item.itinerary_description}</p>
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="tabs_inclusion">
                    <button
                      className={activeTab === 'inclusions' ? 'active' : ''}
                      onClick={() => setActiveTab('inclusions')}
                    >
                      Inclusions & Exclusions
                    </button>
                    <button
                      className={activeTab === 'activities' ? 'active' : ''}
                      onClick={() => setActiveTab('activities')}
                    >
                      Hotel Activities
                    </button>
                  </div>
                  <div className="tabContent">
                    {activeTab === 'inclusions' ? (
                      <Inclusions
                        packagesExclude={ele.packagesExclude}
                        packagesInclude={ele.packagesInclude}
                      />
                    ) : (
                      'no result found'
                    )}
                  </div>
                  {/* <button className="book-now-btn">
                    <a href='/contact-us'>Book Now</a>
                  </button> */}
                  <div className="card_main_section">
                    <div className="buttons">
                      <BookingAndLogin pkg={ele} />
                    </div>
                  </div>
                </div>


                <div className='right_query'>
                  <div className='card_contact'>
                    <span>Package Code: 128391823</span>
                    <div className='question'>
                      <h1>Have a Question?</h1>
                      <p>
                        Do not hesitate to give us a call. We are an expert team and we are happy to talk to you
                      </p>
                      <div className='contact_card'>
                        <a href='tel:+91 8627814386'>+91 8627814386</a>
                        <a href='mailto:booking@streetromeo.com'>booking@streetromeo.com</a>
                      </div>
                    </div>
                  </div>

                  {ele.packages_galleries === null || ele.packages_galleries.length === 0 ? (
                    ''
                  ) : (
                    <div className='gallery_inner_page'>
                      <div className="sidebar-gallery">
                        <h2>Gallery</h2>
                        <div className="galleryGrid">
                          {ele.packages_galleries.slice(0, 3).map((e, index) => (
                            <img
                              src={`/uploads/${e.name}`}
                              alt={`Image ${index + 1}`}
                              key={index}
                              onClick={() => openModal(`/uploads/${e.name}`)}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))
      )}

      {modalIsOpen && (
        <div className="preview_package_gallery_image">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span>
            <img src={currentImage} alt="Preview" className="modal-image" />
          </div>
        </div>
      )}
    </>
  );
};


function EmptyComponent() {
  return (
      <>
          {Array(1).fill().map((_, index) => (
             <div className='overview' key={index}>
             <div className='summary_slider'>
               <div className="itinerary_inner">
                 <div className='itenary_contact'>
                   <div className='top_summary aaa'>
                     <div className='top_summary_inner'>
                     </div>
                   </div>
 
                   <div className='iten_inner aaa'>
                     <h2 className='heading_inner_page'></h2>
                     <div className='day_content'>
                     </div>
                   </div>
                   <div className="tabs_inclusion">
                   </div>
                   <div className="tabContent aaa">
                   </div>
                 </div>
 
 
                 <div className='right_query'>
                   <div className='card_contact aaa'>
                     
                   </div>

                     <div className='gallery_inner_page'>
                       <div className="sidebar-gallery">
                         <div className="galleryGrid aaa">
                             <img
                               src={emptyImage.src}
                             />
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

export default Itinerary;
