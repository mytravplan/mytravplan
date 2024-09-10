import commentimg from '../../assets/home_images/comment.svg';
import calenderimg from '../../assets/home_images/calender.svg';
import Link from 'next/link';
import { format } from 'date-fns';
import LoadingBar from '@/app/_common/innerLoader/innerLoader';
import Paginations from '@/app/_common/_paginations/paginations';
import emptyImage from '../../assets/home_images/empty.jpg';
import { PER_PAGE_LIMIT } from '@/utils/apis/api';

function BlogCard({ result, setPage, page, totalBlogs, limit }) {
  return (
    <>
      <div className="blog-page">
        {result === null || result === undefined || result.length === 0 ? <EmptyBlogComponent /> : (
          result?.map((ele) => {
            const formattedDate = format(new Date(ele.createdAt), 'dd MMM yyyy');
            return <div className="blogpagecard" key={ele._id}>

              {ele.images?.map((e) => (
                <img
                  src={`/uploads/${e.name}`}

                  key={e._id}
                  alt='blog-image'
                  className="image"
                />
              ))}
              <div className="blogcontent">
                <div className="category">{ele?.category?.slug || 'uncategorised'}</div>
                <div className="meta">
                  <span className="date">
                    <img src={calenderimg.src} alt="Calendar" />{formattedDate}
                  </span>
                  <span className="comments">
                    <img src={commentimg.src} alt="Comments" />{ele.comments || null}
                  </span>
                </div>
                <h3 className="title">{ele.title}</h3>
                <Link href={`/blog/${ele.slug}`}>
                  <button className="link">Read More → </button>
                </Link>
              </div>
            </div>
          })
        )}
      </div>
      {result && <Paginations
        page={page}
        limit={limit}
        totalItems={totalBlogs}
        setPage={setPage}
      />}
    </>
  );
};

function EmptyBlogComponent() {
  return (
    <>
      {Array(PER_PAGE_LIMIT).fill().map((_, index) => (
        <div className="blogpagecard" key={index}>
          <div className="skeleton">
            <div className='skeleton_animation'></div>
            <img
              src={emptyImage.src}
              alt='blog-image'
              className="image"
            />
          </div>
          <div className="blogcontent">
          </div>
        </div>
      ))}
    </>
  );
}
export default BlogCard