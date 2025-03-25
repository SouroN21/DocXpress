import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PrescriptionDetail = () => {
  const { id } = useParams(); // Get prescription ID from URL
  const navigate = useNavigate();
  const [prescription, setPrescription] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [medicines, setMedicines] = useState([]);
  const [finalNotes, setFinalNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch prescription details
  useEffect(() => {
    const fetchPrescription = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get(`http://localhost:5000/prescriptions/${id}`, config);
        const data = response.data.prescription || response.data; // Adjust based on backend response
        setPrescription(data);
        setMedicines(data.medicines);
        setFinalNotes(data.finalNotes || '');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch prescription.');
      } finally {
        setLoading(false);
      }
    };
    fetchPrescription();
  }, [id]);

  const handleInputChange = (index, e) => {
    const { name, value } = e.target;
    const updatedMedicines = [...medicines];
    updatedMedicines[index] = { ...updatedMedicines[index], [name]: value };
    setMedicines(updatedMedicines);
  };

  const addMedicine = () => {
    setMedicines([...medicines, { medicineName: '', dosage: '', frequency: '', duration: '', notes: '' }]);
  };

  const removeMedicine = (index) => {
    if (medicines.length > 1) {
      setMedicines(medicines.filter((_, i) => i !== index));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const updatedData = { medicines, finalNotes };
      await axios.put(`http://localhost:5000/prescriptions/${id}`, updatedData, config);
      setPrescription({ ...prescription, medicines, finalNotes });
      setEditMode(false);
      alert('Prescription updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update prescription.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this prescription?')) return;
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`http://localhost:5000/prescriptions/${id}`, config);
      alert('Prescription deleted successfully!');
      navigate('/doctor-dashboard'); // Redirect after deletion
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete prescription.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center text-gray-500">Loading prescription...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!prescription) return <p className="text-center text-gray-500">Prescription not found.</p>;

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="container max-w-4xl px-6 mx-auto">
        <div className="p-8 bg-white shadow-xl rounded-xl">
          <h1 className="mb-8 text-3xl font-bold text-center text-indigo-700">Prescription Details</h1>

          {editMode ? (
            <form onSubmit={handleUpdate} className="space-y-6">
              {medicines.map((medicine, index) => (
                <div key={index} className="relative p-4 space-y-4 rounded-lg bg-gray-50">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700">Medicine Name</label>
                      <input
                        type="text"
                        name="medicineName"
                        value={medicine.medicineName}
                        onChange={(e) => handleInputChange(index, e)}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700">Dosage</label>
                      <input
                        type="text"
                        name="dosage"
                        value={medicine.dosage}
                        onChange={(e) => handleInputChange(index, e)}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700">Frequency</label>
                      <input
                        type="text"
                        name="frequency"
                        value={medicine.frequency}
                        onChange={(e) => handleInputChange(index, e)}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700">Duration</label>
                      <input
                        type="text"
                        name="duration"
                        value={medicine.duration}
                        onChange={(e) => handleInputChange(index, e)}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block mb-1 text-sm font-medium text-gray-700">Notes</label>
                      <textarea
                        name="notes"
                        value={medicine.notes}
                        onChange={(e) => handleInputChange(index, e)}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                  {medicines.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMedicine(index)}
                      className="absolute text-red-600 top-2 right-2 hover:text-red-800"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addMedicine}
                className="w-full py-2 text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50"
              >
                Add Another Medicine
              </button>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Final Notes</label>
                <textarea
                  value={finalNotes}
                  onChange={(e) => setFinalNotes(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              {error && (
                <div className="p-3 text-center text-red-700 bg-red-100 border-l-4 border-red-500 rounded-lg">
                  {error}
                </div>
              )}
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 py-3 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => setEditMode(false)}
                  className="flex-1 py-3 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="p-4 bg-gray-100 rounded-lg">
                <h2 className="mb-4 text-xl font-semibold text-gray-800">Prescription</h2>
                {prescription.medicines.map((med, index) => (
                  <div key={index} className="mb-2">
                    <p>
                      <span className="font-semibold">Medicine {index + 1}:</span> {med.medicineName} - {med.dosage},{' '}
                      {med.frequency}, {med.duration}
                      {med.notes && <span> (Notes: {med.notes})</span>}
                    </p>
                  </div>
                ))}
                {prescription.finalNotes && (
                  <p><span className="font-semibold">Final Notes:</span> {prescription.finalNotes}</p>
                )}
                <p><span className="font-semibold">Issued At:</span> {new Date(prescription.issuedAt).toLocaleString()}</p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => setEditMode(true)}
                  className="flex-1 py-3 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
                >
                  Edit Prescription
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 py-3 text-white bg-red-600 rounded-lg hover:bg-red-700"
                  disabled={loading}
                >
                  {loading ? 'Deleting...' : 'Delete Prescription'}
                </button>
                <button
                  onClick={() => navigate('/doctor-dashboard')}
                  className="flex-1 py-3 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrescriptionDetail;