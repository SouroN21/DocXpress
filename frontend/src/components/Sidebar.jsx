// components/Sidebar.js
import React from 'react';

const Sidebar = ({ doctorProfile, activeSection, setActiveSection }) => {
  return (
    <aside className="flex-shrink-0 w-64 p-6 text-white bg-blue-800">
      <h2 className="text-2xl font-bold">Doctor Dashboard</h2>
      <p className="mt-2 text-sm">Welcome, Dr. {doctorProfile?.userId.firstName}</p>
      <nav className="mt-6 space-y-2">
        {['profile', 'appointments', 'feedbacks'].map((section) => (
          <button
            key={section}
            onClick={() => setActiveSection(section)}
            className={`w-full py-3 text-left px-4 rounded transition-colors ${
              activeSection === section ? 'bg-blue-900' : 'hover:bg-blue-700'
            }`}
          >
            {section.charAt(0).toUpperCase() + section.slice(1)}
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;