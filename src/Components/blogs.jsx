'use client';
import Image from 'next/image';
import Link from 'next/link';
import blogbg from '../app/assets/home_images/blog-bg.png';
 
import { format } from 'date-fns';
import { EmptyBlogComponent } from '@/app/_common/EmptyComponents';

const LatestBlog = ({blogs}) => {

  return (
    <div className='blog-bg' style={{ backgroundImage: `url(${blogbg.src})` }}>
      <div className="latest-blog">
        <h2 className='blog-heading'>Latest News And Inspirational Blog</h2>
        <div className='link-btn-heading'>
          <p>Unlimited Choices | Best Prices | Happy Memories | Hot Deals</p>
          <Link href="/blog">
            <span className="view-all">View All Blogs</span>
          </Link>
        </div>

        <div className="blog-container">
          { blogs === null || blogs === undefined || blogs.length === 0 ? (
            <EmptyBlogComponent/>
          ) : (
            <>
        
              <div className="blog-main">
                {blogs?.slice(0, 1)?.map((ele) => {
                  const formattedDate = format(new Date(ele.createdAt), 'dd MMM yyyy');

                  return (
                    <Link href={`/blog/${ele.slug}`} key={ele._id}>
                    <div >
                      {ele.images?.map((e) => (
                        <Image
                          key={e._id}
                          src={`/uploads/${e.name}`}
                          alt={e.name}
                          width={400}
                          height={250}
                          className="image"
                        />
                      ))}
                      <div className="blog-content">
                        <div className='title_date'>
                          <span className="category">{ele.category?.name || 'Uncategorized'}</span>
                          <span className="date">{formattedDate}</span>
                        </div>
                        <h3>{ele.title}</h3>
                      </div>
                    </div>
                    </Link>
                  );
                 
                })}
              </div>

              <div className="blog-side">
                {blogs?.slice(1, 3)?.map((blog, index) => {
                  const formattedDate = format(new Date(blog.createdAt), 'dd MMM yyyy');
                  return (
                    <Link href={`/blog/${blog.slug}`} key={index}>
                    <div key={blog._id} className="blog-side-item">
                      {blog.images?.map((image) => (
                        <Image
                          key={image._id}
                          src={`/uploads/${image.name}`}
                          alt={blog.title}
                          width={200}
                          height={125}
                          className="blog-image"
                        />
                      ))}
                      <div className="blog-content">
                        <div className='title_date'>
                          <span className="category">{blog.category?.name || 'Uncategorized'}</span>
                          <span className="date">{formattedDate}</span>
                        </div>
                        <h3>{blog.title}</h3>
                      </div>
                    </div>
                    </Link>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LatestBlog;
