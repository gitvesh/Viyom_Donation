import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import './App.css';

// Public pages
import Home from './pages/Home';
import Sectors from './pages/Sectors';
import EducationSector from './pages/EducationSector';
import DonationForm from './pages/DonationForm';
import PaymentProcessing from './pages/PaymentProcessing';
import DonationSuccess from './pages/DonationSuccess';
import Login from './pages/Login';
import Signup from './pages/Signup';

// User pages
import UserDashboard from './pages/user/Dashboard';
import MyDonations from './pages/user/MyDonations';
import TrackDonation from './pages/user/TrackDonation';

// Admin pages
import AdminDashboard from './pages/admin/Dashboard';
import SectorManagement from './pages/admin/SectorManagement';
import DonationPools from './pages/admin/DonationPools';
import DonationsList from './pages/admin/DonationsList';
import Beneficiaries from './pages/admin/Beneficiaries';
import AllocateFunds from './pages/admin/AllocateFunds';
import AllocationHistory from './pages/admin/AllocationHistory';
import BlockchainLedger from './pages/admin/BlockchainLedger';

import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Routes>
            {/* Admin routes (no header/footer) */}
            <Route path="/admin/*" element={
              <Routes>
                <Route path="dashboard" element={<ProtectedRoute requireAdmin><AdminDashboard /></ProtectedRoute>} />
                <Route path="sectors" element={<ProtectedRoute requireAdmin><SectorManagement /></ProtectedRoute>} />
                <Route path="pools" element={<ProtectedRoute requireAdmin><DonationPools /></ProtectedRoute>} />
                <Route path="donations" element={<ProtectedRoute requireAdmin><DonationsList /></ProtectedRoute>} />
                <Route path="beneficiaries" element={<ProtectedRoute requireAdmin><Beneficiaries /></ProtectedRoute>} />
                <Route path="allocate" element={<ProtectedRoute requireAdmin><AllocateFunds /></ProtectedRoute>} />
                <Route path="allocations" element={<ProtectedRoute requireAdmin><AllocationHistory /></ProtectedRoute>} />
                <Route path="ledger" element={<ProtectedRoute requireAdmin><BlockchainLedger /></ProtectedRoute>} />
              </Routes>
            } />
            
            {/* Public and user routes (with header/footer) */}
            <Route path="*" element={
              <>
                <Header />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/sectors" element={<Sectors />} />
                  <Route path="/sector/education" element={<EducationSector />} />
                  <Route path="/donate" element={<DonationForm />} />
                  <Route path="/payment-processing" element={<PaymentProcessing />} />
                  <Route path="/donation-success" element={<DonationSuccess />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
                  <Route path="/my-donations" element={<ProtectedRoute><MyDonations /></ProtectedRoute>} />
                  <Route path="/track-donation" element={<ProtectedRoute><TrackDonation /></ProtectedRoute>} />
                </Routes>
                <Footer />
              </>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

