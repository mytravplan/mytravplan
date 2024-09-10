// components/PaymentMethods.js
import React from 'react';
import Image from 'next/image';
import logo from '../../../assets/home_images/logo.png'
import visa from '../../../assets/home_images/visa.png';
import mastercard from '../../../assets/home_images/master.png';
import paytm from '../../../assets/home_images/paytm.png';
import paypal from '../../../assets/home_images/paypal.png';
import credit from '../../../assets/home_images/credit.png';
import Link from 'next/link'


const paymentMethods = [
  { src: visa, alt: 'Visa' },
  { src: mastercard, alt: 'MasterCard' },
  { src: paytm, alt: 'Paytm' },
  { src: paypal, alt: 'PayPal' },
  { src: credit, alt: 'Credit' },

];

const PaymentMethods = () => {
  return (
    <div className="container_footer" >
      <div className="logo">
      <Link href={'/'}>
          <img src={logo.src} alt="MyTravPlan Logo" width={150} height={50} />
      </Link>
        
      </div>
      <p className="description">
        A wonderful serenity has taken possession of my entire soul, like these sweet mornings of spring which
      </p>
      <div className="paymentmethods">
        <h3>Payment Methods</h3>
        <div className="methods">
          {paymentMethods.map((method, index) => (
            <Image key={index} src={method.src} alt={method.alt} width={100} height={50} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PaymentMethods;
