import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
// import styles from './LatestNews.module.css';

const newsItems = [
  {
    category: 'Tips & Tricks',
    title: 'A Coastal Paradise Discovering the Charms of Norway',
    date: '01 Jun 2024',
    imgSrc: '/images/europe_img_1.png',
  },
  {
    category: 'Solo Travel',
    title: 'A Coastal Paradise Discovering the Charms of Poland',
    date: '03 Jun 2024',
    imgSrc: '/images/europe_img_1.png',
  },
  {
    category: 'Packing Tips',
    title: 'A Coastal Paradise Discovering the Charms of Portugal',
    date: '10 Jun 2024',
    imgSrc: '/images/europe_img_1.png',
  },
];

const LatestNews = () => {
  return (
    <div className="latest-news-container">
    <div className="inner-w-container">
      <h2 className="latest-news-title">Latest News And Inspirational Blog</h2>
      <p className="latest-news-subtitle">Unlimited Choices | Best Prices | Happy Memories | Hot Deals</p>
      <div className="latest-news-gridContainer">
        <div className="latest-news-mainCard">
          <Image
            src={newsItems[0].imgSrc}
            alt={newsItems[0].title}
            width={1000}
            height={500}
            className="latest-news-image"
          />
          <div className="latest-news-details">
            <div className="latest-news-category">{newsItems[0].category}</div>
            <h3 className="latest-news-title">{newsItems[0].title}</h3>
            <div className="latest-news-date">{newsItems[0].date}</div>
          </div>
        </div>
        <div className="latest-news-sideCards">
          {newsItems.slice(1).map((item, index) => (
            <Link className="latest-news-cardOuter" href={`/${item.title.toLowerCase().replace(/ /g, '-')}`} key={index}>
              <div className="latest-news-card">
                <Image
                  src={item.imgSrc}
                  alt={item.title}
                  width={500}
                  height={250}
                  className="latest-news-image"
                />
                <div className="latest-news-details">
                  <div className="latest-news-category">{item.category}</div>
                  <h3 className="latest-news-title">{item.title}</h3>
                  <div className="latest-news-date">{item.date}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
    </div>
  );
};

export default LatestNews;
