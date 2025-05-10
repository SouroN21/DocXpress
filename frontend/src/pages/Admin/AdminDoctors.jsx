import React, { useState } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const AdminDoctors = ({ doctors, onDoctorUpdate }) => {
  const token = localStorage.getItem('token');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [searchTerm, setSearchTerm] = useState('');

  const handleDeleteDoctor = async (doctorId) => {
    if (!window.confirm('Are you sure you want to delete this doctor profile?')) return;
    try {
      await axios.delete(`http://localhost:5000/doctor/${doctorId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onDoctorUpdate(doctors.filter((doctor) => doctor._id !== doctorId));
      alert('Doctor profile deleted successfully');
    } catch (error) {
      alert(
        error.response?.status === 403 ? 'Cannot delete doctor with active appointments.' :
        error.response?.status === 404 ? 'Doctor profile not found.' :
        error.response?.data?.message || 'Error deleting doctor profile'
      );
    }
  };

  const handleUpdateStatus = async (doctorId, newStatus) => {
    try {
      const response = await axios.put(
        'http://localhost:5000/doctor/status',
        { doctorId, status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onDoctorUpdate(
        doctors.map((doctor) =>
          doctor._id === doctorId ? { ...doctor, status: response.data.doctor.status } : doctor
        )
      );
      alert('Doctor status updated successfully');
    } catch (error) {
      alert(
        error.response?.status === 404 ? 'Doctor not found.' :
        error.response?.data?.message || 'Error updating doctor status'
      );
    }
  };

  const generateDoctorReport = () => {
    const doc = new jsPDF();
    doc.text('Doctors Report', 20, 20);
    doc.autoTable({
      startY: 30,
      head: [['Name', 'Specialization', 'Status', 'Email']],
      body: filteredDoctors.map((doctor) => [
        `${doctor.userId?.firstName || 'N/A'} ${doctor.userId?.lastName || ''}`,
        doctor.specialization || 'N/A',
        doctor.status || 'N/A',
        doctor.userId?.email || 'N/A',
      ]),
    });
    doc.save('doctors_report.pdf');
  };

  const filteredDoctors = doctors
    .filter((doctor) =>
      filterStatus === 'all' ? true : doctor.status === filterStatus
    )
    .filter((doctor) =>
      `${doctor.userId?.firstName || ''} ${doctor.userId?.lastName || ''} ${doctor.specialization || ''}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'name') {
        return `${a.userId?.firstName || ''} ${a.userId?.lastName || ''}`.localeCompare(
          `${b.userId?.firstName || ''} ${b.userId?.lastName || ''}`
        );
      }
      return (a.specialization || '').localeCompare(b.specialization || '');
    });

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-semibold text-gray-800">Manage Doctors</h3>
        <button
          onClick={generateDoctorReport}
          className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none"
        >
          Generate Report
        </button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col gap-4 mb-6 sm:flex-row">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">Search</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name or specialization"
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Filter by Status</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Sort by</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="name">Name</option>
            <option value="specialization">Specialization</option>
          </select>
        </div>
      </div>

      {filteredDoctors.length === 0 ? (
        <p className="text-gray-500">No doctors found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-4 font-semibold text-gray-700">Name</th>
                <th className="p-4 font-semibold text-gray-700">Specialization</th>
                <th className="p-4 font-semibold text-gray-700">Email</th>
                <th className="p-4 font-semibold text-gray-700">Status</th>
                <th className="p-4 font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredDoctors.map((doctor) => (
                <tr key={doctor._id} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    {doctor.userId?.firstName
                      ? `${doctor.userId.firstName} ${doctor.userId.lastName || ''}`
                      : 'N/A'}
                  </td>
                  <td className="p-4">{doctor.specialization || 'N/A'}</td>
                  <td className="p-4">{doctor.userId?.email || 'N/A'}</td>
                  <td className="p-4">
                    <select
                      value={doctor.status || 'pending'}
                      onChange={(e) => handleUpdateStatus(doctor._id, e.target.value)}
                      className={`px-2 py-1 text-sm rounded-full border-none focus:ring-2 focus:ring-blue-500 ${
                        doctor.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : doctor.status === 'inactive'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleDeleteDoctor(doctor._id)}
                      className="px-3 py-1 text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none"
                      title="Delete doctor profile"
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

export default AdminDoctors;