import Link from 'next/link';
import Image from 'next/image';
import triangle from '../../assets/home_images/triangle.png';
import emptyImage from '../../assets/home_images/empty.jpg';

const ContinentResults = ({ results }) => {
  let reversedContinents = Array.isArray(results) ? [...results].reverse() : [];

  return (
    <>
      <div className="results-section">
        {reversedContinents === undefined || reversedContinents === null || reversedContinents.length === 0 ? (
          ''
        ) : (
          <>
            <h2>Continents:</h2>
            <div className='world-country'>
              <div className="grid-container">
                {reversedContinents.map((country, index) => (
                  <Link className="card_outer" href={`/continents/${country.slug.toLowerCase().replace(' ', '-')}`} key={index}>
                    <div className="card">
                      <div className="overlay">
                        <div className="label">
                          {country.total_countries} Countries
                          <Image src={triangle} alt="Triangle" style={{ width: 'auto', height: 'auto' }} />
                        </div>
                      </div>
                      {country.images && country.images.length > 0 ? (
                        <Image
                          src={`/uploads/${country.images[0].name}`}
                          alt={country.name || "loading..."}
                          style={{ width: '100%', height: '100%' }}
                          width={1000}
                          height={300}
                          className="image"
                        />
                      ) : (
                        <div className="no-image">No Image Available</div>
                      )}
                      <div className="text">{country.title}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ContinentResults;
