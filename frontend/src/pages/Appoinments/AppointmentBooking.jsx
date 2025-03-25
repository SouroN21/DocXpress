import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { FaCalendarAlt, FaClock, FaUserMd, FaVideo, FaClinicMedical } from 'react-icons/fa';

const stripePromise = loadStripe('pk_test_51R4696HMKbL3MyQep9UdgfrZYeL5DJnvgGOmXYRyWuga5HDPMUsDsCivnIlHH9j9nVjOs14fnefYnrIl7BULx06600Fczm0mLr');

const AppointmentBooking = () => {
    const { doctorId } = useParams();
    const [formData, setFormData] = useState({ dateTime: '', mode: 'In-Person' });
    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true); // Initialize loading as true
    const [bookingLoading, setBookingLoading] = useState(false); // Separate loading for booking
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            setError('Please log in to book an appointment.');
            setTimeout(() => navigate('/login'), 2000);
            return;
        }

        const fetchDoctor = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/doc/${doctorId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setDoctor(response.data);
            } catch (err) {
                setError('Error fetching doctor details.');
            } finally {
                setLoading(false);
            }
        };

        fetchDoctor();
    }, [doctorId, token, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!token) return;
        setBookingLoading(true);
        setError('');

        try {
            const decodedToken = JSON.parse(atob(token.split('.')[1]));
            const patientId = decodedToken.id;

            const response = await axios.post(
                'http://localhost:5000/appointment/add',
                { patientId, doctorId, dateTime: formData.dateTime, mode: formData.mode },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const stripe = await stripePromise;
            const { stripeSessionId } = response.data;
            const { error: stripeError } = await stripe.redirectToCheckout({ sessionId: stripeSessionId });

            if (stripeError) {
                setError(stripeError.message);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Error booking appointment.');
        } finally {
            setBookingLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <svg className="w-10 h-10 text-indigo-500 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                <span className="ml-3 text-lg font-medium text-gray-700">Loading doctor information...</span>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-12 bg-gray-100">
            <div className="max-w-3xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl">
                <div className="flex items-center px-6 py-6 space-x-4 text-white bg-indigo-600">
                    <FaUserMd className="text-3xl" />
                    <div>
                        <h2 className="text-xl font-semibold">Book Appointment</h2>
                        <p className="text-indigo-200">Schedule your consultation with our doctor</p>
                    </div>
                </div>

                {doctor && (
                    <div className="flex items-center px-6 py-4 space-x-4 bg-indigo-100 border-b border-gray-200">
                        <div className="flex-shrink-0">
                            <div className="relative flex items-center justify-center w-12 h-12 overflow-hidden font-semibold text-white bg-indigo-500 rounded-full">
                                {doctor.image ? (
                                    <img src={doctor.image} alt={`${doctor.userId.firstName} ${doctor.userId.lastName}`} className="object-cover w-full h-full" />
                                ) : (
                                    <span>{doctor.userId.firstName.charAt(0)}{doctor.userId.lastName.charAt(0)}</span>
                                )}
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800">
                                Dr. {doctor.userId.firstName} {doctor.userId.lastName}
                            </h3>
                            <p className="text-sm text-indigo-700">{doctor.specialization}</p>
                        </div>
                    </div>
                )}

                <div className="p-6 sm:p-8">
                    {error && (
                        <div className="p-4 mb-6 border-l-4 border-red-500 rounded bg-red-50">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="w-5 h-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-red-700">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="dateTime" className="block mb-2 text-sm font-medium text-gray-700">
                                <FaCalendarAlt className="inline-block mr-2 -mt-0.5 align-middle text-indigo-500" />
                                Appointment Date & Time
                            </label>
                            <input
                                type="datetime-local"
                                id="dateTime"
                                name="dateTime"
                                value={formData.dateTime}
                                onChange={handleChange}
                                min={new Date().toISOString().slice(0, 16)}
                                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                                required
                            />
                            <p className="mt-1 text-xs text-gray-500">Please select a future date and time.</p>
                        </div>

                        <div>
                            <label htmlFor="mode" className="block mb-2 text-sm font-medium text-gray-700">
                                <FaClock className="inline-block mr-2 -mt-0.5 align-middle text-indigo-500" />
                                Consultation Type
                            </label>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div
                                    onClick={() => setFormData({ ...formData, mode: 'In-Person' })}
                                    className={`relative rounded-lg border p-4 cursor-pointer focus:outline-none ${
                                        formData.mode === 'In-Person'
                                            ? 'border-indigo-500 bg-indigo-50 shadow-sm'
                                            : 'border-gray-300 hover:border-gray-400'
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        id="inPerson"
                                        name="mode"
                                        value="In-Person"
                                        checked={formData.mode === 'In-Person'}
                                        onChange={handleChange}
                                        className="absolute w-0 h-0 opacity-0"
                                    />
                                    <div className="flex items-center space-x-3">
                                        <FaClinicMedical className={`w-6 h-6 ${formData.mode === 'In-Person' ? 'text-indigo-600' : 'text-gray-500'}`} />
                                        <label htmlFor="inPerson" className="block font-medium text-gray-700">
                                            In-Person
                                            <p className="text-xs text-gray-500">Visit the clinic</p>
                                        </label>
                                    </div>
                                    {formData.mode === 'In-Person' && (
                                        <div className="absolute top-0 right-0 m-2">
                                            <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    )}
                                </div>

                                <div
                                    onClick={() => setFormData({ ...formData, mode: 'Online' })}
                                    className={`relative rounded-lg border p-4 cursor-pointer focus:outline-none ${
                                        formData.mode === 'Online'
                                            ? 'border-indigo-500 bg-indigo-50 shadow-sm'
                                            : 'border-gray-300 hover:border-gray-400'
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        id="online"
                                        name="mode"
                                        value="Online"
                                        checked={formData.mode === 'Online'}
                                        onChange={handleChange}
                                        className="absolute w-0 h-0 opacity-0"
                                    />
                                    <div className="flex items-center space-x-3">
                                        <FaVideo className={`w-6 h-6 ${formData.mode === 'Online' ? 'text-indigo-600' : 'text-gray-500'}`} />
                                        <label htmlFor="online" className="block font-medium text-gray-700">
                                            Online
                                            <p className="text-xs text-gray-500">Video consultation</p>
                                        </label>
                                    </div>
                                    {formData.mode === 'Online' && (
                                        <div className="absolute top-0 right-0 m-2">
                                            <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={bookingLoading || loading || !doctor}
                                className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white ${
                                    bookingLoading || loading || !doctor
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                                }`}
                            >
                                {bookingLoading ? (
                                    <>
                                        <svg className="w-5 h-5 mr-3 -ml-1 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing...
                                    </>
                                ) : (
                                    'Proceed to Payment'
                                )}
                            </button>
                            <p className="mt-2 text-sm text-center text-gray-500">
                                You will be redirected to secure payment after confirmation.
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AppointmentBooking;