import Layout from '@/app/_common/layout/layout'
import React from 'react'

function Disclaimer() {
  const content = `
          <h1>Disclaimer</h1>

          <h2>1. General Information</h2>
          <p>
            The information provided on MyTravPlan (the "Website") is for general informational purposes only. All information on the Website is provided in good faith; however, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the Website.
          </p>

          <h2>2. Professional Advice</h2>
          <p>
            The Website cannot and does not contain travel advice or recommendations. All information provided on the Website is for general informational and educational purposes only and is not a substitute for professional advice. You should seek the advice of a professional travel consultant or a licensed tour operator before making any decisions based on the information provided on the Website.
          </p>

          <h2>3. External Links Disclaimer</h2>
          <p>
            The Website may contain (or you may be sent through the Website) links to other websites or content belonging to or originating from third parties or links to websites and features in banners or other advertising. Such external links are not investigated, monitored, or checked for accuracy, adequacy, validity, reliability, availability, or completeness by us.
          </p>
          <p>
            We do not warrant, endorse, guarantee, or assume responsibility for the accuracy or reliability of any information offered by third-party websites linked through the Website or any website or feature linked in any banner or other advertising. We will not be a party to or in any way be responsible for monitoring any transaction between you and third-party providers of products or services.
          </p>

          <h2>4. Testimonials and Reviews</h2>
          <p>
            The Website may contain testimonials and reviews by users of our services. These testimonials reflect the real-life experiences and opinions of such users. However, the experiences are personal to those particular users and may not necessarily be representative of all users of our services. We do not claim, and you should not assume, that all users will have the same experiences.
          </p>

          <h2>5. Changes and Amendments</h2>
          <p>
            We reserve the right to modify this disclaimer at any time, and any changes will be effective immediately upon posting the updated disclaimer on the Website. You are encouraged to periodically review this disclaimer to stay informed of updates. By continuing to access or use the Website after any revisions become effective, you agree to be bound by the updated terms.
          </p>

          <h2>6. Errors and Omissions</h2>
          <p>
            While we have made every attempt to ensure that the information contained on the Website is correct, MyTravPlan is not responsible for any errors or omissions or for the results obtained from the use of this information. All information on the Website is provided "as is," with no guarantee of completeness, accuracy, timeliness, or of the results obtained from the use of this information, and without warranty of any kind, express or implied.
          </p>

          <h2>7. Limitation of Liability</h2>
          <p>
            In no event shall MyTravPlan or its suppliers be liable for any direct, indirect, punitive, incidental, special, consequential damages, or any damages whatsoever including, without limitation, damages for loss of use, data or profits, arising out of or in any way connected with the use or performance of the Website, with the delay or inability to use the Website or related services, the provision of or failure to provide services, or for any information, software, products, services and related graphics obtained through the Website, or otherwise arising out of the use of the Website, whether based on contract, tort, negligence, strict liability or otherwise, even if MyTravPlan or any of its suppliers has been advised of the possibility of damages.
          </p>

          <h2>8. Contact Us</h2>
          <p>
            If you have any questions about this Disclaimer, please contact us at:
          </p>
          <ul>
            <li>Email: support@mytravplan.com</li>
            <li>Phone: +1-234-567-8900</li>
            <li>Address: 123 Main Street, Anytown, USA</li>
          </ul>`;
  return (
    <>
      <Layout>
      <div className="disclaimer-container" style={{ padding: '20px' }} dangerouslySetInnerHTML={{ __html: content }}></div>
      </Layout>
    </>
  )
}

export default Disclaimer