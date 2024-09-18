
import { useState } from 'react';
import popupbg from '../../../../public/images/popup-bg.png';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
 
import { signIn } from 'next-auth/react';

import car from '../../../app/assets/home_images/car2.png';

const Login = ({setIsLogin}) => {
   

    const [step, setStep] = useState(1);
    const [info, setInfo] = useState({
        orderId: '',
        phoneNumber: '',
        registerusername: ''
    });
    const [error, setError] = useState({});
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
        setIsLogin(false);
    }

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

        try {
            if (handelError()) {
                return false;
            } else {
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
                    setStep(3);
                } else {
                    setShowNameField(true);
                    setVerifyOtp(false);
                    setStep(2);
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
                } else {
                    alert(result.error || 'Error sending OTP');
                }
            }

        } catch (error) {
            console.error('Internal server issue:', error);
        }
    };

    const handelError = () => {
        let { phoneNumber, registerusername } = user;
        let invalid = false;
        let errorfield = {};
    
        // Check if phone number is provided
        if (!phoneNumber) {
            invalid = true;
            errorfield.phoneNumber = 'Phone number is required';
        } else if (phoneNumber.length !== 13) { 
            invalid = true;
            errorfield.phoneNumber = 'Phone number should be exactly 10 digits';
        }

        console.log(`the lenhth of the number is phoneNumber.length`)
        console.log(phoneNumber.length)
    
        // Check if name is required in step 2
        if (step === 2 && !registerusername) {
            invalid = true;
            errorfield.registerusername = 'Name is required';
        }
    
        // Set errors and show alerts if necessary
        setError(errorfield);
         
        return invalid;
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
                alert(result.error || 'Please provide a valid OTP');
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
        setStep(3);
    };

    return (
        <div className="login_popup_outer">
            <div className="login_popup_inner">
        <div className="login-wrapper">
            <div className="login-modal" style={{ backgroundImage: `url(${popupbg.src})` }}>
                <button className="close-button" onClick={closeLogin}>×</button>
                <div className="image-section">
                    <img src="/images/popup-img.png" alt="Travel" />
                </div>
                <div className="form-section">
                    <h2>
                        {step === 1 && 'Enter Mobile Number To Personalize Your Trip'}
                        {step === 2 && (showNameField ? 'Enter Your Name' : 'Enter OTP to Verify Your Phone Number')}
                        {step === 3 && 'Enter OTP to Verify Your Phone Number'}
                    </h2>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        if (step === 1) {
                            handleSendOtp(e);
                        } else if (step === 2 && showNameField) {
                            handleNext(); // Move to OTP verification step
                        } else if (step === 3) {
                            verifyOtpHandler(e);
                        }
                    }}>
                        {step === 1 && (
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
                        )}
                        {step === 2 && (
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
                        {step === 3 && (
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
                    </form>
                </div>
                <img src={car.src} alt="Car" className="car-animation" />
            </div>
        </div>
        </div>
        </div>
    );
};

export default Login;

