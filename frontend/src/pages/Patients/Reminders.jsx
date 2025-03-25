import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Reminders = () => {
  const [reminders, setReminders] = useState([]);
  const [formData, setFormData] = useState({
    medicineName: '',
    dosage: '',
    timesPerDay: 1,
    startDate: '',
    endDate: '',
    reminderTimes: [''],
    notes: '',
  });
  const [editReminderId, setEditReminderId] = useState(null);
  const [editFormData, setEditFormData] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  // Fetch profile and reminders on mount
  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        if (decodedToken.role !== 'patient') {
          setError('Access restricted to patients only.');
          setTimeout(() => navigate('/'), 2000);
          return;
        }

        const currentTime = Math.floor(Date.now() / 1000);
        if (decodedToken.exp < currentTime) {
          setError('Session expired. Please log in again.');
          localStorage.removeItem('token');
          setTimeout(() => navigate('/login'), 2000);
          return;
        }

        const patientId = decodedToken.id;
        const config = { headers: { Authorization: `Bearer ${token.trim()}` } };

        const [profileResponse, reminderResponse] = await Promise.all([
          axios.get(`http://localhost:5000/user/${patientId}`, config),
          axios.get(`http://localhost:5000/reminder/reminders`, config),
        ]);

        setProfile(profileResponse.data);
        setReminders(reminderResponse.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, navigate]);

  // Handle form input changes for new reminder
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle reminder time changes for new reminder
  const handleTimeChange = (index, value) => {
    const newTimes = [...formData.reminderTimes];
    newTimes[index] = value;
    setFormData((prev) => ({ ...prev, reminderTimes: newTimes }));
  };

  // Add a new time input for new reminder
  const addTimeInput = () => {
    if (formData.reminderTimes.length < formData.timesPerDay) {
      setFormData((prev) => ({
        ...prev,
        reminderTimes: [...prev.reminderTimes, ''],
      }));
    }
  };

  // Remove a time input for new reminder
  const removeTimeInput = (index) => {
    const newTimes = formData.reminderTimes.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, reminderTimes: newTimes }));
  };

  // Submit new reminder
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!profile?.email) {
      setError('Please add an email to your profile for reminders.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const reminderData = {
        medicines: [
          {
            medicineName: formData.medicineName,
            dosage: formData.dosage,
            timesPerDay: parseInt(formData.timesPerDay, 10),
            startDate: formData.startDate,
            endDate: formData.endDate,
            reminderTimes: formData.reminderTimes.map((time) =>
              new Date(`1970-01-01T${time}`).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              })
            ),
            notes: formData.notes,
          },
        ],
      };

      const response = await axios.post(
        'http://localhost:5000/reminder/reminders',
        reminderData,
        { headers: { Authorization: `Bearer ${token.trim()}` } }
      );

      setReminders([...reminders, response.data]);
      setFormData({
        medicineName: '',
        dosage: '',
        timesPerDay: 1,
        startDate: '',
        endDate: '',
        reminderTimes: [''],
        notes: '',
      });
      alert('Reminder added successfully! You’ll receive email notifications.');
    } catch (err) {
      setError(err.response?.data?.message || 'Error adding reminder');
    } finally {
      setLoading(false);
    }
  };

  // Handle edit form changes
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle edit reminder time changes
  const handleEditTimeChange = (index, value) => {
    const newTimes = [...editFormData.reminderTimes];
    newTimes[index] = value;
    setEditFormData((prev) => ({ ...prev, reminderTimes: newTimes }));
  };

  // Add a new time input for edit form
  const addEditTimeInput = () => {
    if (editFormData.reminderTimes.length < editFormData.timesPerDay) {
      setEditFormData((prev) => ({
        ...prev,
        reminderTimes: [...prev.reminderTimes, ''],
      }));
    }
  };

  // Remove a time input for edit form
  const removeEditTimeInput = (index) => {
    const newTimes = editFormData.reminderTimes.filter((_, i) => i !== index);
    setEditFormData((prev) => ({ ...prev, reminderTimes: newTimes }));
  };

  // Start editing a reminder
  const startEditing = (reminder) => {
    const medicine = reminder.medicines[0]; // Assuming one medicine per reminder for simplicity
    setEditReminderId(reminder._id);
    setEditFormData({
      medicineName: medicine.medicineName,
      dosage: medicine.dosage,
      timesPerDay: medicine.timesPerDay,
      startDate: medicine.startDate.split('T')[0], // Convert to YYYY-MM-DD
      endDate: medicine.endDate.split('T')[0],
      reminderTimes: medicine.reminderTimes,
      notes: medicine.notes || '',
    });
  };

  // Submit updated reminder
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const reminderData = {
        medicines: [
          {
            medicineName: editFormData.medicineName,
            dosage: editFormData.dosage,
            timesPerDay: parseInt(editFormData.timesPerDay, 10),
            startDate: editFormData.startDate,
            endDate: editFormData.endDate,
            reminderTimes: editFormData.reminderTimes.map((time) =>
              new Date(`1970-01-01T${time}`).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              })
            ),
            notes: editFormData.notes,
          },
        ],
      };

      const response = await axios.put(
        `http://localhost:5000/reminder/reminders/${editReminderId}`,
        reminderData,
        { headers: { Authorization: `Bearer ${token.trim()}` } }
      );

      setReminders(
        reminders.map((r) => (r._id === editReminderId ? response.data.reminder : r))
      );
      setEditReminderId(null);
      setEditFormData(null);
      alert('Reminder updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating reminder');
    } finally {
      setLoading(false);
    }
  };

  // Delete a reminder
  const handleDelete = async (reminderId) => {
    if (!window.confirm('Are you sure you want to delete this reminder?')) return;

    setLoading(true);
    setError('');

    try {
      await axios.delete(`http://localhost:5000/reminder/reminders/${reminderId}`, {
        headers: { Authorization: `Bearer ${token.trim()}` },
      });

      setReminders(reminders.filter((r) => r._id !== reminderId));
      alert('Reminder deleted successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Error deleting reminder');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <svg className="w-8 h-8 text-blue-500 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
        </svg>
        <span className="ml-3 text-lg text-gray-600">Loading reminders...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md p-6 mx-auto mt-16 text-center text-red-700 bg-red-100 border-l-4 border-red-500 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="container max-w-5xl px-6 mx-auto">
        <div className="p-8 bg-white shadow-xl rounded-2xl">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-extrabold text-gray-800 md:text-4xl">
              Medicine Reminders
            </h1>
            <button
              onClick={() => navigate('/profile')}
              className="px-4 py-2 text-sm font-medium text-white transition-all bg-blue-600 rounded-full hover:bg-blue-700"
            >
              Back to Profile
            </button>
          </div>

          {/* Reminder Form */}
          <div className="mb-10">
            <h2 className="mb-4 text-2xl font-semibold text-gray-800">Add a New Reminder</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Medicine Name</label>
                  <input
                    type="text"
                    name="medicineName"
                    value={formData.medicineName}
                    onChange={handleChange}
                    placeholder="e.g., Ibuprofen"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Dosage</label>
                  <input
                    type="text"
                    name="dosage"
                    value={formData.dosage}
                    onChange={handleChange}
                    placeholder="e.g., 200mg"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Times Per Day</label>
                  <input
                    type="number"
                    name="timesPerDay"
                    value={formData.timesPerDay}
                    onChange={handleChange}
                    min="1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">End Date</label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Reminder Times</label>
                {formData.reminderTimes.map((time, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <input
                      type="time"
                      value={time}
                      onChange={(e) => handleTimeChange(index, e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      required
                    />
                    {formData.reminderTimes.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTimeInput(index)}
                        className="ml-2 text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                {formData.reminderTimes.length < formData.timesPerDay && (
                  <button
                    type="button"
                    onClick={addTimeInput}
                    className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                  >
                    + Add Another Time
                  </button>
                )}
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="e.g., Take with food"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="px-8 py-3 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
                disabled={loading}
              >
                {loading ? 'Adding...' : 'Add Reminder'}
              </button>
            </form>
          </div>

          {/* Reminder List */}
          <div>
            <h2 className="mb-6 text-2xl font-semibold text-gray-800">Your Reminders</h2>
            {reminders.length === 0 ? (
              <p className="py-6 text-lg text-center text-gray-600">No reminders set yet.</p>
            ) : (
              <div className="space-y-4">
                {reminders.map((reminder) =>
                  reminder.medicines.map((medicine, index) => (
                    <div
                      key={`${reminder._id}-${index}`}
                      className="p-4 border border-gray-200 rounded-lg bg-gray-50"
                    >
                      {editReminderId === reminder._id ? (
                        <form onSubmit={handleUpdate} className="space-y-4">
                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                              <label className="block mb-1 text-sm font-medium text-gray-700">Medicine Name</label>
                              <input
                                type="text"
                                name="medicineName"
                                value={editFormData.medicineName}
                                onChange={handleEditChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                required
                              />
                            </div>
                            <div>
                              <label className="block mb-1 text-sm font-medium text-gray-700">Dosage</label>
                              <input
                                type="text"
                                name="dosage"
                                value={editFormData.dosage}
                                onChange={handleEditChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                required
                              />
                            </div>
                            <div>
                              <label className="block mb-1 text-sm font-medium text-gray-700">Times Per Day</label>
                              <input
                                type="number"
                                name="timesPerDay"
                                value={editFormData.timesPerDay}
                                onChange={handleEditChange}
                                min="1"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                required
                              />
                            </div>
                            <div>
                              <label className="block mb-1 text-sm font-medium text-gray-700">Start Date</label>
                              <input
                                type="date"
                                name="startDate"
                                value={editFormData.startDate}
                                onChange={handleEditChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                required
                              />
                            </div>
                            <div>
                              <label className="block mb-1 text-sm font-medium text-gray-700">End Date</label>
                              <input
                                type="date"
                                name="endDate"
                                value={editFormData.endDate}
                                onChange={handleEditChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                required
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">Reminder Times</label>
                            {editFormData.reminderTimes.map((time, index) => (
                              <div key={index} className="flex items-center mb-2">
                                <input
                                  type="time"
                                  value={time}
                                  onChange={(e) => handleEditTimeChange(index, e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                  required
                                />
                                {editFormData.reminderTimes.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => removeEditTimeInput(index)}
                                    className="ml-2 text-red-600 hover:text-red-800"
                                  >
                                    Remove
                                  </button>
                                )}
                              </div>
                            ))}
                            {editFormData.reminderTimes.length < editFormData.timesPerDay && (
                              <button
                                type="button"
                                onClick={addEditTimeInput}
                                className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                              >
                                + Add Another Time
                              </button>
                            )}
                          </div>
                          <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700">Notes</label>
                            <textarea
                              name="notes"
                              value={editFormData.notes}
                              onChange={handleEditChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div className="flex space-x-2">
                            <button
                              type="submit"
                              className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:bg-green-400"
                              disabled={loading}
                            >
                              {loading ? 'Saving...' : 'Save'}
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditReminderId(null)}
                              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-gray-800">
                              {medicine.medicineName} ({medicine.dosage}) - {medicine.reminderTimes.join(', ')}
                            </p>
                            <p className="text-sm text-gray-500">
                              {new Date(medicine.startDate).toLocaleDateString()} to{' '}
                              {new Date(medicine.endDate).toLocaleDateString()}
                            </p>
                            {medicine.notes && (
                              <p className="text-sm text-gray-600">Notes: {medicine.notes}</p>
                            )}
                          </div>
                          <div className="flex space-x-2">
  {/* Edit Button */}
  <button
    onClick={() => startEditing(reminder)}
    className="inline-flex items-center px-3 py-1.5 text-lg font-medium text-indigo-700 bg-indigo-100 rounded-lg hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
  >
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
    Edit
  </button>

  {/* Delete Button */}
  <button
    onClick={() => handleDelete(reminder._id)}
    className="inline-flex items-center px-3 py-1.5 text-lg font-medium text-red-700 bg-red-100 rounded-lg hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
  >
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
    Delete
  </button>
</div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reminders;