"use client";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { toast } from "react-toastify";

function BookingFromQuery() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [orderId, setOrderId] = useState(null);
    const [otpSent, setOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const [message, setMessage] = useState("");
    const [errors, setErrors] = useState({ name: "", email: "", phone: "" });

    

    const sendOtp = async () => {
        if (!phone) {
            setErrors((prevErrors) => ({ ...prevErrors, phone: "Phone number is required" }));
            return;
        }
        try {
            const response = await fetch("/api/v1/send-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    phoneNumber: phone,
                    channel: "SMS",
                    otpLength: 6,
                    expiry: 86400,
                }),
            });
            const data = await response.json();
            if (data.orderId) {
                setOrderId(data.orderId);
                setOtpSent(true);
                toast.success("OTP sent to your phone.");
            } else {
                toast.error("Failed to send OTP.");
            }
        } catch (error) {
            toast.error("An error occurred while sending OTP.");
        }
    };

    const verifyOtp = async () => {
        if (!otp) {
            toast.error("Please enter the OTP.");
            return;
        }
        try {
            const response = await fetch("/api/v1/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderId, otp, phoneNumber: phone }),
            });
            const result = await response.json();
            if (result.isOTPVerified) {
                setOtpVerified(true);
                toast.success("OTP verified successfully!");
            } else {
                toast.error("OTP verification failed.");
            }
        } catch (error) {
            toast.error("An error occurred during OTP verification.");
        }
    };

    const saveUser = async () => {
        if (!otpVerified) {
            toast.error("Please verify your phone number before registering.");
            return;
        }
        if (validateForm()) {
            try {
                const saveResponse = await fetch("/api/v1/otpuseralternate/send", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name, email, phone, message }),
                });
                const saveResult = await saveResponse.json();
                console.log(`saveResult`)
                 
                if (saveResult?.result?.newUser) {
                    toast.success("Great! You have registered successfully!");


                    
                    setName("");
                    setEmail("");
                    setPhone("");
                    setOtp("");
                    setMessage("");
                    setOrderId(null);
                    setOtpSent(false);
                    setOtpVerified(false);
                    setErrors({ name: "", email: "", phone: "" });

                   
                    await signIn("credentials", {
                        registerusername: name,
                        phoneNumber:phone,
                        callbackUrl: "/",
                        redirect: true,
                    });
                } else {
                    toast.error(saveResult.message);
                }
            } catch (error) {
                toast.error("An error occurred while saving user.");
            }
        }
    };

    const validateForm = () => {
        let isValid = true;
        let validationErrors = { name: "", email: "", phone: "" };

        if (!name) {
            validationErrors.name = "Name is required";
            isValid = false;
        }
        if (!email) {
            validationErrors.email = "Email is required";
            isValid = false;
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
            validationErrors.email = "Invalid email address";
            isValid = false;
        }
        if (!phone) {
            validationErrors.phone = "Phone number is required";
            isValid = false;
        }

        setErrors(validationErrors);
        return isValid;
    };

    return (
        <div className="send_query_wrapper">
            <div className="input_wrapper">
                <input
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value);
                        setErrors({ ...errors, name: "" });
                    }}
                />
                {errors.name && <span className="error">{errors.name}</span>}
            </div>

            <div className="input_wrapper">
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                        setErrors({ ...errors, email: "" });
                    }}
                />
                {errors.email && <span className="error">{errors.email}</span>}
            </div>

            <div className="input_wrapper otp_input">
                <div className="country_input">
                    <PhoneInput
                        placeholder="Enter your phone number"
                        value={phone}
                        onChange={(value) => {
                            setPhone(value);
                            setErrors({ ...errors, phone: "" });
                        }}
                        defaultCountry="IN"
                        international
                    />
                    {!otpSent ? (
                        <button onClick={sendOtp} disabled={!phone}>Send OTP</button>
                    ) : !otpVerified ? (
                        <>
                            <input
                                type="text"
                                placeholder="OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                            />
                            <button onClick={verifyOtp}>Verify OTP</button>
                        </>
                    ) : null}
                </div>
                {errors.phone && <span className="error">{errors.phone}</span>}
            </div>

            <div className="input_wrapper">
                <textarea
                    placeholder="Message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                />
            </div>

            <button onClick={saveUser}>Submit</button>
            <Link href={`/login`}>Already have an account? go to login</Link>
        </div>
    );
}

export default BookingFromQuery;
