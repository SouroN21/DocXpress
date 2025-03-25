import React from 'react';
import axios from 'axios';

const AdminAppointments = ({ appointments, onAppointmentUpdate }) => {
  const token = localStorage.getItem('token');

  const handleDeleteAppointment = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to delete this appointment?')) return;
    try {
      await axios.delete(`http://localhost:5000/appointment/delete/${appointmentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onAppointmentUpdate(appointments.filter((appointment) => appointment._id !== appointmentId));
      alert('Appointment deleted successfully');
    } catch (error) {
      alert(error.response?.data?.message || 'Error deleting appointment');
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="mb-4 text-2xl font-semibold text-gray-800">All Appointments</h3>
      {appointments.length === 0 ? (
        <p className="text-gray-500">No appointments found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-4 font-semibold">Patient</th>
                <th className="p-4 font-semibold">Doctor</th>
                <th className="p-4 font-semibold">Date & Time</th>
                <th className="p-4 font-semibold">Mode</th>
                <th className="p-4 font-semibold">Payment</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment._id} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    {appointment.patientId?.firstName
                      ? `${appointment.patientId.firstName} ${appointment.patientId.lastName || ''}`
                      : 'N/A'}
                  </td>
                  <td className="p-4">
                    {appointment.doctorId?.firstName
                      ? `${appointment.doctorId.firstName} ${appointment.doctorId.lastName || ''}`
                      : 'N/A'}
                  </td>
                  <td className="p-4">
                    {appointment.dateTime ? new Date(appointment.dateTime).toLocaleString() : 'N/A'}
                  </td>
                  <td className="p-4">{appointment.mode || 'N/A'}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 text-sm rounded-full ${
                        appointment.paidStatus === 'Paid'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {appointment.paidStatus || 'N/A'}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 text-sm rounded-full ${
                        appointment.status === 'Confirmed' || appointment.status === 'Completed'
                          ? 'bg-green-100 text-green-700'
                          : appointment.status === 'Canceled'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {appointment.status || 'N/A'}
                    </span>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleDeleteAppointment(appointment._id)}
                      className="px-3 py-1 text-white bg-red-500 rounded-lg hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminAppointments;