import { useState, useEffect } from 'react';
import { usersAPI } from '../services/api';
import UserForm from '../components/UserForm';
import { useAuth } from '../context/AuthContext';

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [filterRole, setFilterRole] = useState('all');
  const { isAdmin } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await usersAPI.getAll();
      setUsers(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await usersAPI.delete(id);
        fetchUsers();
      } catch (err) {
        alert('Failed to delete user');
        console.error(err);
      }
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingUser(null);
    fetchUsers();
  };

  const filteredUsers = filterRole === 'all' 
    ? users 
    : users.filter(user => user.role === filterRole);

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <h2>👥 Users Management</h2>
        {isAdmin() && (
          <button className="btn btn-success" onClick={() => setShowForm(true)}>
            ➕ Add New User
          </button>
        )}
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="filter-section">
        <div className="filter-group">
          <div className="filter-item">
            <label>Filter by Role:</label>
            <select 
              className="form-control" 
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
            >
              <option value="all">All Roles</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">👥</div>
          <div className="empty-state-text">No users found</div>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`badge ${user.role === 'admin' ? 'badge-danger' : 'badge-info'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td>
                    {isAdmin() ? (
                      <>
                        <button 
                          className="btn btn-primary" 
                          style={{ marginRight: '0.5rem' }}
                          onClick={() => handleEdit(user)}
                        >
                          ✏️ Edit
                        </button>
                        <button 
                          className="btn btn-danger"
                          onClick={() => handleDelete(user._id)}
                        >
                          🗑️ Delete
                        </button>
                      </>
                    ) : (
                      <span style={{ color: '#666', fontSize: '0.85rem' }}>
                        🔒 View-only
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <UserForm 
          user={editingUser}
          onClose={handleFormClose}
        />
      )}
    </div>
  );
}

export default UsersPage;
