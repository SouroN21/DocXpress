import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddDoctor = () => {
  const [profile, setProfile] = useState({
    specialization: '',
    licenseNumber: '',
    yearsOfExperience: '',
    clinicAddress: '',
    availability: [{ day: '', startTime: '', endTime: '' }],
    consultationFee: '',
    qualifications: [{ degree: '', institution: '', year: '' }],
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasProfile, setHasProfile] = useState(null); // null = checking, false = no profile, true = has profile
  const [isDoctor, setIsDoctor] = useState(false); // Explicitly track doctor role
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const isAuthenticated = !!token;

  console.log('1. Component mounted. isAuthenticated:', isAuthenticated);

  useEffect(() => {
    console.log('2. useEffect started');
    if (!isAuthenticated) {
      console.log('3. No token found. Setting error and redirecting to /login');
      setError('Please log in to continue.');
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    let userId = '';
    try {
      console.log('4. Decoding token');
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      userId = decodedToken.id; // Adjust 'id' to match your JWT (e.g., '_id')
      const doctorRole = decodedToken.role === 'doctor';
      setIsDoctor(doctorRole);
      console.log('5. Token decoded:', { userId, isDoctor: doctorRole });

      if (!doctorRole) {
        console.log('6. User is not a doctor. Setting error and redirecting to /login');
        setError('Only doctors can access this page.');
        setTimeout(() => navigate('/login'), 2000);
        return;
      }

      console.log('7. Checking profile for userId:', userId);
      const checkProfile = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/doc/by-user/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          console.log('8. Profile check response:', response.data);
          if (response.data) {
            console.log('9. Profile exists. Setting hasProfile to true');
            setHasProfile(true);
            setError('You already have a doctor profile. Redirecting...');
            setTimeout(() => {
              console.log('10. Redirecting to /doctor-dashboard');
              navigate('/doctor-dashboard');
            }, 2000);
          } else {
            console.log('9. No profile found. Setting hasProfile to false');
            setHasProfile(false);
          }
        } catch (err) {
          console.log('8. Profile check failed:', err.response?.status, err.response?.data);
          if (err.response?.status === 404) {
            console.log('9. No profile exists. Setting hasProfile to false');
            setHasProfile(false);
          } else {
            console.error('10. Error checking profile:', err.response?.data);
            setError('Error checking profile. Proceeding anyway.');
            setHasProfile(false); // Allow form to show despite error
          }
        }
      };
      checkProfile();
    } catch (err) {
      console.error('6. Token decoding failed:', err);
      setError('Invalid token. Please log in again.');
      setTimeout(() => navigate('/login'), 2000);
    }
  }, [token, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvailabilityChange = (index, field, value) => {
    const newAvailability = [...profile.availability];
    newAvailability[index][field] = value;
    setProfile((prev) => ({ ...prev, availability: newAvailability }));
  };

  const handleQualificationChange = (index, field, value) => {
    const newQualifications = [...profile.qualifications];
    newQualifications[index][field] = value;
    setProfile((prev) => ({ ...prev, qualifications: newQualifications }));
  };

  const addAvailability = () => {
    setProfile((prev) => ({
      ...prev,
      availability: [...prev.availability, { day: '', startTime: '', endTime: '' }],
    }));
  };

  const addQualification = () => {
    setProfile((prev) => ({
      ...prev,
      qualifications: [...prev.qualifications, { degree: '', institution: '', year: '' }],
    }));
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const validateForm = () => {
    const { specialization, licenseNumber, yearsOfExperience, consultationFee, availability, qualifications } = profile;
    if (!specialization || !licenseNumber || !yearsOfExperience || !consultationFee) {
      setError('All required fields must be filled.');
      return false;
    }
    if (Number(yearsOfExperience) < 0 || Number(consultationFee) < 0) {
      setError('Years of experience and consultation fee must be non-negative.');
      return false;
    }
    if (availability.some((slot) => !slot.day || !slot.startTime || !slot.endTime)) {
      setError('All availability slots must be fully filled.');
      return false;
    }
    if (qualifications.some((q) => !q.degree || !q.institution || !q.year)) {
      setError('All qualifications must be fully filled.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('specialization', profile.specialization);
    formData.append('licenseNumber', profile.licenseNumber);
    formData.append('yearsOfExperience', profile.yearsOfExperience);
    formData.append('clinicAddress', profile.clinicAddress);
    formData.append('availability', JSON.stringify(profile.availability));
    formData.append('consultationFee', profile.consultationFee);
    formData.append('qualifications', JSON.stringify(profile.qualifications));
    if (imageFile) {
      formData.append('image', imageFile);
    }

    console.log('11. Submitting FormData:');
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      const response = await axios.post('http://localhost:5000/doc/profile', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setLoading(false);
      console.log('12. Profile created:', response.data);
      alert('Doctor profile created successfully!');
      navigate('/doctor-dashboard');
    } catch (err) {
      setLoading(false);
      console.error('12. Error response:', err.response?.data);
      const errorMessage = err.response?.data?.message || 'Failed to create doctor profile.';
      setError(errorMessage);
      if (err.response?.status === 400 && errorMessage === 'Doctor profile already exists') {
        setHasProfile(true);
        setTimeout(() => navigate('/doctor-dashboard'), 2000);
      }
    }
  };

  console.log('13. Rendering. hasProfile:', hasProfile, 'isDoctor:', isDoctor);

  // Show loading state while checking profile
  if (hasProfile === null) {
    return (
      <div className="container max-w-2xl px-4 py-6 mx-auto bg-white rounded-lg shadow-lg">
        <p className="text-center text-gray-500">Checking profile status...</p>
      </div>
    );
  }

  // Show form if authenticated, is a doctor, and no profile exists
  return (
    <div className="container max-w-2xl px-4 py-6 mx-auto bg-white rounded-lg shadow-lg">
      <h1 className="mb-6 text-3xl font-bold text-center text-gray-800">Add Doctor Profile</h1>
      {error && <p className="p-2 mb-4 text-center text-white bg-red-500 rounded-md">{error}</p>}
      {hasProfile && (
        <p className="p-2 mb-4 text-center text-white bg-yellow-500 rounded-md">
          You already have a profile. Redirecting to dashboard...
        </p>
      )}
      {!isDoctor && (
        <p className="p-2 mb-4 text-center text-white bg-red-500 rounded-md">
          You must be a doctor to access this page.
        </p>
      )}
      {isAuthenticated && isDoctor && !hasProfile && (
        <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
          <div>
            <label className="block text-sm font-medium text-gray-700">Specialization <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="specialization"
              value={profile.specialization}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">License Number <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="licenseNumber"
              value={profile.licenseNumber}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Years of Experience <span className="text-red-500">*</span></label>
            <input
              type="number"
              name="yearsOfExperience"
              value={profile.yearsOfExperience}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Clinic Address (optional)</label>
            <input
              type="text"
              name="clinicAddress"
              value={profile.clinicAddress}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Profile Image (optional)</label>
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png"
              onChange={handleImageChange}
              className="w-full px-4 py-2 mt-1 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Availability <span className="text-red-500">*</span></label>
            {profile.availability.map((slot, index) => (
              <div key={index} className="flex mb-2 space-x-2">
                <select
                  value={slot.day}
                  onChange={(e) => handleAvailabilityChange(index, 'day', e.target.value)}
                  className="w-1/3 px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Day</option>
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
                <input
                  type="time"
                  value={slot.startTime}
                  onChange={(e) => handleAvailabilityChange(index, 'startTime', e.target.value)}
                  className="w-1/3 px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="time"
                  value={slot.endTime}
                  onChange={(e) => handleAvailabilityChange(index, 'endTime', e.target.value)}
                  className="w-1/3 px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            ))}
            <button
              type="button"
              onClick={addAvailability}
              className="mt-2 text-blue-500 hover:underline"
            >
              + Add Another Availability Slot
            </button>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Consultation Fee <span className="text-red-500">*</span></label>
            <input
              type="number"
              name="consultationFee"
              value={profile.consultationFee}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Qualifications <span className="text-red-500">*</span></label>
            {profile.qualifications.map((qual, index) => (
              <div key={index} className="flex mb-2 space-x-2">
                <input
                  type="text"
                  placeholder="Degree"
                  value={qual.degree}
                  onChange={(e) => handleQualificationChange(index, 'degree', e.target.value)}
                  className="w-1/3 px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="text"
                  placeholder="Institution"
                  value={qual.institution}
                  onChange={(e) => handleQualificationChange(index, 'institution', e.target.value)}
                  className="w-1/3 px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="number"
                  placeholder="Year"
                  value={qual.year}
                  onChange={(e) => handleQualificationChange(index, 'year', e.target.value)}
                  className="w-1/3 px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            ))}
            <button
              type="button"
              onClick={addQualification}
              className="mt-2 text-blue-500 hover:underline"
            >
              + Add Another Qualification
            </button>
          </div>
          <button
            type="submit"
            className={`w-full py-2 text-white rounded-md transition-colors ${
              loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
            }`}
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Doctor Profile'}
          </button>
        </form>
      )}
    </div>
  );
};

export default AddDoctor;