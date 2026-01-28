import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './auth/Login'; // Landing page with role cards
import RoleLogin from './auth/Login'; // Role-specific login page
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import Register from './auth/Register';
import RecyclerRegister from './auth/RecyclerRegister';
import CollectorRegister from './auth/CollectorRegister';
import GovernmentRegister from './auth/GovernmentRegister';

// Citizen Components
import CitizenLayout from './citizen/Layout';
import CitizenDashboard from './citizen/Dashboard';
import RegisterDevice from './citizen/RegisterDevice';
import DeviceDetails from './citizen/DeviceDetails';
import CitizenRewards from './citizen/Rewards';
import CitizenActivity from './citizen/Activity';
import CitizenProfile from './citizen/Profile';

// Collector Components
import CollectorLayout from './collector/Layout';
import CollectorDashboard from './collector/Dashboard';
import PickupDetails from './collector/PickupDetails';
import CollectorHistory from './collector/History';
import CollectorZone from './collector/Zone';

// Recycler Components
import RecyclerLayout from './recycler/Layout';
import RecyclerDashboard from './recycler/Dashboard';
import RequestDetails from './recycler/RequestDetails';
import RecyclerAssignments from './recycler/Assignments';
import RecyclerHistory from './recycler/History';
import RecyclerSettings from './recycler/Settings';

// Government Components
import GovernmentLayout from './government/Layout';
import GovernmentDashboard from './government/Dashboard';

// Admin Components
import AdminLayout from './admin/Layout';
import AdminDashboard from './admin/Dashboard';
import { ProtectedRoute } from './components/ProtectedRoute';

import { ThemeProvider } from './context/ThemeContext';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <Router>
              <div className="min-h-screen bg-background text-foreground font-sans antialiased selection:bg-emerald-500/30">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Login />} /> {/* Landing page with role cards */}
                  <Route path="/login" element={<RoleLogin />} /> {/* Role-specific login */}
                  <Route path="/register" element={<Register />} />
                  <Route path="/register/recycler" element={<RecyclerRegister />} />
                  <Route path="/register/collector" element={<CollectorRegister />} />
                  <Route path="/register/government" element={<GovernmentRegister />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />

                  {/* Citizen Routes */}
                  <Route path="/citizen" element={
                    <ProtectedRoute allowedRoles={['CITIZEN']}>
                      <CitizenLayout />
                    </ProtectedRoute>
                  }>
                    <Route path="dashboard" element={<CitizenDashboard />} />
                    <Route path="register" element={<RegisterDevice />} />
                    <Route path="rewards" element={<CitizenRewards />} />
                    <Route path="device/:id" element={<DeviceDetails />} />
                    <Route path="activity" element={<CitizenActivity />} />
                    <Route path="profile" element={<CitizenProfile />} />
                    <Route index element={<Navigate to="dashboard" replace />} />
                  </Route>

                  {/* Collector Routes */}
                  <Route path="/collector" element={
                    <ProtectedRoute allowedRoles={['COLLECTOR']}>
                      <CollectorLayout />
                    </ProtectedRoute>
                  }>
                    <Route path="dashboard" element={<CollectorDashboard />} />
                    <Route path="pickup/:id" element={<PickupDetails />} />
                    <Route path="history" element={<CollectorHistory />} />
                    <Route path="zone" element={<CollectorZone />} />
                    <Route index element={<Navigate to="dashboard" replace />} />
                  </Route>

                  {/* Recycler Routes */}
                  <Route path="/recycler" element={
                    <ProtectedRoute allowedRoles={['RECYCLER']}>
                      <RecyclerLayout />
                    </ProtectedRoute>
                  }>
                    <Route path="dashboard" element={<RecyclerDashboard />} />
                    <Route path="assignments" element={<RecyclerAssignments />} />
                    <Route path="history" element={<RecyclerHistory />} />
                    <Route path="settings" element={<RecyclerSettings />} />
                    <Route path="request/:id" element={<RequestDetails />} />
                    <Route index element={<Navigate to="dashboard" replace />} />
                  </Route>

                  {/* Government Routes */}
                  <Route path="/government" element={
                    <ProtectedRoute allowedRoles={['GOVT']}>
                      <GovernmentLayout />
                    </ProtectedRoute>
                  }>
                    <Route path="dashboard" element={<GovernmentDashboard />} />
                    <Route index element={<Navigate to="dashboard" replace />} />
                  </Route>

                  {/* Admin Routes */}
                  <Route path="/admin" element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                      <AdminLayout />
                    </ProtectedRoute>
                  }>
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route index element={<Navigate to="dashboard" replace />} />
                  </Route>

                  {/* Fallback */}
                  <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
              </div>
            </Router>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
