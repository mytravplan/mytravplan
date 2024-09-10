// import { Jost } from "next/font/google";
import "./globals.css";
import './css/style.scss'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NextAuthProvide from "@/provider/authProvider";
 
 


// const Jost12 = Jost({ subsets: ["latin"] });

export const metadata = {
  title: "My Trav Plan",
  description: "Your personalized travel planner for unforgettable adventures, helping you explore and create custom itineraries with ease.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
     
      <ToastContainer style={{zIndex: '9999999999999999'}}/>
        <NextAuthProvide>
        {children}
        </NextAuthProvide>
        </body>
    </html>
  );
}
