'use client';

import { useState } from 'react';

const TravelGallery = ({ result }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState('');

  const openModal = (imageSrc) => {
    setCurrentImage(imageSrc);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setCurrentImage('');
  };

  return (
    <div className="gallery">
      {result === undefined || result === null ? (
        ''
      ) : (
        result.map((ele, index) => (
          <div key={index}>
            <h2>{ele.title}</h2>
            <div className="images">
              <div className="imageContainer">
                {ele.packages_galleries === null ||
                ele.packages_galleries === undefined ||
                ele.packages_galleries.length === 0 ? (
                  ''
                ) : (
                  <>
                    <div className="leftImage" onClick={() => openModal(`/uploads/${ele.packages_galleries[0].name}`)}>
                      <img
                        src={`/uploads/${ele.packages_galleries[0].name}`}
                        alt="Large Image"
                        className="largeImage"
                      />
                    </div>
                    <div className="rightImages">
                      {ele.packages_galleries.slice(1, 3).map((e, idx) => (
                        <img
                          src={`/uploads/${e.name}`}
                          alt={`Image ${idx + 2}`}
                          key={idx}
                          className="smallImage"
                          onClick={() => openModal(`/uploads/${e.name}`)}
                        />
                      ))}
                    </div>
                  </>
                )}
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
    </div>
  );
};

export default TravelGallery;
