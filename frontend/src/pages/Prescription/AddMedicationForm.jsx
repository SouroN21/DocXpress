import React, { useState } from 'react';

const AddMedicationForm = ({ newData = {}, handleInputChange, handleAddMedication, loading, setAdding }) => {
  const [activeSection, setActiveSection] = useState('medications'); // Default to medications

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  const handleDataChange = (e) => {
    handleInputChange(e, activeSection); // Pass activeSection to parent
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSubmit = { [activeSection]: [newData[activeSection] || {}] };
    handleAddMedication(e, dataToSubmit); // Pass the specific section data
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 mb-8 bg-gray-100 rounded-lg shadow-md">
      <h2 className="mb-4 text-2xl font-semibold text-gray-800">Add New Medical Data</h2>

      {/* Section Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['medications', 'conditions', 'allergies', 'surgeries', 'familyHistory', 'vitalSigns'].map((section) => (
          <button
            key={section}
            type="button"
            onClick={() => handleSectionChange(section)}
            className={`px-4 py-2 rounded-full text-sm font-medium shadow ${
              activeSection === section ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
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
              value={newData.medications?.name || ''}
              onChange={handleDataChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g., Ibuprofen"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Dosage</label>
            <input
              type="text"
              name="dosage"
              value={newData.medications?.dosage || ''}
              onChange={handleDataChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g., 200 mg"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Frequency</label>
            <input
              type="text"
              name="frequency"
              value={newData.medications?.frequency || ''}
              onChange={handleDataChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g., Twice daily"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={newData.medications?.startDate || ''}
              onChange={handleDataChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block mb-1 text-sm font-medium text-gray-700">Notes</label>
            <textarea
              name="notes"
              value={newData.medications?.notes || ''}
              onChange={handleDataChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="Additional notes (optional)"
            />
          </div>
        </div>
      )}

      {activeSection === 'conditions' && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Condition Name</label>
            <input
              type="text"
              name="name"
              value={newData.conditions?.name || ''}
              onChange={handleDataChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g., Diabetes"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Diagnosed Date</label>
            <input
              type="date"
              name="diagnosedDate"
              value={newData.conditions?.diagnosedDate || ''}
              onChange={handleDataChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Status</label>
            <select
              name="status"
              value={newData.conditions?.status || 'active'}
              onChange={handleDataChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="active">Active</option>
              <option value="resolved">Resolved</option>
              <option value="chronic">Chronic</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="block mb-1 text-sm font-medium text-gray-700">Notes</label>
            <textarea
              name="notes"
              value={newData.conditions?.notes || ''}
              onChange={handleDataChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="Additional notes (optional)"
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
              value={newData.allergies?.allergen || ''}
              onChange={handleDataChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g., Penicillin"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Reaction</label>
            <input
              type="text"
              name="reaction"
              value={newData.allergies?.reaction || ''}
              onChange={handleDataChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g., Rash"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Severity</label>
            <select
              name="severity"
              value={newData.allergies?.severity || 'mild'}
              onChange={handleDataChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
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
              value={newData.allergies?.diagnosedDate || ''}
              onChange={handleDataChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block mb-1 text-sm font-medium text-gray-700">Notes</label>
            <textarea
              name="notes"
              value={newData.allergies?.notes || ''}
              onChange={handleDataChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="Additional notes (optional)"
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
              value={newData.surgeries?.name || ''}
              onChange={handleDataChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g., Appendectomy"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              name="date"
              value={newData.surgeries?.date || ''}
              onChange={handleDataChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Hospital</label>
            <input
              type="text"
              name="hospital"
              value={newData.surgeries?.hospital || ''}
              onChange={handleDataChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g., General Hospital"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Outcome</label>
            <select
              name="outcome"
              value={newData.surgeries?.outcome || 'successful'}
              onChange={handleDataChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
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
              value={newData.surgeries?.notes || ''}
              onChange={handleDataChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="Additional notes (optional)"
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
              value={newData.familyHistory?.relation || 'parent'}
              onChange={handleDataChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
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
              value={newData.familyHistory?.condition || ''}
              onChange={handleDataChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g., Heart Disease"
              required
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block mb-1 text-sm font-medium text-gray-700">Notes</label>
            <textarea
              name="notes"
              value={newData.familyHistory?.notes || ''}
              onChange={handleDataChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="Additional notes (optional)"
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
              value={newData.vitalSigns?.date || ''}
              onChange={handleDataChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Blood Pressure</label>
            <input
              type="text"
              name="bloodPressure"
              value={newData.vitalSigns?.bloodPressure || ''}
              onChange={handleDataChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g., 120/80 mmHg"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Heart Rate</label>
            <input
              type="number"
              name="heartRate"
              value={newData.vitalSigns?.heartRate || ''}
              onChange={handleDataChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g., 72 bpm"
              min="0"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Temperature</label>
            <input
              type="number"
              name="temperature"
              value={newData.vitalSigns?.temperature || ''}
              onChange={handleDataChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g., 98.6 F"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Weight</label>
            <input
              type="number"
              name="weight"
              value={newData.vitalSigns?.weight || ''}
              onChange={handleDataChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g., 70 kg"
              min="0"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Height</label>
            <input
              type="number"
              name="height"
              value={newData.vitalSigns?.height || ''}
              onChange={handleDataChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g., 170 cm"
              min="0"
            />
          </div>
        </div>
      )}

      {/* Submit/Cancel Buttons */}
      <div className="flex gap-4 mt-4">
        <button
          type="submit"
          className="flex-1 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
          disabled={loading}
        >
          {loading ? 'Adding...' : `Add ${activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}`}
        </button>
        <button
          type="button"
          onClick={() => setAdding(false)}
          className="flex-1 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
          disabled={loading}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AddMedicationForm;