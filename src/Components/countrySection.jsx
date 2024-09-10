'use client';

import Link from 'next/link';
import Image from 'next/image';
import emptyImage from '../app/assets/home_images/empty.jpg';
import exploresection from '../app/assets/home_images/explore-bg.png';
import { EmptyCities } from '@/app/_common/EmptyComponents';

function ExplorationsFarAway({ loading, city }) {


  return (
    <div
      className="explore-section"
      style={{ backgroundImage: `url(${exploresection.src})` }}
    >
      <div className="explorations-container container inner-w-container">
        <h2 className="same_heading">Explore Best Cities</h2>
        <div className="link_heading">
          <p>Ideal for 5-14 days trip</p>
          <Link href="/cities">
            <span className="view-all">View All Cities</span>
          </Link>
        </div>

        <div className="destinations-grid">
          { city === null || city === undefined || city.length === 0 ? (
            <EmptyCities />
          ) : (
            city?.slice(0, 6)?.map((destination) => {
              return (
                <>
                  <Link href={`/cities/${destination.slug}`} key={destination._id}>
                    <div className="destination-card">
                      {destination.images && destination.images.length > 0 ? (
                        <Image
                          key={destination.images[0]._id}
                          src={`/uploads/${destination.images[0].name}`}
                          alt={destination.name || 'loading...'}
                          className="destination-image"
                          width={1000}
                          height={300}
                          priority
                        />
                      ) : (
                        <Image
                          src={emptyImage.src}
                          alt="empty_image"
                          className="destination-image"
                          width={1000}
                          height={300}
                          priority
                        />
                      )}
                      <div className="destination-info">
                        <h3>{destination.title}</h3>
                        <p>
                          From ₹{' '}
                          {destination.package ? destination.package.price : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </Link>
                </>
              )
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default ExplorationsFarAway;
