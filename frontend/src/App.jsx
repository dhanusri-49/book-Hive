import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import BooksPage from './pages/BooksPage';
import OrdersPage from './pages/OrdersPage';
import UsersPage from './pages/UsersPage';
import WishlistPage from './pages/WishlistPage';
import './App.css';

function NavBar() {
  const { isAuthenticated, user, logout, isAdmin } = useAuth();

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="navbar-brand">
          📚 BookHive
        </Link>
        <ul className="navbar-nav">
          {isAuthenticated() ? (
            <>
              <li><Link to="/" className="nav-link">Home</Link></li>
              <li><Link to="/books" className="nav-link">Books</Link></li>
              {!isAdmin() && (
                <li><Link to="/wishlist" className="nav-link">📖 TBR</Link></li>
              )}
              <li><Link to="/orders" className="nav-link">
                {isAdmin() ? 'All Orders' : 'My Orders'}
              </Link></li>
              {isAdmin() && (
                <li><Link to="/users" className="nav-link">Users</Link></li>
              )}
              <li>
                <span className="nav-link" style={{ color: '#f39c12', fontWeight: 'bold' }}>
                  {user?.role === 'admin' ? '👑 Admin' : '👤 User'} - {user?.name}
                </span>
              </li>
              <li>
                <button className="btn btn-danger" onClick={logout} style={{ padding: '0.5rem 1rem' }}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <li><Link to="/login" className="nav-link">Login</Link></li>
          )}
        </ul>
      </div>
    </nav>
  );
}

function AppContent() {
  return (
    <div className="App">
      <NavBar />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        } />
        <Route path="/books" element={
          <ProtectedRoute>
            <BooksPage />
          </ProtectedRoute>
        } />
        <Route path="/wishlist" element={
          <ProtectedRoute>
            <WishlistPage />
          </ProtectedRoute>
        } />
        <Route path="/orders" element={
          <ProtectedRoute>
            <OrdersPage />
          </ProtectedRoute>
        } />
        <Route path="/users" element={
          <AdminRoute>
            <UsersPage />
          </AdminRoute>
        } />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
