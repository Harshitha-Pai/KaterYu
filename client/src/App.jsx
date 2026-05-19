import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import BrowseCaterers from './pages/customer/BrowseCaterers';
import BookingForm from './pages/customer/BookingForm';
import MyBookings from './pages/customer/MyBookings';
import Dashboard from './pages/caterer/Dashboard';
import ManageMenu from './pages/caterer/ManageMenu';
import SetupProfile from './pages/caterer/SetupProfile';

function ProtectedRoute({ children, role }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/login" />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Customer */}
      <Route path="/browse" element={<ProtectedRoute role="customer"><BrowseCaterers /></ProtectedRoute>} />
      <Route path="/book/:catererId" element={<ProtectedRoute role="customer"><BookingForm /></ProtectedRoute>} />
      <Route path="/my-bookings" element={<ProtectedRoute role="customer"><MyBookings /></ProtectedRoute>} />

      {/* Caterer */}
      <Route path="/dashboard" element={<ProtectedRoute role="caterer"><Dashboard /></ProtectedRoute>} />
      <Route path="/manage-menu" element={<ProtectedRoute role="caterer"><ManageMenu /></ProtectedRoute>} />
      <Route path="/setup-profile" element={<ProtectedRoute role="caterer"><SetupProfile /></ProtectedRoute>} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}