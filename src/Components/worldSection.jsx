import Link from 'next/link';
import Image from 'next/image';
import triangle from '../app/assets/home_images/triangle.png';
import camerabg from '../app/assets/home_images/camera-bg.png';
import { EmptyContinents } from '@/app/_common/EmptyComponents';

function WorldSection({ continent }) {

   

  return (
    <>


      <div className='world-country' style={{ backgroundImage: `url(${camerabg.src})` }}>
        <div className="world-country-inner">
          <div className="continents-headers">
            <h2 className='same_heading'>Explore Continents</h2>
            <h2 className='same_heading'>random text to cehck this on live</h2>
            <div className='link_heading'>
              <p>Unlimited Choices | Best Prices | Happy Memories | Hot Deals</p>
              <Link href="/continents"><span className="view-all">View All Continents</span></Link>
            </div>
          </div>
        <div className="grid-container">

          { continent === null || continent === undefined || continent.length === 0 ? (
            <EmptyContinents />
          ) : (
            continent.slice(0, 5).map((country, index) => (
              <Link className="card_outer" href={`/continents/${country.slug.toLowerCase().replace(' ', '-')}`} key={index}>
                <div className="card">
                  <div className="overlay">
                    <div className="label">{country.total_countries} Countries <Image src={triangle} alt="Triangle" style={{ width: 'auto', height: 'auto' }} /></div>
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
            ))
          )}
        </div>
      </div>
      </div>
    </>
  );
}

export default WorldSection;
