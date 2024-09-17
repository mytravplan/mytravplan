import { useState } from 'react';
import popupbg from '../../../../public/images/popup-bg.png';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import car from '../../assets/home_images/car2.png';

const Login = () => {
    const router = useRouter();

    const [info, setInfo] = useState({
        orderId: '',
        phoneNumber: '',
        registerusername: ''
    });

    let [error, setError] = useState({});
    const [otp, setOtp] = useState('');
    const [user, setUser] = useState({
        phoneNumber: '',
        registerusername: '',
        channel: 'SMS',
        otpLength: 6,
        expiry: 86400,
    });
    const [verifyOtp, setVerifyOtp] = useState(false);
    const [showNameField, setShowNameField] = useState(false);
 

    const closeLogin = () => {
        router.push('/');
    };

    const changeHandler = (value, e) => {
        if (e) {
            setUser({ ...user, [e.target.name]: e.target.value });
        } else {
            setUser({ ...user, phoneNumber: value });
            setError({ ...user, phoneNumber: '' });
        }
    };

    const handleSendOtp = async (e) => {
        e.preventDefault();
        if (handelError()) {
            return;
        }
        try {
            const checkUserResp = await fetch('/api/v1/otpuser/check-user', {
                method: 'POST',
                body: JSON.stringify({ phoneNumber: user.phoneNumber }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const checkUserResult = await checkUserResp.json();

            if (checkUserResult.userExists === true) {
                setShowNameField(false);
                setVerifyOtp(true);
            } else {
                setShowNameField(true);
                setVerifyOtp(false);
            }
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
                    phoneNumber: user.phoneNumber,
                    registerusername: user.registerusername
                });
                localStorage.setItem('userInfos', JSON.stringify(result));
                setVerifyOtp(true);
            } else {
                alert(result.error || 'Error sending OTP');
            }
        } catch (error) {
            console.error('Internal server issue:', error);
        }
    };

    const handelError = () => {
        let { phoneNumber } = user;
        let valid = false;
        let errorfield = {};

        if (!phoneNumber) {
            valid = true;
            errorfield.phoneNumber = 'Phone number is required';
        }
        else if (phoneNumber.length>=10) {
            valid = true;
            errorfield.phoneNumber = 'Phone number should be 10 digit';
        }
        setError(errorfield);
        return valid;
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
            if (result.isOTPVerified) {
                await saveUser(info.phoneNumber, user.registerusername);
                await signIn('credentials', {
                    phoneNumber: info.phoneNumber,
                    registerusername: user.registerusername,
                    callbackUrl: '/',
                    redirect: true,
                });
                
            } else {
                
                    alert(result.error || 'Please provide valid Otp');
                
            }
        } catch (error) {
            console.error('Internal server issue:', error);
        }
    };

    const saveUser = async (phoneNumber, registerusername) => {
        try {
            const resp = await fetch('/api/v1/otpuser/login', {
                method: 'POST',
                body: JSON.stringify({ phoneNumber, registerusername }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const result = await resp.json();
            if (result) {
                console.log('User saved:', result);
            } else {
                console.log('Error:', result.message);
            }
        } catch (error) {
            console.error('Error saving user:', error);
        }
    };

    const handleNext = () => {
        setShowNameField(false);
    };

    return (
        <div className="login-wrapper">
            <div className="login-modal" style={{ backgroundImage: `url(${popupbg.src})` }}>
                <button className="close-button" onClick={closeLogin}>×</button>
                <div className="image-section">
                    <img src="/images/popup-img.png" alt="Travel" />
                </div>
                <div className="form-section">
                    <h2>{verifyOtp ? 'Enter OTP to Verify Your Phone Number' : 'Enter Mobile Number To Personalize Your Trip'}</h2>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        if (verifyOtp && !showNameField) {
                            verifyOtpHandler(e);
                        } else if (!verifyOtp) {
                            handleSendOtp(e);
                        }
                    }}>
                        {!verifyOtp ? (
                            <>
                                {/* Phone input field */}
                                <div className="input-group">
                                    <PhoneInput
                                        id="phone-number"
                                        defaultCountry="IN"
                                        value={user.phoneNumber}
                                        onChange={(value) => setUser({ ...user, phoneNumber: value })}
                                        placeholder="Enter Your Phone Number"
                                    />
                                    {error.phoneNumber && <span className="error-message">{error.phoneNumber}</span>}
                                </div>
                                <button type="submit">Get OTP</button>
                            </>
                        ) : (
                            <>
                                {showNameField ? (
                                    <>
                                        {/* Name input field */}
                                        <div className="input-group">
                                            <input
                                                id="registerusername"
                                                name="registerusername"
                                                value={user.registerusername}
                                                onChange={(e) => setUser({ ...user, registerusername: e.target.value })}
                                                placeholder="Enter Your Name"
                                            />
                                            
                                        </div>
                                        {/* "Next" button to show OTP input field */}
                                        <button type="button" onClick={handleNext}>Next</button>
                                    </>
                                ) : (
                                    <>
                                        {/* OTP input field */}
                                        <div className="input-group">
                                            <input
                                                type="number"
                                                name="otp"
                                                value={otp}
                                                placeholder="Enter OTP"
                                                onChange={(e) => setOtp(e.target.value)}
                                            />
                                        </div>
                                        <button type="submit">Verify OTP</button>
                                    </>
                                )}
                            </>
                        )}
                    </form>





                </div>
                <img src={car.src} alt="Car" className="car-animation" />
            </div>
        </div>
    );
};

export default Login;
