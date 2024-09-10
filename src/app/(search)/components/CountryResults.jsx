import Link from 'next/link';
import Image from 'next/image';
import trending from '../../assets/home_images/trending.png';
import ribbon from '../../assets/home_images/ribbon.png';
import emptyImage from '../../assets/home_images/empty.jpg';

const CountryResults = ({ results }) => {
  // Reverse the results array if it exists and is an array
  let reversedCountries = Array.isArray(results) ? [...results].reverse() : [];

  return (
    <>
      <div className="results-section">
        {reversedCountries === null || reversedCountries === undefined || reversedCountries.length === 0 ? (
          ''
        ) : (
          <>
            <h2>Countries:</h2>
            <div className='top-destination'>
              <div className="topdestination container inner-w-container">
                <div className="destinations expert-travel">
                  {reversedCountries.map((country, index) => (
                    <Link className="destination" href={`/countries/${country.slug.toLowerCase().replace(' ', '-')}`} key={index}>
                      <div key={index}>
                        {country.images === null || country.images === undefined || country.images.length === 0 ? (
                          <div className="no-image">No Image Available</div>
                        ) : (
                          country.images.map((e) => (
                            <Image
                              key={e._id}
                              src={`/uploads/${e.name}`}
                              alt={country.name}
                              width={1000}
                              height={300}
                              className="image-travel-expert"
                            />
                          ))
                        )}
                        <span
                          style={{
                            backgroundImage: `url(${ribbon.src})`,
                            backgroundSize: 'cover',
                            backgroundRepeat: 'no-repeat',
                          }}
                          className="trending"
                        >
                          <img src={trending.src} alt="Trending" />
                          TRENDING
                        </span>
                        <div className="info">
                          <h3>{country.title}</h3>
                          <p>{country.countries} Packages</p>
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

export default CountryResults;
