// src/app/_common/EmptyComponent.jsx

import Image from 'next/image';
import Link from 'next/link';
import emptyImage from '../assets/home_images/empty.jpg';

export function EmptyContinents() {
  return (
    <>
      {Array(5).fill().map((_, index) => (
        <Link className="card_outer" href="#" key={index}>
          <div className="card">
            <div className="overlay"></div>
            <div className="skeleton">
              <div className="skeleton_animation"></div>
              <Image
                src={emptyImage.src} // Ensure you have imported emptyImage at the top of the file
                alt="Loading"
                style={{ width: '100%', height: '100%' }}
                width={1000}
                height={300}
                className="image word_section_image"
              />
            </div>
            <div className="text"></div>
          </div>
        </Link>
      ))}
    </>
  );
}

export function EmptyCountries() {
  return (
    <>
      {Array(8).fill().map((_, index) => (
        <Link href="#" className="destination" key={index}>
          <div>
            <div className="skeleton">
              <div className="skeleton_animation"></div>
              <Image
                src={emptyImage.src} // Ensure you have imported emptyImage at the top of the file
                alt="Loading"
                width={1000}
                height={300}
                className="image-travel-expert"
                style={{ width: '100%', height: '100%' }}
              />
              <span className="trending"></span>
            </div>
            <div className="info">
              <h3></h3>
              <p></p>
            </div>
          </div>
        </Link>
      ))}
    </>
  );
}

export function EmptyCities() {
  return (
    <>
      {Array(6).fill().map((_, index) => (
        <Link href="#" key={index}>
          <div className="destination-card">
            <div className="skeleton">
              <div className='skeleton_animation'></div>
              <Image
                src={emptyImage.src}
                alt="Loading"
                className="destination-image"
                width={1000}
                height={300}
                priority
              />
            </div>
            <div className="destination-info">
              <h3></h3>
              <p></p>
            </div>
          </div>
        </Link>
      ))}
    </>
  );
}

export function EmptyPackages() {
  return (
    <>
      {Array(4).fill().map((_, index) => (
        <div key={index} className="package">
          <div className="skeleton">
            <div className='skeleton_animation'></div>
            <Image
              src={emptyImage.src}
              alt="Loading"
              width={333}
              height={380}
              className="image"
            />
          </div>
        </div>
      ))}
    </>
  );
}

export function EmptyActivityPackages() {
  return (
    <>
      <div className="destinations-container-countries">
        {Array(6).fill().map((_, index) => (
          <div key={index} className="destination">
            <Link href="#">
              <div className="skeleton">
                <div className='skeleton_animation'></div>
                <Image
                  src={emptyImage.src}
                  alt='packages_categories'
                  width={100}
                  height={100}
                  className="destination-image"
                />
              </div>
              <p></p>
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}

export function EmptyBlogComponent() {
  return (
    <>
      <div className="blog-main">
        <div className="blog-placeholder">
        <div className="skeleton">
        <div className='skeleton_animation'></div>
          <Image
            src={emptyImage.src}
            alt="Loading"
            width={400}
            height={250}
            className="image"
          />
          </div>
          <div className="blog-content">
            <div className='title_date'>
              <span className="category"></span>
              <span className="date"></span>
            </div>
            <h3></h3>
          </div>
        </div>
      </div>

      <div className="blog-side">
        {Array(2).fill().map((_, index) => (
        
          <div key={index} className="blog-side-item">
            <div className="skeleton">
            <div className='skeleton_animation'></div>
            <Image
              src={emptyImage.src}
              alt="Loading"
              width={200}
              height={125}
              className="blog-image"
            />
            </div>
            <div className="blog-content">
              <div className='title_date'>
                <span className="category"></span>
                <span className="date"></span>
              </div>
              <h3></h3>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}