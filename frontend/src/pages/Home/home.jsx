// components/HomePage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen font-sans bg-gray-100">
      {/* Hero Section */}
      <section className="relative flex items-center justify-center h-screen text-white bg-gradient-to-br from-blue-700 via-blue-800 to-blue-900">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 max-w-5xl px-6 mx-auto text-center">
          <h1 className="mb-6 text-5xl font-extrabold tracking-tight md:text-6xl lg:text-7xl animate-fade-in-down">
            Empowering Your Health Journey
          </h1>
          <p className="mb-8 text-lg text-blue-100 md:text-xl lg:text-2xl animate-fade-in-up">
            Discover a seamless way to book appointments, consult expert doctors, and manage your wellness—all tailored to your needs.
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => navigate('/doctors')}
              className="px-8 py-4 text-lg font-semibold text-white transition-all duration-300 bg-blue-500 rounded-full shadow-xl hover:bg-blue-600 hover:scale-105 focus:ring-4 focus:ring-blue-300"
            >
              Book an Appointment
            </button>
            <button
              onClick={() => navigate('/register')}
              className="px-8 py-4 text-lg font-semibold text-blue-500 transition-all duration-300 bg-white rounded-full shadow-xl hover:bg-blue-50 hover:scale-105 focus:ring-4 focus:ring-blue-300"
            >
              Sign Up Now
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="px-6 mx-auto max-w-7xl">
          <h2 className="mb-12 text-4xl font-bold text-center text-gray-800 md:text-5xl">
            Why Choose Our Platform?
          </h2>
          <p className="max-w-3xl mx-auto mb-16 text-lg text-center text-gray-600">
            We’re committed to making healthcare accessible, efficient, and personalized. Here’s what sets us apart:
          </p>
          <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
            {/* Feature 1 */}
            <div className="p-8 text-center transition-transform shadow-lg bg-gray-50 rounded-2xl hover:shadow-xl hover:-translate-y-2">
              <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 bg-blue-100 rounded-full">
                <i className="text-3xl text-blue-600 fas fa-user-md"></i>
              </div>
              <h3 className="mb-3 text-2xl font-semibold text-gray-800">Top-Tier Doctors</h3>
              <p className="text-gray-600">
                Connect with board-certified specialists across various fields, ensuring you receive expert care tailored to your condition.
              </p>
            </div>
            {/* Feature 2 */}
            <div className="p-8 text-center transition-transform shadow-lg bg-gray-50 rounded-2xl hover:shadow-xl hover:-translate-y-2">
              <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 bg-blue-100 rounded-full">
                <i className="text-3xl text-blue-600 fas fa-video"></i>
              </div>
              <h3 className="mb-3 text-2xl font-semibold text-gray-800">Virtual Consultations</h3>
              <p className="text-gray-600">
                Enjoy secure, high-quality video consultations from the comfort of your home, saving time and travel hassles.
              </p>
            </div>
            {/* Feature 3 */}
            <div className="p-8 text-center transition-transform shadow-lg bg-gray-50 rounded-2xl hover:shadow-xl hover:-translate-y-2">
              <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 bg-blue-100 rounded-full">
                <i className="text-3xl text-blue-600 fas fa-calendar-check"></i>
              </div>
              <h3 className="mb-3 text-2xl font-semibold text-gray-800">Effortless Scheduling</h3>
              <p className="text-gray-600">
                Book, reschedule, or cancel appointments in seconds with our intuitive system, synced to your calendar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 text-white bg-blue-700">
        <div className="px-6 mx-auto max-w-7xl">
          <h2 className="mb-12 text-4xl font-bold text-center md:text-5xl">Our Impact</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="text-center">
              <p className="text-5xl font-extrabold">10,000+</p>
              <p className="mt-2 text-lg">Appointments Booked</p>
            </div>
            <div className="text-center">
              <p className="text-5xl font-extrabold">500+</p>
              <p className="mt-2 text-lg">Trusted Doctors</p>
            </div>
            <div className="text-center">
              <p className="text-5xl font-extrabold">95%</p>
              <p className="mt-2 text-lg">Patient Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gray-50">
        <div className="px-6 mx-auto max-w-7xl">
          <h2 className="mb-12 text-4xl font-bold text-center text-gray-800 md:text-5xl">
            What Our Patients Say
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Testimonial 1 */}
            <div className="p-6 bg-white shadow-lg rounded-2xl">
              <p className="italic text-gray-600">
                "Booking an appointment was so easy, and the virtual consultation saved me a trip to the clinic!"
              </p>
              <div className="flex items-center mt-4">
                <img
                  src="https://via.placeholder.com/50"
                  alt="Patient"
                  className="w-12 h-12 mr-3 rounded-full"
                />
                <div>
                  <p className="font-semibold text-gray-800">Sarah M.</p>
                  <p className="text-sm text-gray-500">Patient</p>
                </div>
              </div>
            </div>
            {/* Testimonial 2 */}
            <div className="p-6 bg-white shadow-lg rounded-2xl">
              <p className="italic text-gray-600">
                "The doctors are incredibly knowledgeable and caring. I felt heard and well taken care of."
              </p>
              <div className="flex items-center mt-4">
                <img
                  src="https://via.placeholder.com/50"
                  alt="Patient"
                  className="w-12 h-12 mr-3 rounded-full"
                />
                <div>
                  <p className="font-semibold text-gray-800">James T.</p>
                  <p className="text-sm text-gray-500">Patient</p>
                </div>
              </div>
            </div>
            {/* Testimonial 3 */}
            <div className="p-6 bg-white shadow-lg rounded-2xl">
              <p className="italic text-gray-600">
                "This platform has transformed how I manage my health. Highly recommend it!"
              </p>
              <div className="flex items-center mt-4">
                <img
                  src="https://via.placeholder.com/50"
                  alt="Patient"
                  className="w-12 h-12 mr-3 rounded-full"
                />
                <div>
                  <p className="font-semibold text-gray-800">Emily R.</p>
                  <p className="text-sm text-gray-500">Patient</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-24 bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="max-w-4xl px-6 mx-auto text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-800 md:text-4xl lg:text-5xl">
            Take the First Step Toward Better Health
          </h2>
          <p className="max-w-2xl mx-auto mb-8 text-lg text-gray-600">
            Join a growing community of patients and doctors who trust us to deliver exceptional healthcare experiences.
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => navigate('/register')}
              className="px-8 py-4 text-lg font-medium text-white transition-all duration-300 bg-blue-500 rounded-full shadow-lg hover:bg-blue-600 hover:scale-105 focus:ring-4 focus:ring-blue-300"
            >
              Get Started
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-4 text-lg font-medium text-blue-500 transition-all duration-300 bg-white rounded-full shadow-lg hover:bg-blue-50 hover:scale-105 focus:ring-4 focus:ring-blue-300"
            >
              Log In
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;