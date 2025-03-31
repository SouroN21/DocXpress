// components/HomePage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.2
    }
  }
};

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen font-sans bg-gray-100">
      {/* Hero Section */}
      <section className="relative flex items-center justify-center h-screen text-white bg-gradient-to-br from-blue-700 via-blue-800 to-blue-900">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <motion.div 
          className="relative z-10 max-w-5xl px-6 mx-auto text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <motion.h1 
            className="mb-6 text-5xl font-extrabold tracking-tight md:text-6xl lg:text-7xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Empowering Your Health Journey
          </motion.h1>
          <motion.p 
            className="mb-8 text-lg text-blue-100 md:text-xl lg:text-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Discover a seamless way to book appointments, consult expert doctors, and manage your wellness—all tailored to your needs.
          </motion.p>
          <motion.div 
            className="flex justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/doctors')}
              className="px-8 py-4 text-lg font-semibold text-white transition-all duration-300 bg-blue-500 rounded-full shadow-xl hover:bg-blue-600 focus:ring-4 focus:ring-blue-300"
            >
              Book an Appointment
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/register')}
              className="px-8 py-4 text-lg font-semibold text-blue-500 transition-all duration-300 bg-white rounded-full shadow-xl hover:bg-blue-50 focus:ring-4 focus:ring-blue-300"
            >
              Sign Up Now
            </motion.button>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="px-6 mx-auto max-w-7xl">
          <motion.h2 
            className="mb-12 text-4xl font-bold text-center text-gray-800 md:text-5xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Why Choose Our Platform?
          </motion.h2>
          <motion.p 
            className="max-w-3xl mx-auto mb-16 text-lg text-center text-gray-600"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            We're committed to making healthcare accessible, efficient, and personalized. Here's what sets us apart:
          </motion.p>
          <motion.div 
            className="grid grid-cols-1 gap-10 md:grid-cols-3"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {/* Feature 1 */}
            <motion.div 
              className="p-8 text-center transition-transform shadow-lg bg-gray-50 rounded-2xl hover:shadow-xl"
              variants={fadeInUp}
              whileHover={{ y: -10 }}
            >
              <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 bg-blue-100 rounded-full">
                <i className="text-3xl text-blue-600 fas fa-user-md"></i>
              </div>
              <h3 className="mb-3 text-2xl font-semibold text-gray-800">Top-Tier Doctors</h3>
              <p className="text-gray-600">
                Connect with board-certified specialists across various fields, ensuring you receive expert care tailored to your condition.
              </p>
            </motion.div>
            {/* Feature 2 */}
            <motion.div 
              className="p-8 text-center transition-transform shadow-lg bg-gray-50 rounded-2xl hover:shadow-xl"
              variants={fadeInUp}
              whileHover={{ y: -10 }}
            >
              <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 bg-blue-100 rounded-full">
                <i className="text-3xl text-blue-600 fas fa-video"></i>
              </div>
              <h3 className="mb-3 text-2xl font-semibold text-gray-800">Virtual Consultations</h3>
              <p className="text-gray-600">
                Enjoy secure, high-quality video consultations from the comfort of your home, saving time and travel hassles.
              </p>
            </motion.div>
            {/* Feature 3 */}
            <motion.div 
              className="p-8 text-center transition-transform shadow-lg bg-gray-50 rounded-2xl hover:shadow-xl"
              variants={fadeInUp}
              whileHover={{ y: -10 }}
            >
              <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 bg-blue-100 rounded-full">
                <i className="text-3xl text-blue-600 fas fa-calendar-check"></i>
              </div>
              <h3 className="mb-3 text-2xl font-semibold text-gray-800">Effortless Scheduling</h3>
              <p className="text-gray-600">
                Book, reschedule, or cancel appointments in seconds with our intuitive system, synced to your calendar.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 text-white bg-blue-700">
        <div className="px-6 mx-auto max-w-7xl">
          <motion.h2 
            className="mb-12 text-4xl font-bold text-center md:text-5xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Our Impact
          </motion.h2>
          <motion.div 
            className="grid grid-cols-1 gap-8 md:grid-cols-3"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <motion.div 
              className="text-center"
              variants={fadeInUp}
              whileHover={{ scale: 1.1 }}
            >
              <p className="text-5xl font-extrabold">10,000+</p>
              <p className="mt-2 text-lg">Appointments Booked</p>
            </motion.div>
            <motion.div 
              className="text-center"
              variants={fadeInUp}
              whileHover={{ scale: 1.1 }}
            >
              <p className="text-5xl font-extrabold">500+</p>
              <p className="mt-2 text-lg">Trusted Doctors</p>
            </motion.div>
            <motion.div 
              className="text-center"
              variants={fadeInUp}
              whileHover={{ scale: 1.1 }}
            >
              <p className="text-5xl font-extrabold">95%</p>
              <p className="mt-2 text-lg">Patient Satisfaction</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gray-50">
        <div className="px-6 mx-auto max-w-7xl">
          <motion.h2 
            className="mb-12 text-4xl font-bold text-center text-gray-800 md:text-5xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            What Our Patients Say
          </motion.h2>
          <motion.div 
            className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {/* Testimonial 1 */}
            <motion.div 
              className="p-6 bg-white shadow-lg rounded-2xl"
              variants={fadeInUp}
              whileHover={{ y: -5 }}
            >
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
            </motion.div>
            {/* Testimonial 2 */}
            <motion.div 
              className="p-6 bg-white shadow-lg rounded-2xl"
              variants={fadeInUp}
              whileHover={{ y: -5 }}
            >
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
            </motion.div>
            {/* Testimonial 3 */}
            <motion.div 
              className="p-6 bg-white shadow-lg rounded-2xl"
              variants={fadeInUp}
              whileHover={{ y: -5 }}
            >
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
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-24 bg-gradient-to-br from-blue-50 to-blue-100">
        <motion.div 
          className="max-w-4xl px-6 mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="mb-4 text-3xl font-bold text-gray-800 md:text-4xl lg:text-5xl">
            Take the First Step Toward Better Health
          </h2>
          <p className="max-w-2xl mx-auto mb-8 text-lg text-gray-600">
            Join a growing community of patients and doctors who trust us to deliver exceptional healthcare experiences.
          </p>
          <div className="flex justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/register')}
              className="px-8 py-4 text-lg font-medium text-white transition-all duration-300 bg-blue-500 rounded-full shadow-lg hover:bg-blue-600 focus:ring-4 focus:ring-blue-300"
            >
              Get Started
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/login')}
              className="px-8 py-4 text-lg font-medium text-blue-500 transition-all duration-300 bg-white rounded-full shadow-lg hover:bg-blue-50 focus:ring-4 focus:ring-blue-300"
            >
              Log In
            </motion.button>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default HomePage;