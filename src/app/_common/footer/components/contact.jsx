
const ContactLinks = ({result}) => {
  let{phoneNumbers=[],emailAddresses=[],address}=result||{}
  return (
    <div className="contact-links-container">
      <div className="other-links">
        <h3 className="contact-title">Contact Us</h3>
        <ul className="contact-list">
          {phoneNumbers?.length ? (
            phoneNumbers.map((phone, index) => (
              <li className="contact-item" key={index}>
                <a href={`tel:${phone}`}>{phone}</a>
              </li>
            ))
          ) : (
            <li>No phone numbers available</li>
          )}
          {emailAddresses?.length ? (
            emailAddresses.map((email, index) => (
              <li className="contact-item" key={index}>
                <a href={`mailto:${email}`}>{email}</a>
              </li>
            ))
          ) : (
            <li>No email addresses available</li>
          )}
        </ul>
      </div>
      <div className="address-us">
        <h3 className="contact-title">Address Us:</h3>
        <div className="address-description">
          <p>{address || 'No address available'}</p>
        </div>
      </div>
    </div>
  );
};

export default ContactLinks;

