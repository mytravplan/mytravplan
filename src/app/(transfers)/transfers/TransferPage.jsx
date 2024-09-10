

'use client'
import LatestBlog from '@/Components/blogs';
import useFetchAllSections from '@/hooks/useLoadApiHook';
import { PER_PAGE_LIMIT } from '@/utils/apis/api';
import emptyImage from '../../assets/home_images/empty.jpg';
import Image from 'next/image';

function TransferPage() {

  const { data } = useFetchAllSections(1, PER_PAGE_LIMIT); 

  if (!data || !data.blogs) return <EmptyBlogComponent/>;
  
  return (
    <>
    <LatestBlog blogs={data.blogs}/>
    </>
  )
}

function EmptyBlogComponent() {
  return (
    <>
    <div className='blog-bg'>
    <div className="latest-blog">
    <div className="blog-container">
      <div className="blog-main">
        <div className="blog-placeholder">
        <div className="skeleton">
        <div className='skeleton_animation'></div>
          <Image
            src={emptyImage.src}
            alt="Loading"
            width={400}
            height={250}
            className="image"
          />
          </div>
          <div className="blog-content">
            <div className='title_date'>
              <span className="category"></span>
              <span className="date"></span>
            </div>
            <h3></h3>
          </div>
        </div>
      </div>
      <div className="blog-side">
        {Array(2).fill().map((_, index) => (
        
          <div key={index} className="blog-side-item">
            <div className="skeleton">
            <div className='skeleton_animation'></div>
            <Image
              src={emptyImage.src}
              alt="Loading"
              width={200}
              height={125}
              className="blog-image"
            />
            </div>
            <div className="blog-content">
              <div className='title_date'>
                <span className="category"></span>
                <span className="date"></span>
              </div>
              <h3></h3>
            </div>
          </div>
        ))}
      </div>
      </div>
      </div>
      </div>
    </>
  );
}

export default TransferPage