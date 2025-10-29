import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin()) {
    return (
      <div className="container">
        <div className="alert alert-error">
          <h3>⛔ Access Denied</h3>
          <p>You need administrator privileges to access this page.</p>
        </div>
      </div>
    );
  }

  return children;
}

export default AdminRoute;
