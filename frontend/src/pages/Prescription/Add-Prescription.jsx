import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddPrescription = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const appointment = state?.appointment;
  const patient = appointment?.patientId;

  const [medicines, setMedicines] = useState([
    { medicineName: '', dosage: '', frequency: '', duration: '', notes: '' },
  ]);
  const [finalNotes, setFinalNotes] = useState('');
  const [medicalHistory, setMedicalHistory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [error, setError] = useState('');
  const [historyError, setHistoryError] = useState('');

  // Fetch medical history on mount
  useEffect(() => {
    const fetchMedicalHistory = async () => {
      if (!patient?._id) {
        setHistoryError('No patient ID provided.');
        setHistoryLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get(
          `http://localhost:5000/medical-history/${patient._id}`,
          config
        );
        setMedicalHistory(response.data);
      } catch (err) {
        setHistoryError(err.response?.data?.message || 'Failed to fetch medical history.');
      } finally {
        setHistoryLoading(false);
      }
    };
    fetchMedicalHistory();
  }, [patient?._id]);

  // Early return for missing appointment or patient data
  if (!appointment || !patient) {
    return (
      <div className="max-w-md p-6 mx-auto mt-16 text-center text-red-700 bg-red-100 border-l-4 border-red-500 rounded-lg">
        No appointment data provided. Please go back and select an appointment.
      </div>
    );
  }

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const prescriptionData = {
        userId: patient._id, // Changed to userId to match schema
        appointmentId: appointment._id,
        medicines: medicines.map((med) => ({
          medicineName: med.medicineName,
          dosage: med.dosage,
          frequency: med.frequency,
          duration: med.duration,
          notes: med.notes,
        })),
        finalNotes,
      };

      await axios.post('http://localhost:5000/prescriptions/create', prescriptionData, config);
      alert('Prescription created successfully!');
      navigate('/doctor-dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create prescription.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="container max-w-5xl px-6 mx-auto">
        <div className="p-8 bg-white shadow-xl rounded-xl">
          <h1 className="mb-8 text-3xl font-bold text-center text-indigo-700">Add Prescription</h1>

          {/* Two-column layout */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Left Side: Patient Details and Medical History */}
            <div className="space-y-6">
              {/* Patient Details */}
              <div className="p-4 bg-gray-100 rounded-lg">
                <h2 className="mb-4 text-xl font-semibold text-gray-800">Patient Details</h2>
                <div className="space-y-2 text-gray-700">
                  <p>
                    <span className="font-semibold">Name:</span> {patient.firstName} {patient.lastName}
                  </p>
                  <p>
                    <span className="font-semibold">Email:</span> {patient.email || 'Not provided'}
                  </p>
                  <p>
                    <span className="font-semibold">Appointment Date:</span>{' '}
                    {new Date(appointment.dateTime).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Medical History */}
              <div className="p-4 bg-gray-100 rounded-lg">
                <h2 className="mb-4 text-xl font-semibold text-gray-800">Medical History</h2>
                {historyLoading ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-indigo-500 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      ></path>
                    </svg>
                    <span className="ml-2 text-gray-600">Loading...</span>
                  </div>
                ) : historyError ? (
                  <p className="text-red-700">{historyError}</p>
                ) : !medicalHistory ? (
                  <p className="text-gray-600">No medical history available.</p>
                ) : (
                  <div className="space-y-4 text-gray-700">
                    {medicalHistory.medications?.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-gray-800">Medications</h3>
                        <ul className="list-disc list-inside">
                          {medicalHistory.medications.map((med, index) => (
                            <li key={index}>
                              {med.name} - {med.dosage}, {med.frequency} (Started:{' '}
                              {new Date(med.startDate).toLocaleDateString()})
                              {med.notes && <span> - {med.notes}</span>}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {medicalHistory.allergies?.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-gray-800">Allergies</h3>
                        <ul className="list-disc list-inside">
                          {medicalHistory.allergies.map((allergy, index) => (
                            <li key={index}>
                              {allergy.allergen} - {allergy.reaction} (Severity: {allergy.severity})
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {medicalHistory.surgeries?.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-gray-800">Surgeries</h3>
                        <ul className="list-disc list-inside">
                          {medicalHistory.surgeries.map((surgery, index) => (
                            <li key={index}>
                              {surgery.name} - {new Date(surgery.date).toLocaleDateString()} (Outcome:{' '}
                              {surgery.outcome})
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {medicalHistory.familyHistory?.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-gray-800">Family History</h3>
                        <ul className="list-disc list-inside">
                          {medicalHistory.familyHistory.map((family, index) => (
                            <li key={index}>
                              {family.relation} - {family.condition}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {medicalHistory.vitalSigns?.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-gray-800">Vital Signs</h3>
                        <ul className="list-disc list-inside">
                          {medicalHistory.vitalSigns.map((vital, index) => (
                            <li key={index}>
                              {new Date(vital.date).toLocaleDateString()} - BP: {vital.bloodPressure || 'N/A'},
                              HR: {vital.heartRate || 'N/A'} bpm
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right Side: Prescription Form */}
            <div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <h2 className="mb-4 text-xl font-semibold text-gray-800">Prescription Details</h2>

                {/* Medicines List */}
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
                          placeholder="e.g., Ibuprofen"
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
                          placeholder="e.g., 200 mg"
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
                          placeholder="e.g., Twice daily"
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
                          placeholder="e.g., 7 days"
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
                          placeholder="Additional instructions (optional)"
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
                    placeholder="Overall instructions (optional)"
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
                    {loading ? 'Saving...' : 'Save Prescription'}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/doctor-dashboard')}
                    className="flex-1 py-3 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPrescription;