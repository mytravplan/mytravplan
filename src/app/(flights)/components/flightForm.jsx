'use client';

import { useState } from 'react';
import { toast } from 'react-toastify'; // Assuming you are using toast for notifications
import { EXPORT_ALL_APIS } from '@/utils/apis/api'; // Import your API functions
import FormLoader from '@/app/_common/loader/loader'; // Import your loader if needed

const EnquiryForm = () => {
  const api = EXPORT_ALL_APIS(); // Initialize API
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone_number: '',
    date: '',
    origin: '',
    destination: '',
    traveler: '',
    children: '',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false); // To show loading state if needed

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    let tempErrors = {};
    if (!formData.name) tempErrors.name = 'Full Name is required';
    if (!formData.email) {
      tempErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = 'Email is invalid';
    }
    if (!formData.phone_number) tempErrors.mobileNumber = 'phone number is required';
    if (!formData.date) tempErrors.date = 'Date is required';
    if (!formData.origin) tempErrors.origin = 'Origin is required';
    if (!formData.destination) tempErrors.destination = 'Destination is required';
    if (!formData.traveler) tempErrors.traveler = 'Traveler is required';
    if (!formData.children) tempErrors.children = 'Children is required';
    if (!formData.message) tempErrors.question = 'message is required';

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      let formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone_number', Number(formData.phone_number));
      formDataToSend.append('date', formData.date);
      formDataToSend.append('origin', formData.origin);
      formDataToSend.append('destination', formData.destination);
      formDataToSend.append('traveler', formData.traveler);
      formDataToSend.append('children', formData.children);
      formDataToSend.append('message', formData.message);
      formDataToSend.append('form_unit_tag', 'flight_unit_tag_8520'); // Example additional field

      try {
        setLoading(true); // Start loading state

        const resp = await api.sendQueryFlights(formDataToSend); // API call

        if (resp.success) {
          toast.success(resp.message);
          setFormData({
            name: '',
            email: '',
            phone_number: '',
            date: '',
            origin: '',
            destination: '',
            traveler: '',
            children: '',
            message: '',
          });
        } else {
          setErrors(resp.errors);
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        toast.error('There was an error submitting the form.');
      } finally {
        setLoading(false); // End loading state
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form flight-form">
      <h3>Enquiry Now</h3>
      <div className="form-group">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
        />
        {errors.name && <p className="error">{errors.name}</p>}
      </div>

      <div className="form-group">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <p className="error">{errors.email}</p>}
      </div>

      <div className="form-group">
        <input
          type="number"
          name="phone_number"
          placeholder="phone number"
          value={formData.phone_number}
          onChange={handleChange}
        />
        {errors.phone_number && <p className="error">{errors.phone_number}</p>}
      </div>

      <div className="form-group">
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
        />
        {errors.date && <p className="error">{errors.date}</p>}
      </div>

      <div className="form-group">
        <input
          type="text"
          name="origin"
          placeholder="Origin"
          value={formData.origin}
          onChange={handleChange}
        />
        {errors.origin && <p className="error">{errors.origin}</p>}
      </div>

      <div className="form-group">
        <input
          type="text"
          name="destination"
          placeholder="Destination"
          value={formData.destination}
          onChange={handleChange}
        />
        {errors.destination && <p className="error">{errors.destination}</p>}
      </div>

      <div className="form-group">
        <input
          type="number"
          name="traveler"
          placeholder="Traveler"
          value={formData.traveler}
          onChange={handleChange}
        />
        {errors.traveler && <p className="error">{errors.traveler}</p>}
      </div>

      <div className="form-group">
        <input
          type="number"
          name="children"
          placeholder="Children"
          value={formData.children}
          onChange={handleChange}
        />
        {errors.children && <p className="error">{errors.children}</p>}
      </div>

      <div className="form-group">
        <textarea
          name="message"
          placeholder="Ask Your Travel Consultant A Question"
          value={formData.message}
          onChange={handleChange}
        ></textarea>
        {errors.message && <p className="error">{errors.message}</p>}
      </div>

      <button type="submit" className="button">
        {loading ? <FormLoader /> : 'Submit'}
      </button>
    </form>
  );
};

export default EnquiryForm;
