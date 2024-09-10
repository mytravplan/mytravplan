import Layout from '@/app/_common/layout/layout'
import React from 'react'

function PrivacyPolicy() {
  const content =`
        <h1>Privacy Policy</h1>
        <h2>1. Introduction</h2>
        <p>
          This Privacy Policy explains how MyTravPlan collects, uses, discloses, and protects your personal information when you use our website and services. By using our website, you agree to the terms of this Privacy Policy.
        </p>

        <h2>2. Information We Collect</h2>
        <p>
          <strong>2.1. Personal Information:</strong> We collect personal information you provide when you register, make a booking, or contact us. This information may include your name, email address, phone number, and payment details.
        </p>
        <p>
          <strong>2.2. Usage Data:</strong> We automatically collect information about how you use our website, including your IP address, browser type, operating system, and pages visited.
        </p>

        <h2>3. How We Use Your Information</h2>
        <p>
          <strong>3.1. Providing Services:</strong> We use your personal information to process bookings, communicate with you, and provide customer support.
        </p>
        <p>
          <strong>3.2. Improving Our Services:</strong> We analyze usage data to improve our website and services, enhance user experience, and develop new features.
        </p>
        <p>
          <strong>3.3. Marketing and Promotions:</strong> With your consent, we may use your information to send you promotional materials, special offers, and updates about our services.
        </p>
        <h2>4. Sharing Your Information</h2>
        <p>
          <strong>4.1. Service Providers:</strong> We may share your information with third-party service providers who assist us in operating our website, conducting our business, or servicing you, as long as these parties agree to keep this information confidential.
        </p>
        <p>
          <strong>4.2. Legal Requirements:</strong> We may disclose your information if required by law or in response to a valid request from a law enforcement or government agency.
        </p>
        <p>
          <strong>4.3. Business Transfers:</strong> In the event of a merger, acquisition, or sale of all or a portion of our assets, your information may be transferred to the new owner.
        </p>

        <h2>5. Cookies and Tracking Technologies</h2>
        <p>
          <strong>5.1. Cookies:</strong> We use cookies and similar tracking technologies to track activity on our website and store certain information. Cookies are files with a small amount of data, which may include an anonymous unique identifier.
        </p>
        <p>
          <strong>5.2. Managing Cookies:</strong> You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our website.
        </p>

        <h2>6. Security of Your Information</h2>
        <p>
          We implement a variety of security measures to maintain the safety of your personal information. While we strive to protect your personal information, we cannot guarantee its absolute security. Unauthorized access, use, or disclosure may occur.
        </p>

        <h2>7. Data Retention</h2>
        <p>
          We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, comply with our legal obligations, resolve disputes, and enforce our agreements.
        </p>

        <h2>8. Your Rights</h2>
        <p>
          <strong>8.1. Access and Correction:</strong> You have the right to access the personal information we hold about you and request corrections if the information is inaccurate or incomplete.
        </p>
        <p>
          <strong>8.2. Deletion:</strong> You may request the deletion of your personal information, subject to certain exceptions provided by law.
        </p>
        <p>
          <strong>8.3. Opt-Out:</strong> You can opt out of receiving marketing communications from us by following the unsubscribe link in our emails or by contacting us directly.
        </p>

        <h2>9. Third-Party Links</h2>
        <p>
          Our website may contain links to third-party websites. We are not responsible for the privacy practices of these websites. We encourage you to read the privacy policies of any linked websites you visit.
        </p>

        <h2>10. Children Privacy</h2>
        <p>
          Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children under 18. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
        </p>

        <h2>11. Changes to This Privacy Policy</h2>
        <p>
          We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
        </p>

        <h2>12. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us at:
        </p>
        <ul>
          <li>Email: support@mytravplan.com</li>
          <li>Phone: +1-234-567-8900</li>
          <li>Address: 123 Main Street, Anytown, India</li>
        </ul>`;
  return (
    <>
    <Layout>
    <div className="privacy-policy-container" style={{ padding: '2rem' }} dangerouslySetInnerHTML={{ __html: content }}></div>
    </Layout>
    </>
  )
}

export default PrivacyPolicy