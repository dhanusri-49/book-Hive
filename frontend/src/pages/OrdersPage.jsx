import { useState, useEffect } from 'react';
import { ordersAPI, booksAPI, usersAPI } from '../services/api';
import OrderForm from '../components/OrderForm';

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [ordersRes, booksRes, usersRes] = await Promise.all([
        ordersAPI.getAll(),
        booksAPI.getAll(),
        usersAPI.getAll()
      ]);
      setOrders(ordersRes.data);
      setBooks(booksRes.data);
      setUsers(usersRes.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await ordersAPI.delete(id);
        fetchData();
      } catch (err) {
        alert('Failed to delete order');
        console.error(err);
      }
    }
  };

  const handleEdit = (order) => {
    setEditingOrder(order);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingOrder(null);
    fetchData();
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'badge-warning',
      confirmed: 'badge-info',
      shipped: 'badge-secondary',
      delivered: 'badge-success',
      cancelled: 'badge-danger'
    };
    return badges[status] || 'badge-secondary';
  };

  const getUserName = (userId) => {
    const user = users.find(u => u._id === userId);
    return user ? user.name : 'Unknown User';
  };

  const getBookTitle = (bookId) => {
    const book = books.find(b => b._id === bookId);
    return book ? book.title : 'Unknown Book';
  };

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === filterStatus);

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
        <h2>🛒 Orders Management</h2>
        <button className="btn btn-success" onClick={() => setShowForm(true)}>
          ➕ Create New Order
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="filter-section">
        <div className="filter-group">
          <div className="filter-item">
            <label>Filter by Status:</label>
            <select 
              className="form-control" 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Orders</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🛒</div>
          <div className="empty-state-text">No orders found</div>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Books</th>
                <th>Total Price</th>
                <th>Status</th>
                <th>Order Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id.slice(-8)}</td>
                  <td>{getUserName(order.user)}</td>
                  <td>
                    {order.books.map((item, index) => (
                      <div key={index}>
                        {getBookTitle(item.book)} (x{item.quantity})
                      </div>
                    ))}
                  </td>
                  <td>${order.totalPrice.toFixed(2)}</td>
                  <td>
                    <span className={`badge ${getStatusBadge(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                  <td>
                    <button 
                      className="btn btn-primary" 
                      style={{ marginRight: '0.5rem' }}
                      onClick={() => handleEdit(order)}
                    >
                      ✏️
                    </button>
                    <button 
                      className="btn btn-danger"
                      onClick={() => handleDelete(order._id)}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <OrderForm 
          order={editingOrder}
          books={books}
          users={users}
          onClose={handleFormClose}
        />
      )}
    </div>
  );
}

export default OrdersPage;
