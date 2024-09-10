'use client';
import Image from 'next/image';
import Link from 'next/link';
import discountc from '../app/assets/home_images/discountcards.png';
import explorebg from '../app/assets/home_images/explore-package-bg.png';
import emptyImage from '../app/assets/home_images/empty.jpg';
import BookingAndLogin from '@/app/_common/bookingAndLogin';
import { EmptyPackages } from '@/app/_common/EmptyComponents';

const BestSellingPackages = ({ packages, loading }) => {
  

 
 

  return (
    <>

      <div className="explore-packages" style={{ backgroundImage: `url(${explorebg.src})` }}>
        <div className="container card_main_section">
          <div className="header_best_selling">
            <h2 className='same_heading'>Explore Best Selling Packages</h2>
            <div className='link_heading'>
              <p>Unlimited Choices | Best Prices | Happy Memories | Hot Deals</p>
              <Link href="/packages"><span className="view-all">View All Packages</span></Link>
            </div>
          </div>

          <div className='card_discount'>
            <div className="packages">
               { packages === null || packages === undefined || packages.length === 0 ? (
                <EmptyPackages />
              ) : (
                packages?.slice(0, 4)?.map((pkg, index) => (
                  <div key={pkg._id} className="package">
                    {pkg.images && pkg.images.length > 0 ? (
                      <Image
                        key={index}
                        src={`/uploads/${pkg.images[0].name}`} // Only displaying the first image
                        alt={pkg.name || "loading..."}
                        width={333}
                        height={380}
                        className="image"
                      />
                    ) : (
                      <Image
                        src={emptyImage.src}
                        alt="No Image Available"
                        width={333}
                        height={380}
                        className="image"
                      />
                    )}
                    <div className="info">
                      <h3>{pkg.title}</h3>
                      <p>{pkg.package_nights} nights / {pkg.package_days} days | {pkg.customizable}</p>
                      <p className="rating">
                        <span className="star">★ {pkg.rating}</span> ({pkg.reviews})
                      </p>
                      <p className="price">From ₹ {pkg.package_price || 0}</p>
                      <div className="buttons">
                        <Link href={`/packages/${pkg.slug}`}><button className="details-btn">View Details</button></Link>
                       <BookingAndLogin pkg={pkg}/>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className='discount_section' style={{
              backgroundImage: `url(${discountc.src})`,
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
            }}>
              <span>Up to 40% Discount!</span>
              <button>Discover More</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};


export default BestSellingPackages;
