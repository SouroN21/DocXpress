// No changes needed, keeping as reference
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AppointmentModal = ({ selectedAppointment, handleStatusUpdate, closeAppointmentDetails }) => {
  const navigate = useNavigate();
  const [prescription, setPrescription] = useState(null);
  const [loadingPrescription, setLoadingPrescription] = useState(true);
  const [prescriptionError, setPrescriptionError] = useState('');

  useEffect(() => {
    const fetchPrescription = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get(
          `http://localhost:5000/prescriptions/appointment/${selectedAppointment._id}`,
          config
        );
        setPrescription(response.data.prescription || null);
      } catch (err) {
        setPrescriptionError(err.response?.data?.message || 'No prescription found for this appointment.');
      } finally {
        setLoadingPrescription(false);
      }
    };
    fetchPrescription();
  }, [selectedAppointment._id]);

  const handleCreatePrescription = () => {
    navigate('/addprescription', { state: { appointment: selectedAppointment } });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="w-full max-w-lg p-8 transition-all transform scale-100 bg-white shadow-2xl rounded-2xl">
        <h4 className="mb-6 text-2xl font-bold text-gray-800">Appointment Details</h4>
        <div className="space-y-4 text-gray-700">
          <p><span className="font-semibold">Patient:</span> {selectedAppointment.patientId.firstName} {selectedAppointment.patientId.lastName}</p>
          <p><span className="font-semibold">Email:</span> {selectedAppointment.patientId.email || 'Not provided'}</p>
          <p><span className="font-semibold">Date & Time:</span> {new Date(selectedAppointment.dateTime).toLocaleString()}</p>
          <p><span className="font-semibold">Mode:</span> {selectedAppointment.mode}</p>
          <p><span className="font-semibold">Payment Status:</span> <span className={`ml-2 px-3 py-1 rounded-full text-sm ${selectedAppointment.paidStatus === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{selectedAppointment.paidStatus}</span></p>
          <p><span className="font-semibold">Current Status:</span> {selectedAppointment.status}</p>
          <div className="mt-6">
            <label className="block mb-2 text-sm font-medium text-gray-700">Update Status:</label>
            <select value={selectedAppointment.status} onChange={(e) => handleStatusUpdate(selectedAppointment._id, e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Completed">Completed</option>
              <option value="Canceled">Canceled</option>
            </select>
          </div>
          <div className="mt-6">
            <h5 className="mb-2 text-lg font-semibold text-gray-800">Prescription</h5>
            {loadingPrescription ? (
              <p className="text-gray-500">Loading prescription...</p>
            ) : prescriptionError ? (
              <p className="text-red-500">{prescriptionError}</p>
            ) : prescription ? (
              <div className="p-4 space-y-2 bg-gray-100 rounded-lg">
                {prescription.medicines.map((med, index) => (
                  <div key={index}>
                    <p><span className="font-semibold">Medicine {index + 1}:</span> {med.medicineName} - {med.dosage}, {med.frequency}, {med.duration}{med.notes && <span> (Notes: {med.notes})</span>}</p>
                  </div>
                ))}
                {prescription.finalNotes && <p><span className="font-semibold">Final Notes:</span> {prescription.finalNotes}</p>}
                <p><span className="font-semibold">Issued At:</span> {new Date(prescription.issuedAt).toLocaleString()}</p>
              </div>
            ) : (
              <p className="text-gray-500">No prescription available for this appointment.</p>
            )}
          </div>
        </div>
        <div className="flex justify-end mt-8 space-x-4">
          {prescription ? (
            <button onClick={() => navigate(`/prescription/${prescription._id}`)} className="px-6 py-3 text-white transition duration-200 bg-blue-600 rounded-lg hover:bg-blue-700">
              View Prescription
            </button>
          ) : (
            <button onClick={handleCreatePrescription} className="px-6 py-3 text-white transition duration-200 bg-indigo-600 rounded-lg hover:bg-indigo-700">
              Create Prescription
            </button>
          )}
          <button onClick={closeAppointmentDetails} className="px-6 py-3 text-gray-700 transition duration-200 bg-gray-200 rounded-lg hover:bg-gray-300">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentModal;