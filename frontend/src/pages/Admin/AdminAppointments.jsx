import React, { useState } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const AdminAppointments = ({ appointments, onAppointmentUpdate }) => {
  const token = localStorage.getItem('token');
  const [filterStatus, setFilterStatus] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortBy, setSortBy] = useState('date');

  const handleDeleteAppointment = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to delete this appointment?')) return;
    try {
      await axios.delete(`http://localhost:5000/appointment/delete/${appointmentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onAppointmentUpdate(appointments.filter((appointment) => appointment._id !== appointmentId));
      alert('Appointment deleted successfully');
    } catch (error) {
      alert(
        error.response?.status === 404 ? 'Appointment not found.' :
        error.response?.data?.message || 'Error deleting appointment'
      );
    }
  };

  const generateAppointmentReport = () => {
    const doc = new jsPDF();
    doc.text('Appointments Report', 20, 20);
    doc.autoTable({
      startY: 30,
      head: [['Patient', 'Doctor', 'Date & Time', 'Mode', 'Payment', 'Status']],
      body: filteredAppointments.map((appointment) => [
        `${appointment.patientId?.firstName || 'N/A'} ${appointment.patientId?.lastName || ''}`,
        `${appointment.doctorId?.firstName || 'N/A'} ${appointment.doctorId?.lastName || ''}`,
        appointment.dateTime ? new Date(appointment.dateTime).toLocaleString() : 'N/A',
        appointment.mode || 'N/A',
        appointment.paidStatus || 'N/A',
        appointment.status || 'N/A',
      ]),
    });
    doc.save('appointments_report.pdf');
  };

  const filteredAppointments = appointments
    .filter((appointment) =>
      filterStatus === 'all' ? true : appointment.status === filterStatus
    )
    .filter((appointment) => {
      if (!startDate && !endDate) return true;
      const date = new Date(appointment.dateTime);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;
      return (
        (!start || date >= start) &&
        (!end || date <= new Date(end.getTime() + 86400000)) // Include end of day
      );
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(a.dateTime) - new Date(b.dateTime);
      }
      return (a.patientId?.firstName || '').localeCompare(b.patientId?.firstName || '');
    });

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-semibold text-gray-800">Manage Appointments</h3>
        <button
          onClick={generateAppointmentReport}
          className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none"
        >
          Generate Report
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 mb-6 sm:flex-row">
        <div>
          <label className="block text-sm font-medium text-gray-700">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Completed">Completed</option>
            <option value="Canceled">Canceled</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Sort by</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="date">Date</option>
            <option value="patient">Patient Name</option>
          </select>
        </div>
      </div>

      {filteredAppointments.length === 0 ? (
        <p className="text-gray-500">No appointments found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-4 font-semibold text-gray-700">Patient</th>
                <th className="p-4 font-semibold text-gray-700">Doctor</th>
                <th className="p-4 font-semibold text-gray-700">Date & Time</th>
                <th className="p-4 font-semibold text-gray-700">Mode</th>
                <th className="p-4 font-semibold text-gray-700">Payment</th>
                <th className="p-4 font-semibold text-gray-700">Status</th>
                <th className="p-4 font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map((appointment) => (
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
                      className="px-3 py-1 text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none"
                      title="Delete appointment"
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