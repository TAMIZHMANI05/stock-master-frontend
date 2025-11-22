import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ROLES } from '../contexts/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';
import LoginPage from '../pages/LoginPage';
import Unauthorized from '../pages/Unauthorized';
import InventoryDashboard from '../pages/InventoryDashboard';
import WarehouseDashboard from '../pages/WarehouseDashboard';
import ForgotPassword from '../pages/ForgotPassword';

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

      {/* Protected Routes - Warehouse Staff Only */}
      <Route
        path="/staff/inventory"
        element={
          <ProtectedRoute allowedRoles={[ROLES.WAREHOUSE_STAFF]}>
            <WarehouseDashboard />
          </ProtectedRoute>
        }
      />

      <Route path="/" element={<Navigate to="/login" replace />} />
      
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
