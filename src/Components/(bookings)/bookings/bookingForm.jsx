'use client'

import FormLoader from '@/app/_common/loader/loader';
import { useSession } from 'next-auth/react';

import { EXPORT_ALL_APIS } from '@/utils/apis/api';
import { useState } from 'react';
import { toast } from 'react-toastify';


const BookingForm = ({ setIsopenForm,packageId }) => {
    const { data: session } = useSession();
    const user_id = session?.user?._id ? session?.user?._id : null;
    console.log(`user_id`)
    console.log(user_id)
    let api = EXPORT_ALL_APIS();
    const [user, setUser] = useState({
        name: '',
        email: '',
        phone_number: '',
        message: '',
        package_id:packageId,
        user_id:user_id
    });

    const [error, setError] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser({
            ...user,
            [name]: value,
        });
        setError({
            ...error,
            [name]: '',
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate user inputs
        let formData = new FormData();
        formData.append('name', user.name);
        formData.append('email', user.email);
        formData.append('phone_number', Number(user.phone_number));
        formData.append('message', user.message);
        formData.append('package_id', user.package_id);
        formData.append('user_id', user.user_id);
        formData.append('form_unit_tag', 'booking_unit_tag_7410');

        try {
            setLoading(true); // Start loading state

            const resp = await api.sendQueryBookings(formData);

            if (resp.success) {
                toast.success(resp.message);
                setUser({
                    name: '',
                    email: '',
                    phone_number: '',
                    message: '',
                });
                setTimeout(() => {
                    setIsopenForm(false);
                }, 800);

            } else {
                setError(resp.errors);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error('There was an error submitting the form.');
        } finally {
            setLoading(false);
        }
    };

    const closeBookingForm = () => {
        setIsopenForm(false)
    }

    return (
        <>
            <div className="booking_form_outer">
                <div className='booking_form_inner'>
                    <h3>Send us a Message</h3>
                    <form className="form" noValidate>
                        <button className="close-button" onClick={closeBookingForm}>×</button>
                        <div className='booking_input-group_wrapper'>
                            <div className="form-group">
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    placeholder="Enter Your Name"
                                    value={user.name}
                                    onChange={handleChange}
                                    className="input"
                                />
                                <span className='error_field'>{error.name}</span>
                            </div>

                            <div className="form-group">
                                <input
                                    id="email"
                                    name="email"
                                    type="text"
                                    placeholder="Enter Your Email"
                                    value={user.email}
                                    onChange={handleChange}
                                    className="input"
                                />
                                <span className='error_field'>{error.email}</span>
                            </div>

                            <div className="form-group">
                                <input
                                    id="phone"
                                    name="phone_number"
                                    type="number"
                                    placeholder="Phone Number"
                                    value={user.phone_number}
                                    onChange={handleChange}
                                    className="input"
                                />
                                <span className='error_field'>{error.phone_number}</span>
                            </div>
                            <div className="form-group">
                            <textarea
                                id="message"
                                name="message"
                                placeholder="Enter Your Message"
                                value={user.message}
                                onChange={handleChange}
                                className="textarea"
                            ></textarea>
                            <span className='error_field'>{error.message}</span>
                        </div>
                        </div>
                        
                        <button type="submit" className="button" onClick={handleSubmit}>
                            {loading ? <FormLoader /> : 'Send Message'}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default BookingForm;
