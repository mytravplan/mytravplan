import { useState } from 'react';
import popupbg from '../../../../public/images/popup-bg.png';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { signIn } from 'next-auth/react';
import popupImage from '../../../../public/images/popup-img.png';
import car from '../../../app/assets/home_images/car2.png';


const LoginPopup = ({ setIsLogin }) => {
   
    const [otp, setOtp] = useState('');
    const [info, setInfo] = useState({
        orderId: '',
        phoneNumber: ''
    });
    const [user, setUser] = useState({
        phoneNumber: '',
        channel: 'SMS',
        otpLength: 6,
        expiry: 86400,
    });
    const [verifyOtp, setVerifyOtp] = useState(false);

    const closeLogin = () => {
        setIsLogin(false);
    };

    const changeHandler = (value, e) => {
        if (e) {
            setUser({ ...user, [e.target.name]: e.target.value });
        } else {
            setUser({ ...user, phoneNumber: value });
        }
    };

    const handleSendOtp = async (e) => {
        e.preventDefault();
        try {
            const resp = await fetch('/api/v1/send-otp', {
                method: 'POST',
                body: JSON.stringify(user),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const result = await resp.json();
            if (result) {
                 
                setInfo({ 
                    orderId: result.orderId, 
                    phoneNumber: user.phoneNumber 
                });
                setVerifyOtp(true);
            } else {
                alert(result.error || 'Error sending OTP');
            }
        } catch (error) {
            console.error('Internal server issue:', error);
        }
    };

    const verifyOtpHandler = async (e) => {
        e.preventDefault();
        try {
            const resp = await fetch('/api/v1/verify-otp', {
                method: 'POST',
                body: JSON.stringify({ orderId: info.orderId, otp, phoneNumber: info.phoneNumber }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const result = await resp.json();
            if (result.isOTPVerified === true) {
                saveUser(info.phoneNumber);
                await signIn('credentials', {
                    phoneNumber: info.phoneNumber,
                });
                setIsLogin(false);
                setIsSignup(false);
            } else {
                alert(result.error || 'OTP verification failed');
            }
        } catch (error) {
            console.error('Internal server issue:', error);
        }
    };

    const saveUser = async (phoneNumber) => {
        try {
            const resp = await fetch('/api/v1/otpuser/login', {
                method: 'POST',
                body: JSON.stringify({ phoneNumber }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const result = await resp.json();
            if (result) {
                console.log(result);
            } else {
                console.log(result.message);
            }
        } catch (error) {
            console.error('Error saving user:', error);
        }
    };


    return (
        <div className="login_popup_outer">
            <div className="login_popup_inner">
                <div className="login-wrapper">
                    <div className="login-modal" style={{ backgroundImage: `url(${popupbg.src})` }}>
                        <button className="close-button" onClick={closeLogin}>×</button>
                        <div className="image-section">
                            <img src={popupImage.src} alt="Travel" />
                        </div>
                        <div className="form-section">
                            <h2>{verifyOtp ? 'Enter OTP to Verify Your Phone Number' : 'Enter Mobile Number To Personalize Your Trip'}</h2>
                            <form onSubmit={verifyOtp ? verifyOtpHandler : handleSendOtp}>
                                {verifyOtp ? (
                                    <div className="input-group">
                                        <input
                                            type="number"
                                            name="otp"
                                            value={otp}
                                            placeholder="Enter OTP"
                                            onChange={(e) => setOtp(e.target.value)}
                                        />
                                    </div>
                                ) : (
                                    <>
                                        <div className="input-group">
                                            <PhoneInput
                                                id="phone-number"
                                                defaultCountry="IN"
                                                value={user.phoneNumber}
                                                onChange={(value) => changeHandler(value)}
                                                placeholder="Enter Your Phone Number"
                                            />
                                        </div>
                                    </>
                                )}
                                <button type="submit">
                                    {verifyOtp ? 'Verify OTP' : 'Get OTP'}
                                </button>
                            </form>
                        </div>
                        <img src={car.src} alt="Car" className="car-animation" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPopup;
