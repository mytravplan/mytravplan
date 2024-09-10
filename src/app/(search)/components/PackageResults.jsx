import Image from 'next/image';
import Link from 'next/link';
import discountc from '../../assets/home_images/discountcards.png';
import explorebg from '../../assets/home_images/explore-package-bg.png';
import emptyImage from '../../assets/home_images/empty.jpg';
import { useEffect, useState } from 'react';
import { getSession } from 'next-auth/react'; 
import BookingForm from "@/Components/(bookings)/bookings/bookingForm";
import LoginPopup from "@/Components/loginPopup/Components/popup";

const PackageResults = ({ results }) => {
  const [userVerified, setUserVerified] = useState(false);
  const [isOpenForm, setIsOpenForm] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [selectedPackageId, setSelectedPackageId] = useState(null);

  const checkUserVerification = async () => {
    try {
      const session = await getSession();
      if (session && session.user) {
        setUserVerified(session.user.role === 'user');
      } else {
        setUserVerified(false);
      }
    } catch (error) {
      console.error('Error checking verification:', error);
    }
  };

  useEffect(() => {
    checkUserVerification();
  }, []);

  const bookingAndLogin = (pkgId) => {
    if (!userVerified) {
      setIsLogin(true);
    } else {
      setSelectedPackageId(pkgId);
      setIsOpenForm(true);
    }
  };

  // Ensure reversedPackages is a valid array
  const reversedPackages = Array.isArray(results) ? [...results].reverse() : [];

  return (
    <div className="results-section">
      {isOpenForm && <BookingForm setIsOpenForm={setIsOpenForm} packageId={selectedPackageId} />}
      {isLogin && <LoginPopup setIsLogin={setIsLogin} />}

      {(reversedPackages.length === 0) ? (
        <EmptyPackageComponent/>
      ) : (
        <>

          <h2>Packages:</h2>
          <div className="container card_main_section">
            <div className='card_discount'>
              <div className="packages">
                {reversedPackages.map((pkg) => (
                  <div key={pkg._id} className="package">
                    {pkg.images && pkg.images.length > 0 ? (
                      pkg.images.map((image) => (
                        <Image
                          key={image._id}
                          src={`/uploads/${image.name}`}
                          alt={pkg.name || "loading..."}
                          width={333}
                          height={380}
                          className="image"
                        />
                      ))
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
                        <Link href={`/packages/${pkg.slug}`}>
                          <button className="details-btn">View Details</button>
                        </Link>
                        <button className="enquiry-btn" onClick={() => bookingAndLogin(pkg._id)}>Book Now</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};


function EmptyPackageComponent() {
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
          <div className="info">
            <h3></h3>
            <p></p>
            <p className="rating">
              <span className="star"></span>
            </p>
            <p className="price"></p>
          </div>
        </div>
      ))}
    </>
  );
}

export default PackageResults;
