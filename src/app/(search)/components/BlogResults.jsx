import Image from 'next/image';
import Link from 'next/link';
import blogbg from '../../assets/home_images/blog-bg.png';
import emptyImage from '../../assets/home_images/empty.jpg';
import { format } from 'date-fns';

const BlogResults = ({ results }) => {
  // Reverse and handle results
  let reversedBlogs = Array.isArray(results) ? [...results].reverse() : [];

  return (
    <div className="results-section">
      {reversedBlogs === undefined || reversedBlogs === null || reversedBlogs.length === 0 ? (
        ''
      ) : (
        <>
          <h2>Blogs:</h2>
          <div className='blog-bg'>
            <div className="latest-blog">
              <div className="blog-container">
                <div className="blog-main">
                  {reversedBlogs.map((ele) => {
                    const formattedDate = format(new Date(ele.createdAt), 'dd MMM yyyy');

                    return (
                      <Link href={`/blog/${ele.slug}`} key={ele._id}>
                        <div className="blog-card">
                          {ele.images && ele.images.length > 0 ? (
                            ele.images.map((e) => (
                              <Image
                                key={e._id}
                                src={`/uploads/${e.name}`}
                                alt={e.name || 'No image'}
                                width={400}
                                height={250}
                                className="image"
                              />
                            ))
                          ) : (
                            <Image
                              src={emptyImage}
                              alt="No image available"
                              width={400}
                              height={250}
                              className="image"
                            />
                          )}
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
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default BlogResults;
