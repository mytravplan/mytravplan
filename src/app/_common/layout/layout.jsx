 
import Header from '../header/page';
import Footer from '../footer/page';
 
 

function Layout({ children }) {
 

  return (
    <>
      
          <Header />
          {children}
          <Footer />
       
      
    </>
  );
}

export default Layout;
