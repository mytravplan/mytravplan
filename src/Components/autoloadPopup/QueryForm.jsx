'use client'

import FormLoader from '@/app/_common/loader/loader';
import { EXPORT_ALL_APIS } from '@/utils/apis/api';
import { useState } from 'react';
import { toast } from 'react-toastify';


const QueryForm = ({ setIsopenForm}) => {
    let api = EXPORT_ALL_APIS();
    const [user, setUser] = useState({
      name: '',
      email: '',
      phone_number: '',
      message: '',
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
      formData.append('form_unit_tag', 'query_unit_tag_9630');
  
      try {
        setLoading(true); // Start loading state
  
        const resp = await api.sendQueryContactUs(formData);
  
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

    const closeQueryForm =()=>{
        setIsopenForm(false)
    }


    return (
        <>
            <div className="booking_form_outer">
                <div className='booking_form_inner'>
                    <h3>Send us a Message</h3>
                    <form className="form" noValidate>
                        <button className="close-button" onClick={closeQueryForm}>×</button>
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

export default QueryForm;
