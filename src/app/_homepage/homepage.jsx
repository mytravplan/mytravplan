import LatestBlog from '@/Components/blogs'
import ExplorationsFarAway from '@/Components/countrySection'
import ExploreDestinations from '@/Components/exploredestinations'
import BestSellingPackages from '@/Components/packagecards'
import Destinations from '@/Components/topcoutrypackages'
import World_section from '@/Components/worldSection'
import React from 'react'
import aeroplane from '../assets/home_images/aeroplane-bg.png';
import Slider from '@/Components/mainSlider'
import Testimonials from '@/Components/testimonials'
  
function Homepage({loading,continent,country,city,packages,blogs,packagescat,testimonials,testimonialvideos,sliderImages}) {
 
  return (
   <>
   <div className='main_slider'>
          <div className='main_slider_inner' style={{ backgroundImage: `url(${aeroplane.src})` }}>
            <Slider sliderImages={sliderImages}/>
          </div>

          <div className='outer_section'>

            <World_section continent={continent} loading={loading}/>
            <BestSellingPackages packages={packages} loading={loading}/>
            <ExplorationsFarAway city={city} loading={loading}/>


            {/* <ExploreDestinations packagescat={packagescat}/> */}
            <Testimonials testimonials={testimonials} testimonialvideos={testimonialvideos} loading={loading}/>

            <LatestBlog blogs={blogs} loading={loading}/>
            <Destinations country={country} loading={loading}/>



          </div>

        </div>
   </>
  )
}

export default Homepage
