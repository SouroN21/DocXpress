import React from 'react';
import axios from 'axios';

const AdminDoctors = ({ doctors, onDoctorUpdate }) => {
  const token = localStorage.getItem('token');

  const handleDeleteDoctor = async (doctorId) => {
    if (!window.confirm('Are you sure you want to delete this doctor profile?')) return;
    try {
      await axios.delete(`http://localhost:5000/doctor/${doctorId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onDoctorUpdate(doctors.filter((doctor) => doctor._id !== doctorId));
      alert('Doctor profile deleted successfully');
    } catch (error) {
      alert(error.response?.data?.message || 'Error deleting doctor profile');
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
      alert(error.response?.data?.message || 'Error updating doctor status');
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="mb-4 text-2xl font-semibold text-gray-800">Manage Doctors</h3>
      {doctors.length === 0 ? (
        <p className="text-gray-500">No doctors found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-4 font-semibold">Name</th>
                <th className="p-4 font-semibold">Specialization</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((doctor) => (
                <tr key={doctor._id} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    {doctor.userId?.firstName
                      ? `${doctor.userId.firstName} ${doctor.userId.lastName || ''}`
                      : 'N/A'}
                  </td>
                  <td className="p-4">{doctor.specialization || 'N/A'}</td>
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

export default AdminDoctors;