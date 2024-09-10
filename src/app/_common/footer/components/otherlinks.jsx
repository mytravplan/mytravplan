
import Link from 'next/link';

const FooterLinks = ({result}) => {
   let{socialIcons=[]}=result||{}
  return (
    <div className="footer-links-container">
      <div className="other-links">
        <h3 className="footer-title">Other Links</h3>
        <ul className="footer-list">
          <li className="footer-item"><Link href={`/privacy-policy`}>Privacy Policy</Link></li>
          <li className="footer-item"><Link href={`/terms&conditions`}>Terms of Service</Link></li>
          <li className="footer-item"><Link href={`/disclaimer`}>Disclaimer</Link></li>
        </ul>
      </div>
      {socialIcons?.length ? (
        <div className="follow-us">
          <h3 className="footer-title">Follow Us :</h3>
          <div className="social-icons">
            {socialIcons.map((icon, index) => (
              <Link key={index} href={icon.url} target="_blank" rel="noopener noreferrer" className="social-icon">
                <img src={icon.iconUrl} alt={icon.name} />
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <p>No social icons available.</p>
      )}
    </div>
  );
};

export default FooterLinks;
