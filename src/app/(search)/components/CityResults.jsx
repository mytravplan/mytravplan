import Link from 'next/link';
import Image from 'next/image';
import emptyImage from '../../assets/home_images/empty.jpg';
import exploresection from '../../assets/home_images/explore-bg.png';

const CityResults = ({ results }) => {
  // Reverse the results array if it exists and is an array
  let reversedFilterCities = Array.isArray(results) ? [...results].reverse() : [];

  return (
    <>
      <div className="results-section">
        {reversedFilterCities === null || reversedFilterCities === undefined || reversedFilterCities.length === 0 ? (
          ''
        ) : (
          <>
            <h2>Cities:</h2>
            <div className="explore-section">
              <div className="explorations-container container inner-w-container">
                <div className="destinations-grid">
                  {reversedFilterCities.slice(0, 6).map((destination) => (
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
                            alt="No Image Available"
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
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default CityResults;
