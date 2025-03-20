// components/Appointments.js
import React, { useState } from 'react';
import AppointmentDetails from './AppointmentModal';

const Appointments = ({ appointments, handleAppointmentClick, handleStatusUpdate }) => {
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [modeFilter, setModeFilter] = useState('');

  const localHandleAppointmentClick = (appointment) => {
    setSelectedAppointment(appointment);
    handleAppointmentClick(appointment);
  };

  const closeAppointmentDetails = () => {
    setSelectedAppointment(null);
  };

  // Filtered Appointments
  const filteredAppointments = appointments.filter((appointment) => {
    const patientName = `${appointment.patientId.firstName} ${appointment.patientId.lastName}`.toLowerCase();
    return (
      patientName.includes(searchTerm.toLowerCase()) &&
      (statusFilter ? appointment.status === statusFilter : true) &&
      (modeFilter ? appointment.mode === modeFilter : true)
    );
  });

  return (
    <section className="p-6 bg-white shadow-lg rounded-2xl">
      <h3 className="mb-6 text-2xl font-bold text-gray-800">My Appointments</h3>

      {/* Search and Filters */}
      <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-center">
        <input
          type="text"
          placeholder="🔍 Search by patient name..."
          className="w-full p-3 border border-gray-300 rounded-lg md:w-1/3"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="w-full p-3 border border-gray-300 rounded-lg md:w-1/4"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">Filter by Status</option>
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Completed">Completed</option>
          <option value="Canceled">Canceled</option>
        </select>
        <select
          className="w-full p-3 border border-gray-300 rounded-lg md:w-1/4"
          value={modeFilter}
          onChange={(e) => setModeFilter(e.target.value)}
        >
          <option value="">Filter by Mode</option>
          <option value="Online">Online</option>
          <option value="In-Person">In-Person</option>
        </select>
      </div>

      {filteredAppointments.length === 0 ? (
        <p className="text-gray-500">No appointments found.</p>
      ) : (
        <div className="space-y-4">
          {filteredAppointments.map((appointment) => (
            <div
              key={appointment._id}
              onClick={() => localHandleAppointmentClick(appointment)}
              className={`p-5 transition-all duration-300 border border-gray-200 shadow-sm cursor-pointer rounded-xl ${
                selectedAppointment?._id === appointment._id ? 'bg-indigo-100' : 'bg-gray-50 hover:bg-indigo-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800">
                    👤 <span className="font-semibold">Patient:</span> {appointment.patientId.firstName} {appointment.patientId.lastName}
                  </p>
                  <p className="mt-1 text-gray-700">
                    📅 <span className="font-semibold">Date & Time:</span> {new Date(appointment.dateTime).toLocaleString()}
                  </p>
                  <p className="mt-1 text-gray-700">
                    💻 <span className="font-semibold">Mode:</span> {appointment.mode}
                  </p>
                </div>
                <span className={`px-4 py-1 text-sm rounded-full ${
                  appointment.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                  appointment.status === 'Confirmed' ? 'bg-blue-100 text-blue-700' :
                  appointment.status === 'Completed' ? 'bg-green-100 text-green-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {appointment.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedAppointment && (
        <AppointmentDetails 
          selectedAppointment={selectedAppointment}
          handleStatusUpdate={handleStatusUpdate}
          closeAppointmentDetails={closeAppointmentDetails}
        />
      )}
    </section>
  );
};

export default Appointments;
