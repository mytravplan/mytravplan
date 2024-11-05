
// 'use client';

// import { usePathname } from 'next/navigation';

// export default function Topbanner({ slug }) {
//   const pathname = usePathname();

//   // Split the path to get all path segments after the first "/"
//   const pathParts = pathname.split('/').filter(part => part);

//   // Remove the last part (slug) from the path
//   const parentPath = pathParts.slice(0, -1).join(' / ');

//   return (
//     <div
//       className='top_banner_destination'
//       style={{
//         backgroundImage: `url('/images/destinationfullbanner.png')`,
//         backgroundSize: 'cover',
//         backgroundPosition: 'center',
//         height: '400px',
//       }}
//     >
//       <div className='heading_two'>
//         <h2>
//           Explore <span>{slug}</span>
//         </h2>
//         <span className='hamburger'>{parentPath} / {slug}</span>
//       </div>
//     </div>
//   );
// }




'use client';

import BookingFromQuery from '@/Components/(bookings)/bookings/bookingFromQuery';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';

export default function Topbanner() {
  const { data: session } = useSession();
  const pathname = usePathname();

  // Split the path to get all path segments after the first "/"
  const pathParts = pathname.split('/').filter(part => part);

  // Extract the last part as the slug
  const slug = pathParts[pathParts.length - 1];

  // Get the parent path excluding the last segment
  const parentPath = pathParts.slice(0, -1).join(' / ');

  return (
    <div
      className='top_banner_destination'
      style={{
        backgroundImage: `url('/images/destinationfullbanner.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '600px',
      }}
    >
      <div className='heading_two'>
        <div className="heading_wrapper">

          <div className="heading_outer">

            <h2>
              Explore <span>{slug}</span>
            </h2>
           
          </div>
          {session ? "" :
            <div className="form_outer">
              <BookingFromQuery />

            </div>
          }
        </div>
      </div>

    </div>
  );
}
