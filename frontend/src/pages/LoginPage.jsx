import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LoginPage.css';

function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
    setSuccessMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    if (isLogin) {
      // Login
      const result = await login(formData.email, formData.password);
      if (result.success) {
        navigate('/');
      } else {
        setError(result.message);
      }
    } else {
      // Register
      const result = await register(formData.name, formData.email, formData.password, formData.role);
      if (result.success) {
        setSuccessMessage('Registration successful! Please login.');
        setIsLogin(true);
        setFormData({ name: '', email: '', password: '', role: 'user' });
      } else {
        setError(result.message);
      }
    }
    setLoading(false);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>📚 BookHive</h1>
          <p>{isLogin ? 'Welcome Back!' : 'Create Your Account'}</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {successMessage && <div className="alert alert-success">{successMessage}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          {!isLogin && (
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                name="name"
                className="form-control"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter your name"
              />
            </div>
          )}

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              minLength={6}
            />
          </div>



          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Register')}
          </button>
        </form>

        <div className="login-toggle">
          {isLogin ? (
            <p>
              Don't have an account?{' '}
              <span className="link" onClick={() => setIsLogin(false)}>
                Register here
              </span>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <span className="link" onClick={() => setIsLogin(true)}>
                Login here
              </span>
            </p>
          )}
        </div>

        <div className="demo-credentials">
          <p><strong>📌 Note:</strong></p>
          <p>All new registrations are created with "user" role.</p>
          <p>Admin accounts must be created by system administrators.</p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
