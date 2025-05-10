import React from 'react';
import axios from 'axios';

const Profile = ({
  doctorProfile,
  editMode,
  setEditMode,
  formData,
  handleEditChange,
  handleProfileUpdate,
  loading,
  onProfileDelete, // New prop to handle deletion in parent
}) => {
  const token = localStorage.getItem('token');

  const handleDeleteProfile = async () => {
    if (!window.confirm('Are you sure you want to delete your doctor profile? This action cannot be undone.')) return;
    try {
      await axios.delete(`http://localhost:5000/doctor/${doctorProfile._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Doctor profile deleted successfully');
      onProfileDelete(); // Notify parent to handle post-deletion logic (e.g., redirect)
    } catch (error) {
      alert(error.response?.data?.message || 'Error deleting doctor profile');
    }
  };

  return (
    <section className="max-w-3xl p-8 mx-auto bg-white shadow-lg rounded-2xl">
      <h3 className="mb-6 text-3xl font-bold text-center text-gray-800">My Profile</h3>

      {doctorProfile ? (
        editMode ? (
          <form onSubmit={handleProfileUpdate} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {['firstName', 'lastName', 'email', 'specialization', 'phoneNumber'].map((field) => (
                <div key={field} className={field === 'phoneNumber' ? 'sm:col-span-2' : ''}>
                  <label className="block mb-1 text-sm font-medium text-gray-700 capitalize">
                    {field.replace(/([A-Z])/g, ' $1')}
                  </label>
                  <input
                    type={field === 'email' ? 'email' : 'text'}
                    name={field}
                    value={formData[field]}
                    onChange={handleEditChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-center space-x-4">
              <button
                type="submit"
                className={`px-6 py-3 text-white rounded-lg shadow transition-all duration-200 ${
                  loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => setEditMode(false)}
                className="px-6 py-3 text-gray-700 transition-all duration-200 bg-gray-200 rounded-lg shadow hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="flex flex-col items-center space-y-6 text-center">
            <div className="relative">
              <img
                src={doctorProfile.image || 'https://via.placeholder.com/150'}
                alt="Profile"
                className="object-cover w-40 h-40 border-4 border-indigo-500 rounded-full shadow-md"
              />
            </div>
            <div className="w-full space-y-4 text-left">
              {[
                ['Name', `${doctorProfile.userId.firstName} ${doctorProfile.userId.lastName}`],
                ['Email', doctorProfile.userId.email],
                ['Specialization', doctorProfile.specialization],
                ['Phone Number', doctorProfile.userId.phoneNumber || 'Not provided'],
              ].map(([label, value]) => (
                <p key={label}>
                  <span className="font-medium text-gray-700">{label}:</span> {value}
                </p>
              ))}
            </div>
            {/** 
            <div className="flex space-x-4">
              <button
                onClick={() => setEditMode(true)}
                className="px-6 py-3 mt-4 text-white transition-all duration-200 bg-indigo-600 rounded-lg shadow hover:bg-indigo-700"
              >
                Edit Profile
              </button>
              <button
                onClick={handleDeleteProfile}
                className="px-6 py-3 mt-4 text-white transition-all duration-200 bg-red-600 rounded-lg shadow hover:bg-red-700"
              >
                Delete Profile
              </button>
            </div>*/}
          </div>
        )
      ) : (
        <p className="text-center text-gray-500">No profile found. Please add your profile.</p>
      )}
    </section>
  );
};

export default Profile;