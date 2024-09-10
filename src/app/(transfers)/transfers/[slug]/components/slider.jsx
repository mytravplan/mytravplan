
import Image from 'next/image';
const Transferslider = () => {
    return (
      
      <div className="transfer-innerpage">
        <h2>Maruti</h2>
        <p> -4s</p>
        <div className="car-images">
          <div className="car-image-container">
            <img src="/images/innercar-2.png" alt="Image 1" />
          </div>
          <div className="car-image-container">
            <img src="/images/innercar-1.png" alt="Image 2"/>
          </div>
          <div className="car-image-container">
            <img src="/images/innercar-3.png" alt="Image 3"/>
          </div>
        </div>     
      </div>
    );
  };
  

export default Transferslider;
