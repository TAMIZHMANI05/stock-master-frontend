import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ROLES } from '../contexts/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';
import LoginPage from '../pages/LoginPage';
import Unauthorized from '../pages/Unauthorized';
import InventoryDashboard from '../pages/InventoryDashboard';
import WarehouseDashboard from '../pages/WarehouseDashboard';
import ForgotPassword from '../pages/ForgotPassword';

// Manager Pages
import ManagerOperations from '../pages/manager/ManagerOperations';
import ManagerStock from '../pages/manager/ManagerStock';
import ManagerMoveHistory from '../pages/manager/ManagerMoveHistory';
import ManagerSettings from '../pages/manager/ManagerSettings';

// Staff Pages
import StaffOperations from '../pages/staff/StaffOperations';
import StaffStock from '../pages/staff/StaffStock';
import StaffMoveHistory from '../pages/staff/StaffMoveHistory';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Protected Routes - Inventory Manager Only */}
      <Route
        path="/manager/dashboard"
        element={
          <ProtectedRoute allowedRoles={[ROLES.INVENTORY_MANAGER]}>
            <InventoryDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/manager/operations"
        element={
          <ProtectedRoute allowedRoles={[ROLES.INVENTORY_MANAGER]}>
            <ManagerOperations />
          </ProtectedRoute>
        }
      />
      <Route
        path="/manager/stock"
        element={
          <ProtectedRoute allowedRoles={[ROLES.INVENTORY_MANAGER]}>
            <ManagerStock />
          </ProtectedRoute>
        }
      />
      <Route
        path="/manager/move-history"
        element={
          <ProtectedRoute allowedRoles={[ROLES.INVENTORY_MANAGER]}>
            <ManagerMoveHistory />
          </ProtectedRoute>
        }
      />
      <Route
        path="/manager/settings"
        element={
          <ProtectedRoute allowedRoles={[ROLES.INVENTORY_MANAGER]}>
            <ManagerSettings />
          </ProtectedRoute>
        }
      />

      {/* Protected Routes - Warehouse Staff Only */}
      <Route
        path="/staff/inventory"
        element={
          <ProtectedRoute allowedRoles={[ROLES.WAREHOUSE_STAFF]}>
            <WarehouseDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff/operations"
        element={
          <ProtectedRoute allowedRoles={[ROLES.WAREHOUSE_STAFF]}>
            <StaffOperations />
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff/stock"
        element={
          <ProtectedRoute allowedRoles={[ROLES.WAREHOUSE_STAFF]}>
            <StaffStock />
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff/move-history"
        element={
          <ProtectedRoute allowedRoles={[ROLES.WAREHOUSE_STAFF]}>
            <StaffMoveHistory />
          </ProtectedRoute>
        }
      />

      <Route path="/" element={<Navigate to="/login" replace />} />
      
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
