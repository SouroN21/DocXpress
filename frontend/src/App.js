import './App.css';
import HomePage from './pages/Home/home';
import Header from './components/Header';
import Footer from './components/Footer';
import DoctorDashboard from './pages/Doctor/DoctorDashboard'; // Ensure this exists
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Doctors from './pages/Doctor/Doctors'; // Use only one Doctors component
import AddDoctor from './pages/Doctor/AddDoctor';
import DoctorDetail from './pages/Doctor/DoctorDetail';
import AppointmentBooking from './pages/Appoinments/AppointmentBooking';
import PaymentSuccess from './pages/Appoinments/PaymentSuccess';
import PaymentCancel from './pages/Appoinments/PaymentCancel';
import PatientProfile from './pages/Patients/PatientProfile';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
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
          {/* Add Admin Dashboard if needed */}
          {/* <Route path="/admin-dashboard" element={<AdminDashboard />} /> */}
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;