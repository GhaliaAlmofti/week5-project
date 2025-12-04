import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AppLayout from './components/AppLayout';
import ProtectedRoute from './components/ProtectedRoute';
import ProductsList from './pages/ProductsList.tsx';
import ProductAddEdit from './pages/ProductAddEdit.tsx';

const DashboardPage = () => <h1 className="text-3xl font-bold dark:text-white">Dashboard Overview</h1>;

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<AppLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="products" element={<ProductsList />} />
          <Route path="products/add" element={<ProductAddEdit />} />
          <Route path="products/edit/:id" element={<ProductAddEdit />} />
        </Route>
      </Route>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;