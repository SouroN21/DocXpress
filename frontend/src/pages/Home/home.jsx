import React from "react";
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative flex items-center justify-center h-screen text-white bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="relative z-10 max-w-4xl px-6 mx-auto text-center">
          <h1 className="mb-4 text-5xl font-extrabold tracking-tight md:text-6xl animate-fade-in-down">
            Your Health, Simplified
          </h1>
          <p className="mb-8 text-lg text-blue-100 md:text-xl animate-fade-in-up">
            Seamlessly book appointments, consult top doctors, and manage your wellness—all in one place.
          </p>
          <button
            onClick={() => navigate('/doctors')}
            className="px-8 py-4 text-lg font-semibold text-blue-600 transition-all duration-300 bg-white rounded-full shadow-lg hover:bg-blue-100 hover:scale-105"
          >
            Book an Appointment
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl px-6 mx-auto">
          <h2 className="mb-12 text-3xl font-bold text-center text-gray-800 md:text-4xl">
            Why Choose Us?
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Feature 1 */}
            <div className="p-6 text-center transition-transform shadow-md bg-gray-50 rounded-xl hover:shadow-lg hover:-translate-y-2">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full">
                <i className="text-2xl text-blue-600 fas fa-user-md"></i> {/* Font Awesome Icon */}
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-800">Expert Doctors</h3>
              <p className="text-gray-600">
                Connect with highly skilled professionals for top-tier care.
              </p>
            </div>
            {/* Feature 2 */}
            <div className="p-6 text-center transition-transform shadow-md bg-gray-50 rounded-xl hover:shadow-lg hover:-translate-y-2">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full">
                <i className="text-2xl text-blue-600 fas fa-video"></i> {/* Font Awesome Icon */}
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-800">Virtual Consultations</h3>
              <p className="text-gray-600">
                Access healthcare anytime, anywhere with online visits.
              </p>
            </div>
            {/* Feature 3 */}
            <div className="p-6 text-center transition-transform shadow-md bg-gray-50 rounded-xl hover:shadow-lg hover:-translate-y-2">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full">
                <i className="text-2xl text-blue-600 fas fa-calendar-check"></i> {/* Font Awesome Icon */}
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-800">Effortless Scheduling</h3>
              <p className="text-gray-600">
                Book and manage appointments with just a few clicks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-3xl px-6 mx-auto text-center">
          <h2 className="mb-4 text-2xl font-bold text-gray-800 md:text-3xl">
            Ready to Take Control of Your Health?
          </h2>
          <p className="mb-6 text-gray-600">
            Join thousands of patients who trust us for their healthcare needs.
          </p>
          <button
            onClick={() => navigate('/register')}
            className="px-6 py-3 text-lg font-medium text-white transition bg-blue-500 rounded-lg shadow-md hover:bg-blue-600"
          >
            Get Started
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;