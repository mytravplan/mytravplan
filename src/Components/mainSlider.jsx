
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import europeone from '../../public/images/europeone.jpg';
import europetwo from '../../public/images/europeteo.jpg';
import europethree from '../../public/images/europethree.jpg';
import europefour from '../../public/images/europefour.jpg';
import explore from '../app/assets/home_images/explore.png';
import desti from '../app/assets/home_images/search-destination.png';
import SearchResults from './SearchResults';

const Slider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const router = useRouter();

  const images = [
    { src: europeone, alt: 'Hero Image' },
    { src: europetwo, alt: 'Hero Image' },
    { src: europethree, alt: 'Hero Image' },
    { src: europefour, alt: 'Hero Image' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  const handleSearch = () => {
    const formattedQuery = searchQuery.trim().toLowerCase().replace(/\s+/g, '-');
    if (formattedQuery) {
      router.push(`/search?query=${encodeURIComponent(formattedQuery)}`);
    }
  };
  

  return (
    <div className="slider">
      <Image
        className='slider-images'
        src={images[currentIndex].src}
        alt={images[currentIndex].alt || "loading..."}
        priority
        width={1920}
        height={999}
        objectFit='cover'
      />
      <div className="content">
        <h1 className="title">We Fell Travel</h1>
        <div className="searchContainer">
          <div className='search-desti'>
            <img src={desti.src} alt="Destination Icon" className="desti-icon" />
            <input
              type="text"
              placeholder="You Are Searching For"
              className="searchInput"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowResults(true)}
              onBlur={() => setTimeout(() => setShowResults(false), 100)} // Delay hiding to allow click
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            {showResults && <SearchResults query={searchQuery} closePopup={() => setShowResults(false)} />}
          </div>
          <button className="searchButton" onClick={handleSearch}>
            <img src={explore.src} alt="Explore" /> Explore
          </button>
        </div>
      </div>
    </div>
  );
};

export default Slider;
