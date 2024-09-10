


// 'use client' 
// import { EXPORT_ALL_APIS } from '@/utils/apis/api';
// import Layout from './_common/layout/layout';
// import Homepage from './_homepage/homepage';
// import { useEffect, useState } from 'react';


// export default  function Home() {

//   let api=EXPORT_ALL_APIS()
//   let [loading, setLoading] = useState(true);
//   let[continent,setContinent]=useState([])
//   let[country,setCountry]=useState([])
//   let[city,setCity]=useState([])
//   let[packages,setPackages]=useState([])
//   let[blogs,setBlogs]=useState([])
//   let[packagescat,setPackagesCat]=useState([])

//   let fetchAllContinents=async()=>{
//     let data=await api.loadAllContinents()
//     setContinent(data)
//     setLoading(false)
//   }

//   let fetchAllCountries=async()=>{
//     let data=await api.loadAllCountries()
//     setCountry(data)
//     setLoading(false)
//   }
//   let fetchAllCities=async()=>{
//     let data=await api.loadAllCitiesWithLowestPrices()
//     setCity(data)
//     setLoading(false)
//   }

//   let fetchAllPackages=async()=>{
//     let data=await api.loadAllPackages()
//     setPackages(data)
//     setLoading(false)
//   }
//   let fetchAllBlogs=async()=>{
//     let data=await api.loadAllBlogs()
//     setBlogs(data)
//     setLoading(false)
//   }
//   let fetchAllPackagesCategories=async()=>{
//     let data=await api.loadAllPackagesActivities()
//     setPackagesCat(data)
//     setLoading(false)
//   }




//   useEffect(()=>{
//     fetchAllContinents()
//     fetchAllCountries()
//     fetchAllCities()
//     fetchAllPackages()
//     fetchAllBlogs()
//     fetchAllPackagesCategories()
//   },[])








//   return (

//     <>
//       <Layout>


//         <Homepage continent={continent} loading={loading} country={country} city={city} packages={packages} blogs={blogs} packagescat={packagescat}/>

//       </Layout>
//     </>



//   );
// }


// 'use client';
// import { EXPORT_ALL_APIS } from '@/utils/apis/api';
// import Layout from './_common/layout/layout';
// import Homepage from './_homepage/homepage';
// import { useEffect, useState } from 'react';
// import { getSession } from 'next-auth/react';
// import LoginPopup from '@/Components/loginPopup/Components/popup';
// import QueryForm from '@/Components/autoloadPopup/QueryForm';
// import useFetchAllSections from '@/hooks/useLoadApiHook';

// export default function Home() {
//     let response = useFetchAllSections()

//     const {
//         continents = [],
//         countries = [],
//         cities = [],
//         packages = [],
//         blogs = [],
//         packageCategories = []
//     } = response.data || {};
//     let {loading}=response
 

   

//     // State for managing pop-ups
//     const [isopenForm, setIsopenForm] = useState(false);
//     const [isLogin, setIsLogin] = useState(false);
//     const [userVerified, setUserVerified] = useState(false);
//     const [isAdmin, setIsAdmin] = useState(false);  

//     useEffect(() => {

//         const checkSessionAndShowPopups = async () => {
//             const popupShown = sessionStorage.getItem('popupShown');

//             if (!popupShown) {
//                 try {
//                     const session = await getSession();
//                     if (session && session.user) {
//                         setUserVerified(session.user.role === 'user');
//                         setIsAdmin(session.user.role === 'admin'); // Set admin status

//                         // Show BookingForm only if user is verified and not an admin
//                         setIsopenForm(session.user.role === 'user' && !isAdmin);
//                         setIsLogin(session.user.role !== 'user'); // Show LoginPopup if not a user
//                     } else {
//                         setUserVerified(false);
//                         setIsAdmin(false); // Ensure admin status is false if not logged in
//                         setIsLogin(true); // Show LoginPopup if no session
//                         setIsopenForm(false); // Ensure BookingForm is not shown
//                     }

//                     // Mark the popup as shown
//                     sessionStorage.setItem('popupShown', 'true');
//                 } catch (error) {
//                     console.error('Error checking verification:', error);
//                 }
//             }
//         };

//         checkSessionAndShowPopups()
//     }, []);

//     return (
//         <>
//             {/* Pop-ups for login and booking form */}
//             {isopenForm && <QueryForm setIsopenForm={setIsopenForm} />}
//             {isLogin && <LoginPopup setIsLogin={setIsLogin} />}

//             <Layout>
//                 <Homepage
//                     continent={continents}
//                     loading={loading}
//                     country={countries}
//                     city={cities}
//                     packages={packages}
//                     blogs={blogs}
//                     packagescat={packageCategories}
//                 />
//             </Layout>
//         </>
//     );
// }



'use client';
import { useEffect, useState, useMemo } from 'react';
import { getSession } from 'next-auth/react';
import Layout from './_common/layout/layout';
import Homepage from './_homepage/homepage';
import LoginPopup from '@/Components/loginPopup/Components/popup';
import QueryForm from '@/Components/autoloadPopup/QueryForm';
import useFetchAllSections from '@/hooks/useLoadApiHook';
import dynamic from 'next/dynamic';

 

export default function Home() {
 
  const response = useFetchAllSections();
  console.log(response);
  
  const {
    continents = [],
    countries = [],
    cities = [],
    packages = [],
    blogs = [],
    packageCategories = []
  } = response.data || {};

  const { loading } = response;

  // Memoizing the homepage data
  const memoizedHomepageData = useMemo(() => ({
    continent: continents,
    country: countries,
    city: cities,
    packages: packages,
    blogs: blogs,
    packagescat: packageCategories
  }), [continents, countries, cities, packages, blogs, packageCategories]);

  // State for pop-ups and user verification
  const [isopenForm, setIsopenForm] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [userVerified, setUserVerified] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

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
            setIsLogin(session.user.role !== 'user'); // Show LoginPopup if not a user
          } else {
            setUserVerified(false);
            setIsAdmin(false);
            setIsLogin(true); // Show LoginPopup if no session
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
      {/* Pop-ups for login and booking form */}
      {isopenForm && <QueryForm setIsopenForm={setIsopenForm} />}
      {isLogin && <LoginPopup setIsLogin={setIsLogin} />}

      <Layout>
     
        <Homepage
          continent={memoizedHomepageData.continent}
          loading={loading}
          country={memoizedHomepageData.country}
          city={memoizedHomepageData.city}
          packages={memoizedHomepageData.packages}
          blogs={memoizedHomepageData.blogs}
          packagescat={memoizedHomepageData.packagescat}
        />
      </Layout>
    </>
  );
}
