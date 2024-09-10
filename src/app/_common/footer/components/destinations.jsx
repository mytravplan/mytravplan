import Link from "next/link";
const Destinations = ({result}) => {
  const reversedCountryLinks = Array.isArray(result)?[...result].reverse():[]

  return (
    <div className="destinations-container">
      <h3 className="destinations-title">Destinations</h3>
      <ul className="destinations-list">
        {reversedCountryLinks===undefined||reversedCountryLinks===null||reversedCountryLinks.length > 0 ? (
          reversedCountryLinks.slice(0, 7).map((destination, index) => (
            <li key={index} className="destinations-item">
              <Link href={`/countries/${destination.slug}`}>
                {destination.title}
              </Link>
            </li>
          ))
        ) : (
          <li></li>
        )}
      </ul>
    </div>
  );
};

export default Destinations;
