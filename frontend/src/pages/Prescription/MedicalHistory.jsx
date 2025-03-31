import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const MedicalHistory = () => {
  const [medicalHistory, setMedicalHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchMedicalHistory = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get('http://localhost:5000/medical-history/me', config);
        setMedicalHistory(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch medical history.');
      } finally {
        setLoading(false);
      }
    };
    fetchMedicalHistory();
  }, [token, navigate]);

  if (loading && !medicalHistory) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <svg className="w-8 h-8 text-indigo-500 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
        </svg>
        <span className="ml-3 text-lg text-gray-600">Loading medical history...</span>
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
        <div className="p-8 bg-white shadow-xl rounded-xl">
          <h1 className="mb-8 text-4xl font-bold text-center text-indigo-700">Medical History</h1>

          <div className="flex justify-center gap-4 mb-6">
            <Link to="/profile" className="px-6 py-3 text-white bg-blue-500 rounded-lg shadow hover:bg-blue-600">
              Back to Profile
            </Link>
            <Link
              to="/add-medical-data"
              className="px-6 py-3 text-white bg-green-500 rounded-lg shadow hover:bg-green-600"
            >
              Add Medical Data
            </Link>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="mb-4 text-2xl font-semibold text-gray-800">Medications</h2>
              {medicalHistory && medicalHistory.medications.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {medicalHistory.medications.map((med, index) => (
                    <div key={index} className="p-4 bg-gray-100 rounded-lg shadow">
                      <p><strong>Name:</strong> {med.name}</p>
                      <p><strong>Dosage:</strong> {med.dosage}</p>
                      <p><strong>Frequency:</strong> {med.frequency}</p>
                      <p><strong>Start Date:</strong> {new Date(med.startDate).toLocaleDateString()}</p>
                      {med.endDate && <p><strong>End Date:</strong> {new Date(med.endDate).toLocaleDateString()}</p>}
                      {med.prescribedBy && (
                        <p><strong>Prescribed By:</strong> Dr. {med.prescribedBy.firstName} {med.prescribedBy.lastName}</p>
                      )}
                      {med.notes && <p><strong>Notes:</strong> {med.notes}</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No data</p>
              )}
            </div>

            <div>
              <h2 className="mb-4 text-2xl font-semibold text-gray-800">Allergies</h2>
              {medicalHistory && medicalHistory.allergies.length > 0 ? (
                <ul className="list-disc list-inside">
                  {medicalHistory.allergies.map((allergy, index) => (
                    <li key={index}>
                      {allergy.allergen} - Reaction: {allergy.reaction} (Severity: {allergy.severity})
                      {allergy.diagnosedDate && (
                        <span> - Diagnosed: {new Date(allergy.diagnosedDate).toLocaleDateString()}</span>
                      )}
                      {allergy.notes && <span> - Notes: {allergy.notes}</span>}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600">No data</p>
              )}
            </div>

            <div>
              <h2 className="mb-4 text-2xl font-semibold text-gray-800">Surgeries</h2>
              {medicalHistory && medicalHistory.surgeries.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {medicalHistory.surgeries.map((surgery, index) => (
                    <div key={index} className="p-4 bg-gray-100 rounded-lg shadow">
                      <p><strong>Name:</strong> {surgery.name}</p>
                      <p><strong>Date:</strong> {new Date(surgery.date).toLocaleDateString()}</p>
                      {surgery.hospital && <p><strong>Hospital:</strong> {surgery.hospital}</p>}
                      {surgery.surgeon && (
                        <p><strong>Surgeon:</strong> Dr. {surgery.surgeon.firstName} {surgery.surgeon.lastName}</p>
                      )}
                      <p><strong>Outcome:</strong> {surgery.outcome}</p>
                      {surgery.notes && <p><strong>Notes:</strong> {surgery.notes}</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No data</p>
              )}
            </div>

            <div>
              <h2 className="mb-4 text-2xl font-semibold text-gray-800">Family History</h2>
              {medicalHistory && medicalHistory.familyHistory.length > 0 ? (
                <ul className="list-disc list-inside">
                  {medicalHistory.familyHistory.map((family, index) => (
                    <li key={index}>
                      {family.relation} - {family.condition}
                      {family.notes && <span> - Notes: {family.notes}</span>}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600">No data</p>
              )}
            </div>

            <div>
              <h2 className="mb-4 text-2xl font-semibold text-gray-800">Vital Signs</h2>
              {medicalHistory && medicalHistory.vitalSigns.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {medicalHistory.vitalSigns.map((vital, index) => (
                    <div key={index} className="p-4 bg-gray-100 rounded-lg shadow">
                      <p><strong>Date:</strong> {new Date(vital.date).toLocaleDateString()}</p>
                      {vital.bloodPressure && <p><strong>Blood Pressure:</strong> {vital.bloodPressure}</p>}
                      {vital.heartRate && <p><strong>Heart Rate:</strong> {vital.heartRate} bpm</p>}
                      {vital.temperature && <p><strong>Temperature:</strong> {vital.temperature} F</p>}
                      {vital.weight && <p><strong>Weight:</strong> {vital.weight} kg</p>}
                      {vital.height && <p><strong>Height:</strong> {vital.height} cm</p>}
                      {vital.recordedBy && (
                        <p><strong>Recorded By:</strong> Dr. {vital.recordedBy.firstName} {vital.recordedBy.lastName}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No data</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalHistory;