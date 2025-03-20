import React from 'react';
import { useNavigate } from 'react-router-dom';

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="container max-w-5xl px-6 mx-auto">
        {/* Header */}
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-extrabold text-gray-800 md:text-5xl">
            About Doc<span className="text-blue-600">X</span>press
          </h1>
          <p className="max-w-2xl mx-auto mt-4 text-lg text-gray-600 md:text-xl">
            Revolutionizing healthcare with accessibility, simplicity, and trust.
          </p>
        </header>

        {/* Mission Section */}
        <section className="p-8 mb-12 bg-white shadow-lg rounded-xl">
          <h2 className="mb-6 text-2xl font-semibold text-center text-gray-800 md:text-3xl">
            Our Mission
          </h2>
          <div className="max-w-3xl mx-auto space-y-6 text-lg leading-relaxed text-gray-700">
            <p>
              At DocXpress, we’re dedicated to bridging the gap between patients and healthcare professionals. Our platform empowers you to connect with trusted doctors, manage your health, and access care whenever you need it.
            </p>
            <p>
              From seamless appointment booking to secure health records, we leverage advanced technology to make healthcare effortless and efficient for everyone.
            </p>
            <p>
              Our commitment is to deliver a user-friendly experience backed by a network of experienced professionals, ensuring your well-being is always our top priority.
            </p>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="mb-12">
          <h2 className="mb-8 text-3xl font-bold text-center text-gray-800 md:text-4xl">
            Why Choose DocXpress?
          </h2>
          <div className="grid max-w-4xl grid-cols-1 gap-6 mx-auto md:grid-cols-2">
            <div className="p-6 transition-all duration-300 rounded-lg shadow-md bg-blue-50 hover:shadow-lg">
              <div className="flex items-center mb-3">
                <svg
                  className="w-6 h-6 mr-2 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  ></path>
                </svg>
                <h3 className="text-xl font-semibold text-gray-800">Effortless Booking</h3>
              </div>
              <p className="text-gray-600">Schedule appointments with ease in just a few clicks.</p>
            </div>
            <div className="p-6 transition-all duration-300 rounded-lg shadow-md bg-blue-50 hover:shadow-lg">
              <div className="flex items-center mb-3">
                <svg
                  className="w-6 h-6 mr-2 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  ></path>
                </svg>
                <h3 className="text-xl font-semibold text-gray-800">Trusted Doctors</h3>
              </div>
              <p className="text-gray-600">Consult with verified, experienced healthcare professionals.</p>
            </div>
            <div className="p-6 transition-all duration-300 rounded-lg shadow-md bg-blue-50 hover:shadow-lg">
              <div className="flex items-center mb-3">
                <svg
                  className="w-6 h-6 mr-2 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 11c0-1.104-.896-2-2-2s-2 .896-2 2c0 .738.402 1.376 1 1.723V15a1 1 0 001 1h1a1 1 0 001-1v-2.277c.598-.347 1-.985 1-1.723zm9-6v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2z"
                  ></path>
                </svg>
                <h3 className="text-xl font-semibold text-gray-800">Secure Records</h3>
              </div>
              <p className="text-gray-600">Keep your health data safe and accessible.</p>
            </div>
            <div className="p-6 transition-all duration-300 rounded-lg shadow-md bg-blue-50 hover:shadow-lg">
              <div className="flex items-center mb-3">
                <svg
                  className="w-6 h-6 mr-2 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                  ></path>
                </svg>
                <h3 className="text-xl font-semibold text-gray-800">24/7 Support</h3>
              </div>
              <p className="text-gray-600">Get assistance anytime you need it.</p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-12 text-center text-white shadow-lg bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl">
          <h2 className="mb-4 text-2xl font-bold md:text-3xl">
            Ready to Experience Better Healthcare?
          </h2>
          <p className="max-w-xl mx-auto mb-6 text-lg text-blue-100">
            Join DocXpress today and take the first step towards simplified, quality care.
          </p>
          <button
            onClick={() => navigate('/register')}
            className="px-8 py-3 text-lg font-semibold text-blue-600 transition-all duration-300 bg-white rounded-full shadow-md hover:bg-blue-50 hover:scale-105"
          >
            Get Started
          </button>
        </section>
      </div>
    </div>
  );
};

export default About;