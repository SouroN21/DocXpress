import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const AddMedicalData = () => {
  const [activeSection, setActiveSection] = useState('medications'); // Default to medications
  const [newData, setNewData] = useState({
    medications: { name: '', dosage: '', frequency: '', startDate: '', endDate: '', prescribedBy: '', notes: '' },
    allergies: { allergen: '', reaction: '', severity: 'mild', diagnosedDate: '', notes: '' },
    surgeries: { name: '', date: '', hospital: '', surgeon: '', outcome: 'successful', notes: '' },
    familyHistory: { relation: 'parent', condition: '', notes: '' },
    vitalSigns: { date: '', bloodPressure: '', heartRate: '', temperature: '', weight: '', height: '', recordedBy: '' },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  // Redirect to login if no token
  if (!token) {
    navigate('/login');
    return null;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewData((prev) => ({
      ...prev,
      [activeSection]: { ...prev[activeSection], [name]: value },
    }));
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const dataToSubmit = { [activeSection]: [newData[activeSection]] };
      await axios.post('http://localhost:5000/medical-history/create', dataToSubmit, config);
      alert(`${activeSection.charAt(0).toUpperCase() + activeSection.slice(1)} added successfully!`);
      navigate('/medical-history'); // Redirect to MedicalHistory page
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add medical data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="container max-w-5xl px-6 mx-auto">
        <div className="p-8 bg-white shadow-xl rounded-xl">
          <h1 className="mb-8 text-4xl font-bold text-center text-indigo-700">Add Medical Data</h1>

          <div className="mb-6 text-center">
            <Link
              to="/medical-history"
              className="px-6 py-3 text-white bg-blue-500 rounded-lg shadow hover:bg-blue-600"
            >
              Back to Medical History
            </Link>
          </div>

          {error && (
            <div className="p-4 mb-6 text-red-700 bg-red-100 border-l-4 border-red-500 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-6 bg-gray-100 rounded-lg shadow-md">
            <h2 className="mb-4 text-2xl font-semibold text-gray-800">Add New Medical Data</h2>

            {/* Section Tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
              {['medications', 'allergies', 'surgeries', 'familyHistory', 'vitalSigns'].map((section) => (
                <button
                  key={section}
                  type="button"
                  onClick={() => handleSectionChange(section)}
                  className={`px-4 py-2 rounded-full text-sm font-medium shadow ${
                    activeSection === section ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                  disabled={loading}
                >
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </button>
              ))}
            </div>

            {/* Form Fields Based on Active Section */}
            {activeSection === 'medications' && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={newData.medications.name}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g., Ibuprofen"
                    required
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Dosage</label>
                  <input
                    type="text"
                    name="dosage"
                    value={newData.medications.dosage}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g., 200 mg"
                    required
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Frequency</label>
                  <input
                    type="text"
                    name="frequency"
                    value={newData.medications.frequency}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g., Twice daily"
                    required
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={newData.medications.startDate}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                    required
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">End Date</label>
                  <input
                    type="date"
                    name="endDate"
                    value={newData.medications.endDate}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                    disabled={loading}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block mb-1 text-sm font-medium text-gray-700">Notes</label>
                  <textarea
                    name="notes"
                    value={newData.medications.notes}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder="Additional notes (optional)"
                    disabled={loading}
                  />
                </div>
              </div>
            )}

            {activeSection === 'allergies' && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Allergen</label>
                  <input
                    type="text"
                    name="allergen"
                    value={newData.allergies.allergen}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g., Penicillin"
                    required
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Reaction</label>
                  <input
                    type="text"
                    name="reaction"
                    value={newData.allergies.reaction}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g., Rash"
                    required
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Severity</label>
                  <select
                    name="severity"
                    value={newData.allergies.severity}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                    disabled={loading}
                  >
                    <option value="mild">Mild</option>
                    <option value="moderate">Moderate</option>
                    <option value="severe">Severe</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Diagnosed Date</label>
                  <input
                    type="date"
                    name="diagnosedDate"
                    value={newData.allergies.diagnosedDate}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                    disabled={loading}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block mb-1 text-sm font-medium text-gray-700">Notes</label>
                  <textarea
                    name="notes"
                    value={newData.allergies.notes}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder="Additional notes (optional)"
                    disabled={loading}
                  />
                </div>
              </div>
            )}

            {activeSection === 'surgeries' && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Surgery Name</label>
                  <input
                    type="text"
                    name="name"
                    value={newData.surgeries.name}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g., Appendectomy"
                    required
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={newData.surgeries.date}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                    required
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Hospital</label>
                  <input
                    type="text"
                    name="hospital"
                    value={newData.surgeries.hospital}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g., General Hospital"
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Outcome</label>
                  <select
                    name="outcome"
                    value={newData.surgeries.outcome}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                    disabled={loading}
                  >
                    <option value="successful">Successful</option>
                    <option value="complications">Complications</option>
                    <option value="ongoing">Ongoing</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block mb-1 text-sm font-medium text-gray-700">Notes</label>
                  <textarea
                    name="notes"
                    value={newData.surgeries.notes}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder="Additional notes (optional)"
                    disabled={loading}
                  />
                </div>
              </div>
            )}

            {activeSection === 'familyHistory' && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Relation</label>
                  <select
                    name="relation"
                    value={newData.familyHistory.relation}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                    disabled={loading}
                  >
                    <option value="parent">Parent</option>
                    <option value="sibling">Sibling</option>
                    <option value="grandparent">Grandparent</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Condition</label>
                  <input
                    type="text"
                    name="condition"
                    value={newData.familyHistory.condition}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g., Heart Disease"
                    required
                    disabled={loading}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block mb-1 text-sm font-medium text-gray-700">Notes</label>
                  <textarea
                    name="notes"
                    value={newData.familyHistory.notes}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder="Additional notes (optional)"
                    disabled={loading}
                  />
                </div>
              </div>
            )}

            {activeSection === 'vitalSigns' && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={newData.vitalSigns.date}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                    required
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Blood Pressure</label>
                  <input
                    type="text"
                    name="bloodPressure"
                    value={newData.vitalSigns.bloodPressure}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g., 120/80 mmHg"
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Heart Rate</label>
                  <input
                    type="number"
                    name="heartRate"
                    value={newData.vitalSigns.heartRate}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g., 72 bpm"
                    min="0"
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Temperature</label>
                  <input
                    type="number"
                    name="temperature"
                    value={newData.vitalSigns.temperature}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g., 98.6 F"
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Weight</label>
                  <input
                    type="number"
                    name="weight"
                    value={newData.vitalSigns.weight}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g., 70 kg"
                    min="0"
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Height</label>
                  <input
                    type="number"
                    name="height"
                    value={newData.vitalSigns.height}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g., 170 cm"
                    min="0"
                    disabled={loading}
                  />
                </div>
              </div>
            )}

            {/* Submit/Cancel Buttons */}
            <div className="flex gap-4 mt-6">
              <button
                type="submit"
                className="flex-1 py-3 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
                disabled={loading}
              >
                {loading ? 'Adding...' : `Add ${activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}`}
              </button>
              <button
                type="button"
                onClick={() => navigate('/medical-history')}
                className="flex-1 py-3 bg-gray-300 rounded-lg hover:bg-gray-400"
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddMedicalData;