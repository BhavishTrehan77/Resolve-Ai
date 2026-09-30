import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';

// Auth Pages
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

// Employee Pages
import EmployeeDashboard from './pages/employee/EmployeeDashboard';
import CreateTicket from './pages/employee/CreateTicket';
import MyTickets from './pages/employee/MyTickets';

// Shared Ticket Details
import TicketDetails from './pages/TicketDetails';

// Agent Pages
import AgentDashboard from './pages/agent/AgentDashboard';
import AssignedTickets from './pages/agent/AssignedTickets';
import EscalatedTickets from './pages/agent/EscalatedTickets';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AllTickets from './pages/admin/AllTickets';
import UsersManagement from './pages/admin/UsersManagement';
import KnowledgeDocs from './pages/admin/KnowledgeDocs';
import UploadDoc from './pages/admin/UploadDoc';
import AiAssistant from './pages/admin/AiAssistant';

// Root redirect component
const RootRedirect = () => {
  const { user, token, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100">
        <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  const role = (user.role || 'EMPLOYEE').toUpperCase();
  if (role === 'ADMIN') return <Navigate to="/admin" replace />;
  if (role === 'AGENT') return <Navigate to="/agent" replace />;
  return <Navigate to="/employee" replace />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Protected Routes Layout */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              {/* Universal Ticket Details */}
              <Route path="/ticket/:id" element={<TicketDetails />} />

              {/* Employee Routes (strictly EMPLOYEE only) */}
              <Route element={<ProtectedRoute allowedRoles={['EMPLOYEE']} />}>
                <Route path="/employee" element={<EmployeeDashboard />} />
                <Route path="/employee/create-ticket" element={<CreateTicket />} />
                <Route path="/employee/my-tickets" element={<MyTickets />} />
                <Route path="/employee/ai-assistant" element={<AiAssistant />} />
              </Route>

              {/* Agent Routes (strictly AGENT only) */}
              <Route element={<ProtectedRoute allowedRoles={['AGENT']} />}>
                <Route path="/agent" element={<AgentDashboard />} />
                <Route path="/agent/assigned" element={<AssignedTickets />} />
                <Route path="/agent/escalated" element={<EscalatedTickets />} />
              </Route>

              {/* Admin Routes (strictly ADMIN only) */}
              <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/tickets" element={<AllTickets />} />
                <Route path="/admin/escalated" element={<EscalatedTickets />} />
                <Route path="/admin/users" element={<UsersManagement />} />
                <Route path="/admin/documents" element={<KnowledgeDocs />} />
                <Route path="/admin/documents/upload" element={<UploadDoc />} />
                <Route path="/admin/ai-assistant" element={<AiAssistant />} />
              </Route>
            </Route>
          </Route>

          {/* Root & Catch-all */}
          <Route path="/" element={<RootRedirect />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
