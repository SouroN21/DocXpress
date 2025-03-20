import React from 'react';

const About = () => {
  return (
    <div className="container px-4 py-16 mx-auto">
      {/* Page Header */}
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-blue-600">
          About Doc<span className="text-red-500">X</span>press
        </h1>
      </header>

      {/* Mission Section */}
      <section className="mb-12">
        <p className="mb-6 text-lg leading-relaxed text-gray-700">
          DocXpress is a healthcare platform designed to bridge the gap between patients and healthcare professionals.
          Our mission is to make healthcare accessible, simple, and efficient for everyone.
        </p>

        <p className="mb-6 text-lg leading-relaxed text-gray-700">
          Whether you’re looking to book an appointment with a doctor, get medical advice, or keep track of your health records — DocXpress is here for you.
        </p>

        <p className="text-lg leading-relaxed text-gray-700">
          Our team is committed to providing quality healthcare services with user-friendly tools, advanced technology, and a trustworthy network of doctors.
        </p>
      </section>

      {/* Why Choose Us Section */}
      <section className="mt-12">
        <h2 className="mb-6 text-3xl font-semibold text-center text-blue-500">
          Why Choose Us?
        </h2>
        <ul className="max-w-2xl pl-6 mx-auto space-y-4 text-lg text-gray-700 list-disc">
          <li className="transition-transform transform hover:translate-x-2">
            Easy and quick appointment booking
          </li>
          <li className="transition-transform transform hover:translate-x-2">
            Verified and experienced doctors
          </li>
          <li className="transition-transform transform hover:translate-x-2">
            Secure health records
          </li>
          <li className="transition-transform transform hover:translate-x-2">
            24/7 support and guidance
          </li>
        </ul>
      </section>

      {/* Call to Action (Optional) */}
      <div className="mt-16 text-center">
        <p className="mb-4 text-xl font-semibold text-gray-800">
          Ready to experience better healthcare?
        </p>
        <button className="px-8 py-3 text-lg font-semibold text-white transition-colors duration-300 bg-blue-600 rounded-lg hover:bg-blue-700">
          Get Started
        </button>
      </div>
    </div>
  );
};

export default About;