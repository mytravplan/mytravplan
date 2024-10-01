// 'use client';

// import React, { useState } from 'react';
// import { signIn } from 'next-auth/react';
// import { FaEye, FaEyeSlash } from 'react-icons/fa';
// import logo from '@/app/assets/home_images/logo.png';
// import LoadingOverlay from '../../../(dashboard)/components/LoadingOverlay';
// import { toast } from 'react-toastify';

// function AdminLoginPage() {
//     const [data, setData] = useState({
//         email: '',
//         password: '',
//     });
//     let [erros, setErrors] = useState({})
//     const [loading, setLoading] = useState(false);
//     const [showPassword, setShowPassword] = useState(false);
  

//     const onChangeHandler = (e) => {
//         setData({ ...data, [e.target.name]: e.target.value });
//         setErrors({ ...erros, [e.target.name]: '' })
//     };



//     const togglePasswordVisibility = () => {
//         setShowPassword(!showPassword);
//     };

//     const excuteErrors = () => {
//         let { email, password } = data
//         let valid = true
//         let errorFields = {}
//         if (!email) {
//             valid = false
//             errorFields.email = 'email is required';
//             setLoading(false);
//         }
//         if (!password) {
//             valid = false
//             errorFields.password = 'password is required';
//             setLoading(false);
//         }
//         setErrors(errorFields);
//         return valid;

//     }

    

//     const logedInAdmin = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         if (excuteErrors()) {
//             try {
//                 let resp = await fetch('/api/v1/admin/login', {
//                     method: 'POST',
//                     body: JSON.stringify(data),
//                 });
//                 let result = await resp.json();
//                 if (result.success === true) {
//                     await signIn('credentials', {
//                         email: data.email,
//                         password: data.password,
//                         callbackUrl: '/admin/dashboard',
//                         redirect: true
//                     });

//                 } else if (result.success === false) {
                 
//                     toast.error(result.message)
//                     return;
//                 }
//             } catch (err) {
//                 console.log('error')
//             }
//         }

//     };

//     return (
//         <>
//             <div className="admin_login_logo">
//                 <img src={logo.src} alt="admin_login_logo" />
//             </div>
//             <h1>Admin Login</h1>
//             <form onSubmit={logedInAdmin}>

            
//             <div className="input-group">
//                 <label htmlFor="email">Email*</label>
//                 <input
//                     type="email"
//                     name="email"
//                     value={data.email}
//                     onChange={onChangeHandler}
//                     placeholder="example@gmail.com"
//                 />
//             </div>
//             {erros.email && <span className='admin_login_error'>{erros.email}</span>}
//             <div className="input-group">
//                 <label htmlFor="password">Password*</label>
//                 <div className="password-wrapper">
//                     <input
//                         type={showPassword ? 'text' : 'password'}
//                         name="password"
//                         value={data.password}
//                         onChange={onChangeHandler}
//                         placeholder="password"
//                     />
//                     <span onClick={togglePasswordVisibility} className="password-toggle">
//                         {showPassword ? <FaEyeSlash /> : <FaEye />}
//                     </span>
//                 </div>
//             </div>
//             {erros.password && <span className='admin_login_error'>{erros.password}</span>}


//             <button type='submit' disabled={loading}>
//           {loading ? 'Loading...' : 'Login'}
//          </button>
//             </form>
//         </>
//     );
// }

// export default AdminLoginPage;



'use client';

import React, { useState, useEffect } from 'react'; // Import useEffect
import { signIn, useSession } from 'next-auth/react'; // Import useSession
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import logo from '@/app/assets/home_images/logo.png';
import LoadingOverlay from '../../../(dashboard)/components/LoadingOverlay';
import { toast } from 'react-toastify';

function AdminLoginPage() {
    const [data, setData] = useState({
        email: '',
        password: '',
    });
    let [erros, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
  
    const { data: session } = useSession(); // Get session data

    const onChangeHandler = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
        setErrors({ ...erros, [e.target.name]: '' });
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const excuteErrors = () => {
        let { email, password } = data;
        let valid = true;
        let errorFields = {};
        if (!email) {
            valid = false;
            errorFields.email = 'email is required';
            setLoading(false);
        }
        if (!password) {
            valid = false;
            errorFields.password = 'password is required';
            setLoading(false);
        }
        setErrors(errorFields);
        return valid;
    };

    const logedInAdmin = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (excuteErrors()) {
            try {
                let resp = await fetch('/api/v1/admin/login', {
                    method: 'POST',
                    body: JSON.stringify(data),
                });
                let result = await resp.json();
                if (result.success === true) {
                    await signIn('credentials', {
                        email: data.email,
                        password: data.password,
                        callbackUrl: '/admin/dashboard',
                        redirect: true,
                    });

                    // Set a timeout for automatic logout after 1 minute
                    if (session?.user?.role === 'admin') {
                        setTimeout(() => {
                            // Sign out after 1 minute
                            signIn('credentials', { redirect: false }).then(() => {
                                window.location.href = '/login'; // Redirect to login
                            });
                        }, 60 * 1000); // 60 seconds
                    }

                } else if (result.success === false) {
                    toast.error(result.message);
                    return;
                }
            } catch (err) {
                console.log('error');
            }
        }
    };

    useEffect(() => {
        if (!session) {
            window.location.href = '/admin/login';
        }
    }, [session]);

    return (
        <>
            <div className="admin_login_logo">
                <img src={logo.src} alt="admin_login_logo" />
            </div>
            <h1>Admin Login</h1>
            <form onSubmit={logedInAdmin}>
                <div className="input-group">
                    <label htmlFor="email">Email*</label>
                    <input
                        type="email"
                        name="email"
                        value={data.email}
                        onChange={onChangeHandler}
                        placeholder="example@gmail.com"
                    />
                </div>
                {erros.email && <span className='admin_login_error'>{erros.email}</span>}
                <div className="input-group">
                    <label htmlFor="password">Password*</label>
                    <div className="password-wrapper">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={data.password}
                            onChange={onChangeHandler}
                            placeholder="password"
                        />
                        <span onClick={togglePasswordVisibility} className="password-toggle">
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>
                </div>
                {erros.password && <span className='admin_login_error'>{erros.password}</span>}
                <button type='submit' disabled={loading}>
                    {loading ? 'Loading...' : 'Login'}
                </button>
            </form>
        </>
    );
}

export default AdminLoginPage;
