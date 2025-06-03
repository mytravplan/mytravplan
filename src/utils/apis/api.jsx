



import { handelAsyncErrors } from "@/helpers/asyncErrors";

export const EXPORT_ALL_APIS = () => {
    
    // define function  here to call all apis
    const fetchApi = async (url, options = {}) => {
        return await handelAsyncErrors(async () => {
            const resp = await fetch(url, options);
            const data = await resp.json();
            return data;
        });
    };


   

  
    const loadSingleContinent = (slug) => fetchApi(`${process.env.NEXT_PUBLIC_HOST_URL}/api/v1/continent/getbyslug/${slug}`);
    const loadSingleTransfer = (slug) => fetchApi(`${process.env.NEXT_PUBLIC_HOST_URL}/api/v1/transfer/getbyslug/${slug}`);
    
   
    const loadSingleCountry = (slug) => fetchApi(`${process.env.NEXT_PUBLIC_HOST_URL}/api/v1/countries/get/${slug}`);
    
    const loadSingleCity = (slug) => fetchApi(`${process.env.NEXT_PUBLIC_HOST_URL}/api/v1/city/getbyslug/${slug}`);
   
    const loadAllCitiesWithLowestPrices = () => fetchApi(`${process.env.NEXT_PUBLIC_HOST_URL}/api/v1/cities/cities-with-lowest-price`);

    const loadAllPackages = () => fetchApi(`${process.env.NEXT_PUBLIC_HOST_URL}/api/v1/packages/get`);

    const fetchPrivacyPolicy = () => fetchApi(`${process.env.NEXT_PUBLIC_HOST_URL}/api/v1/privacy-policy`);
    
  
    const loadSinglePackage = (slug) => fetchApi(`${process.env.NEXT_PUBLIC_HOST_URL}/api/v1/package/getbyslug/${slug}`);
    
     
    const loadSingleBlog = (slug) => fetchApi(`${process.env.NEXT_PUBLIC_HOST_URL}/api/v1/blog/getbyslug/${slug}`);
    
 
    const loadSingleActivity = (slug) => fetchApi(`${process.env.NEXT_PUBLIC_HOST_URL}/api/v1/activity/getbyslug/${slug}`);
    
 
    const loadSinglePackagesActivity = (slug) => fetchApi(`${process.env.NEXT_PUBLIC_HOST_URL}/api/v1/package-category/getbyslug/${slug}`);
    
    const loadSingleUserbookingsdetails = (user_id) => fetchApi(`/api/v1/otpuser/getbyid/${user_id}`);
    
    const sendQueryContactUs = (formData) => fetchApi(`${process.env.NEXT_PUBLIC_HOST_URL}/api/v1/query/send`, { method: 'POST', body: formData });
    const sendQueryBookings = (formData) => fetchApi(`${process.env.NEXT_PUBLIC_HOST_URL}/api/v1/booking/sendquery`, { method: 'POST', body: formData });
    const sendQueryFlights = (formData) => fetchApi(`${process.env.NEXT_PUBLIC_HOST_URL}/api/v1/flight/query/send`, { method: 'POST', body: formData });
    
    const registerUser = (phoneNumber, name) => fetchApi(`${process.env.NEXT_PUBLIC_HOST_URL}/api/v1/otpuser/register`, {
        method: 'POST',
        body: JSON.stringify({ phoneNumber, name })
    });
    
   

    return {
  
        loadSingleContinent,
        loadSingleTransfer,
   
        loadSingleCountry,
        loadSingleCity,
 
        loadAllCitiesWithLowestPrices,
        fetchPrivacyPolicy,
        loadSinglePackage,
        loadAllPackages,
 
        loadSingleBlog,
 
        loadSingleActivity,
  
        loadSinglePackagesActivity,
        loadSingleUserbookingsdetails,
        sendQueryContactUs,
        sendQueryBookings,
        sendQueryFlights,
        registerUser,
    };
};

export const PER_PAGE_LIMIT = 12;


 
