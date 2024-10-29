import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify'; // Import Toastify
import 'react-toastify/dist/ReactToastify.css'; // Import styles for Toastify
import popupbg from '../../../../public/images/popup-bg.png';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import car from '../../assets/home_images/car2.png';

const Login = () => {
    const router = useRouter();

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
    
        if (!phoneNumber) {
            invalid = true;
            errorfield.phoneNumber = 'Phone number is required';
        } else if (phoneNumber.length !== 13) { 
            invalid = true;
            errorfield.phoneNumber = 'Phone number should be exactly 10 digits';
        }

        console.log(`the length of the number is phoneNumber.length`)
        console.log(phoneNumber.length)
    
        if (step === 2 && !registerusername) {
            invalid = true;
            errorfield.registerusername = 'Name is required';
        }
    
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

    // Updated resend OTP function with toast
    const handleResendOtp = async () => {
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
                setInfo(prev => ({
                    ...prev,
                    orderId: result.orderId
                }));
                // Show toast notification
                toast.success(`OTP has been resent to ${user.phoneNumber}`);
            } else {
                alert(result.error || 'Error resending OTP');
            }
        } catch (error) {
            console.error('Internal server issue:', error);
        }
    };

    return (
        <div className="login-wrapper">
            <ToastContainer /> {/* Add ToastContainer here */}
            <div className="login-modal" style={{ backgroundImage: `url(${popupbg.src})` }}>
                <button className="close-button" onClick={closeLogin}>×</button>
                <div className="image-section">
                    <img src="/images/popup-img.png" alt="Travel" />
                </div>
                <div className="form-section">
                    <h2>
                        {step === 1 && 'Enter Mobile Number To Personalize Your Trip'}
                        {step === 2 && (showNameField ? 'Enter Your Name' : `OTP has been sent to your phone number: ${user?.phoneNumber}`)}
                        {step === 3 && `OTP has been sent to your phone number: ${user?.phoneNumber}`}
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
                                        <div className="input-group">
                                            <input
                                                id="registerusername"
                                                name="registerusername"
                                                value={user.registerusername}
                                                onChange={(e) => setUser({ ...user, registerusername: e.target.value })}
                                                placeholder="Enter Your Name"
                                            />
                                        </div>
                                        <button type="button" onClick={handleNext}>Next</button>
                                    </>
                                ) : (
                                    <>
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
                                <div className="input-group">
                                    <input
                                        type="number"
                                        name="otp"
                                        value={otp}
                                        placeholder="Enter OTP"
                                        onChange={(e) => setOtp(e.target.value)}
                                    />
                                </div>
                                <div className="input_buttons">

                                <button type="submit">Verify OTP</button>
                                <button type="button" onClick={handleResendOtp}>Resend OTP</button> 
                                </div>
                            </>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
