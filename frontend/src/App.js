import './App.css';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

// Pages
import HomePage from './pages/Home/home';
import DoctorDashboard from './pages/Doctor/DoctorDashboard';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Doctors from './pages/Doctor/Doctors';
import AddDoctor from './pages/Doctor/AddDoctor';
import DoctorDetail from './pages/Doctor/DoctorDetail';
import AppointmentBooking from './pages/Appoinments/AppointmentBooking';
import PaymentSuccess from './pages/Appoinments/PaymentSuccess';
import PaymentCancel from './pages/Appoinments/PaymentCancel';
import PatientProfile from './pages/Patients/PatientProfile';
import AdminDashboard from './pages/Admin/AdminDashboard';
import Reminders from './pages/Patients/Reminders';
import AddPrescription from './pages/Prescription/Add-Prescription';
import MedicalHistory from './pages/Prescription/MedicalHistory';
import FeedbackForm from './Feedback/FeedbackForm';
import AddMedicalData from './pages/Prescription/AddMedicalData';

// Components
import Header from './components/Header';
import AdminHeader from './components/AdminHeader';
import DoctorHeader from './components/DoctorHeader';
import Footer from './components/Footer';
import PrescriptionDetail from './components/PrescriptionDetail';
import Contact from './pages/StaticPages/Contact';
import About from './pages/StaticPages/About';

// Layout Component
const AppLayout = ({ children }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  let role = '';

  if (token) {
    try {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      role = decodedToken.role;
    } catch (err) {
      console.error('Error decoding token:', err);
      localStorage.removeItem('token');
      navigate('/login');
    }
  }

  const renderHeader = () => {
    if (!token) return <Header />;
    switch (role) {
      case 'admin':
        return <AdminHeader />;
      case 'doctor':
        return <DoctorHeader />;
      case 'patient':
        return <Header />; // Use a PatientHeader if you create one later
      default:
        return <Header />;
    }
  };

  // Redirect logic based on role (optional, headers already handle this)
  useEffect(() => {
    if (token && role) {
      if (role === 'admin' && window.location.pathname === '/') navigate('/admin/dashboard');
      else if (role === 'doctor' && window.location.pathname === '/') navigate('/doctor-dashboard');
      else if (role === 'patient' && window.location.pathname === '/') navigate('/');
    }
  }, [token, role, navigate]);

  return (
    <div className="App">
      {renderHeader()}
      <main className="pt-16">{children}</main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/adddoctor" element={<AddDoctor />} />
          <Route path="/doctor/:id" element={<DoctorDetail />} />
          <Route path="/book-appointment/:doctorId" element={<AppointmentBooking />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment-cancel" element={<PaymentCancel />} />
          <Route path="/profile" element={<PatientProfile />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/reminder" element={<Reminders />} />
          <Route path="/addprescription" element={<AddPrescription />} />
          <Route path="/medical-history" element={<MedicalHistory />} />
          <Route path="/prescription/:id" element={<PrescriptionDetail />} />
          <Route path="/feedback/create/:appointmentId" element={<FeedbackForm />} />
          <Route path="/add-medical-data" element={<AddMedicalData />} />
        </Routes>
      </AppLayout>
    </Router>
  );
}

export default App;