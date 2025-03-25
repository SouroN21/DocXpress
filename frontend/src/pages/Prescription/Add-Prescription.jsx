// components/AddPrescription.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddPrescription = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const appointment = state?.appointment;
  const patient = appointment?.patientId;

  const [prescription, setPrescription] = useState({
    medication: '',
    dosage: '',
    frequency: '',
    duration: '',
    notes: '',
  });
  const [medicalHistory, setMedicalHistory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [error, setError] = useState('');
  const [historyError, setHistoryError] = useState('');

  // Fetch medical history on mount (moved to top)
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
  }, [patient?._id]); // Dependency on patient._id

  // Early return for missing appointment or patient data (after hooks)
  if (!appointment || !patient) {
    return (
      <div className="max-w-md p-6 mx-auto mt-16 text-center text-red-700 bg-red-100 border-l-4 border-red-500 rounded-lg">
        No appointment data provided. Please go back and select an appointment.
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPrescription((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const prescriptionData = {
        patientId: patient._id,
        appointmentId: appointment._id,
        medication: prescription.medication,
        dosage: prescription.dosage,
        frequency: prescription.frequency,
        duration: prescription.duration,
        notes: prescription.notes,
      };

      await axios.post('http://localhost:5000/prescriptions/create', prescriptionData, config);
      alert('Prescription created successfully!');
      navigate('/appointments');
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
                    {/* Medications */}
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

                    {/* Allergies */}
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

                    {/* Surgeries */}
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

                    {/* Family History */}
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

                    {/* Vital Signs */}
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
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Medication</label>
                    <input
                      type="text"
                      name="medication"
                      value={prescription.medication}
                      onChange={handleInputChange}
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
                      value={prescription.dosage}
                      onChange={handleInputChange}
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
                      value={prescription.frequency}
                      onChange={handleInputChange}
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
                      value={prescription.duration}
                      onChange={handleInputChange}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., 7 days"
                      required
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block mb-1 text-sm font-medium text-gray-700">Notes</label>
                    <textarea
                      name="notes"
                      value={prescription.notes}
                      onChange={handleInputChange}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                      placeholder="Additional instructions (optional)"
                    />
                  </div>
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