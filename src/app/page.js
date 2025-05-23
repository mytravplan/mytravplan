'use client';
import { useEffect, useState } from 'react';
import { getSession } from 'next-auth/react';
import Layout from './_common/layout/layout';
import Homepage from './_homepage/homepage';
import LoginPopup from '@/Components/loginPopup/Components/popup';
import QueryForm from '@/Components/autoloadPopup/QueryForm';
import useFetchAllSections from '@/hooks/useLoadApiHook';

export default function Home() {
  const response = useFetchAllSections();

  const {
    continents = [],
    countries = [],
    cities = [],
    packages = [],
    blogs = [],
    packageCategories = [],
    testimonials = [],
    testimonialvideos = [],
    sliderImages = []
  } = response.data || {};

  const { loading } = response;

  // State for pop-ups and user verification
  const [isopenForm, setIsopenForm] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [userVerified, setUserVerified] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  console.log(userVerified)

  useEffect(() => {
    const checkSessionAndShowPopups = async () => {
      const popupShown = sessionStorage.getItem('popupShown');

      if (!popupShown) {
        try {
          const session = await getSession();
          if (session && session.user) {
            setUserVerified(session.user.role === 'user');
            setIsAdmin(session.user.role === 'admin');

            // Show BookingForm only if user is verified and not an admin
            setIsopenForm(session.user.role === 'user' && !isAdmin);
            
            // Show LoginPopup if not a user
            if (session.user.role !== 'user') {
              setTimeout(() => {
                setIsLogin(true);
              }, 3000); // Delay for 2 seconds
            }
          } else {
            setUserVerified(false);
            setIsAdmin(false);
            setTimeout(() => {
              setIsLogin(true); // Show LoginPopup if no session after delay
            }, 3000); // Delay for 2 seconds
            setIsopenForm(false); // Ensure BookingForm is not shown
          }

          sessionStorage.setItem('popupShown', 'true');
        } catch (error) {
          console.error('Error checking verification:', error);
        }
      }
    };

    checkSessionAndShowPopups();
  }, [isAdmin]);

  return (
    <>
      {isopenForm && <QueryForm setIsopenForm={setIsopenForm} />}
      {isLogin && <LoginPopup setIsLogin={setIsLogin} />}
      <Layout>
        <Homepage
          continent={continents}
          loading={loading}
          country={countries}
          city={cities}
          packages={packages}
          blogs={blogs}
          packagescat={packageCategories}
          testimonials={testimonials}
          testimonialvideos={testimonialvideos}
          sliderImages={sliderImages}
        />
      </Layout>
    </>
  );
}
