import Layout from '@/app/_common/layout/layout'
import React from 'react'

function TermsCondition() {

  const content = `
        <h1>Terms and Conditions</h1>
        <h2>1. Introduction</h2>
        <p>
          Welcome to MyTravPlan. By accessing or using our website and services, you agree to comply with and be bound by these Terms and Conditions. If you disagree with any part of these terms, please do not use our website.
        </p>

        <h2>2. Definitions</h2>
        <p>
          <strong>2.1. User:</strong> Any individual or entity using or intending to use our services.
        </p>
        <p>
          <strong>2.2. Service:</strong> The travel package booking and blog content services provided by MyTravPlan.
        </p>
        <p>
          <strong>2.3. Package:</strong> A travel package offered by MyTravPlan, categorized by continent, country, and city.
        </p>

        <h2>3. Use of Services</h2>
        <p>
          Our platform allows you to explore and book travel packages. Packages are organized by continent, country, and city, with detailed descriptions, itineraries, pricing, and availability.
        </p>

        <h2>4. Eligibility</h2>
        <p>
          To use our services, you must be at least 18 years old and legally capable of entering into a binding contract. By using our services, you represent and warrant that you meet these requirements.
        </p>

        <h2>5. Booking Process</h2>
        <p>
          <strong>5.1. Package Selection:</strong> Users can select packages based on various criteria, including continent, country, and city. Each package includes detailed information about the destination and itinerary.
        </p>
        <p>
          <strong>5.2. Booking Form:</strong> Users must complete a booking form with necessary details, including personal information, travel dates, and payment information.
        </p>
        <p>
          <strong>5.3. Confirmation:</strong> After submitting the booking form, you will receive a confirmation email with the booking details and further instructions.
        </p>

        <h2>6. Payment Terms</h2>
        <p>
          <strong>6.1. Pricing:</strong> All prices are listed in [Currency] and may change without notice. Prices include all services and amenities described in the package.
        </p>
        <p>
          <strong>6.2. Payment Method:</strong> Payments can be made using [Accepted Payment Methods]. Payment in full is required at the time of booking unless stated otherwise.
        </p>

        <h2>7. Cancellation and Refund Policy</h2>
        <p>
          <strong>7.1. User Cancellation:</strong> Users may cancel their booking by contacting our support team. Our refund policy varies depending on the package and cancellation time.
        </p>
        <p>
          <strong>7.2. MyTravPlan Cancellation:</strong> We reserve the right to cancel or modify a booking due to unforeseen circumstances such as natural disasters, political unrest, or safety concerns.
        </p>
        <p>
          <strong>7.3. Refunds:</strong> Refunds will be processed per our refund policy, detailed on our website.
        </p>

        <h2>8. User Responsibilities</h2>
        <p>
          <strong>8.1. Accuracy of Information:</strong> Users are responsible for providing accurate and complete information. MyTravPlan is not responsible for any errors in the information provided by users.
        </p>
        <p>
          <strong>8.2. Compliance with Laws:</strong> Users must comply with all applicable laws and regulations, including those related to travel, immigration, and customs.
        </p>

        <h2>9. Intellectual Property</h2>
        <p>
          All content on our website, including text, graphics, logos, and images, is owned by MyTravPlan or our licensors and is protected by copyright and other intellectual property laws. Users may not reproduce or distribute our content without our permission.
        </p>

        <h2>10. Limitation of Liability</h2>
        <p>
          MyTravPlan is not liable for any direct, indirect, incidental, special, or consequential damages arising from the use of our services, including loss of profits, data, or other intangible losses.
        </p>

        <h2>11. Indemnification</h2>
        <p>
          Users agree to indemnify and hold MyTravPlan, its affiliates, and their respective officers, directors, employees, and agents harmless from any claims, liabilities, damages, or expenses arising from their use of our services or violation of these terms.
        </p>

        <h2>12. Privacy</h2>
        <p>
          Our <a href="/privacy-policy">Privacy Policy</a> outlines how we collect, use, and protect user information. By using our services, you agree to our collection and use of your information as described in the Privacy Policy.
        </p>

        <h2>13. Changes to Terms and Conditions</h2>
        <p>
          We may update these terms at any time. Users are responsible for reviewing the terms regularly. Continued use of our services after changes constitutes acceptance of the new terms.
        </p>

        <h2>14. Contact Information</h2>
        <p>
          If you have any questions or concerns about these terms, please contact us at [Insert Contact Information].
        </p>

        <h2>15. Governing Law</h2>
        <p>
          These terms are governed by the laws of [Your Jurisdiction]. Any disputes arising from these terms or our services shall be resolved in the courts of [Your Jurisdiction].
        </p>

        <h2>16. Severability</h2>
        <p>
          If any provision of these terms is deemed invalid or unenforceable, the remaining provisions shall remain in full force and effect.
        </p>

        <h2>17. Entire Agreement</h2>
        <p>
          These terms constitute the entire agreement between the user and MyTravPlan regarding the use of our services and supersede all prior or contemporaneous communications and proposals.
        </p>`;
  return (
    <Layout>
     <div className="term-conditions-container" style={{ padding: '2rem' }} dangerouslySetInnerHTML={{ __html: content }}></div>
    </Layout>
  )
}

export default TermsCondition
