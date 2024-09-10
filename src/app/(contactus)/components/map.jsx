// components/Map.js
const Map = () => {
    return (
      <div style={{ width: '100%', height: '400px' }}>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.835434509456!2d144.95373531590405!3d-37.81627927975159!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0xf0727f6d5053b275!2sVictoria%20State%20Library!5e0!3m2!1sen!2sau!4v1648452013761!5m2!1sen!2sau"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
        ></iframe>
      </div>
    );
  };
  
  export default Map;
  