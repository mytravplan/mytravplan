
import EnquiryForm from '../components/flightForm';
import Holiday from '../components/howWorks';
import Image from 'next/image';
import Link from 'next/link';
import Layout from '@/app/_common/layout/layout';
import formbg from './../../assets/home_images/flight-bg.png';
export default function flight() {
  return (
<Layout>

      <div className='outer_section-flight' style={{ backgroundImage: `url(${formbg.src})`}} >
      <div className='form_container'>
          <div className='explorations-container'>
          <div className='flight-container'>
            <Holiday />
            <EnquiryForm />
          </div>
          </div>
        </div>
      </div>


    </Layout>
  );
}