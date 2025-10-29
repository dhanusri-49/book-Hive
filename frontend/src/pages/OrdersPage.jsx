import { useState, useEffect } from 'react';
import { ordersAPI, booksAPI, usersAPI } from '../services/api';
import OrderForm from '../components/OrderForm';
import { useAuth } from '../context/AuthContext';

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const { isAdmin, user } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching orders and books...');
      
      const [ordersRes, booksRes] = await Promise.all([
        ordersAPI.getAll(),
        booksAPI.getAll()
      ]);
      
      console.log('✅ Raw orders response:', ordersRes);
      console.log('✅ Raw books response:', booksRes);
      
      // Ensure we have arrays
      let ordersData = Array.isArray(ordersRes.data) ? ordersRes.data : [];
      let booksData = Array.isArray(booksRes.data) ? booksRes.data : [];
      
      console.log('📦 Orders array:', ordersData);
      console.log('📚 Books array:', booksData);
      console.log('👤 Current user:', user);
      console.log('🔑 Is Admin?', isAdmin());
      
      if (!isAdmin() && user) {
        // Regular users see only their own orders
        console.log('👤 Filtering orders for regular user:', user.id);
        ordersData = ordersData.filter(order => {
          if (!order.user) {
            console.log('⚠️ Order has null user, skipping:', order._id);
            return false; // Skip orders with deleted users
          }
          const orderUserId = typeof order.user === 'object' && order.user ? order.user._id : order.user;
          console.log('Comparing order user:', orderUserId, 'with current user:', user.id);
          return orderUserId?.toString() === user.id?.toString();
        });
        console.log('✅ Filtered orders for user:', ordersData);
      } else if (isAdmin()) {
        console.log('👑 Admin user - showing ALL orders from ALL users. Total:', ordersData.length);
      }
      
      setOrders(ordersData);
      setBooks(booksData);
      
      // Only fetch users if admin
      if (isAdmin()) {
        const usersRes = await usersAPI.getAll();
        setUsers(Array.isArray(usersRes.data) ? usersRes.data : []);
      }
      
      setError(null);
    } catch (err) {
      console.error('❌ Fetch error:', err);
      console.error('Error response:', err.response);
      console.error('Error message:', err.message);
      setError('Failed to fetch data: ' + (err.response?.data?.message || err.message));
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
    if (!userId) return 'Deleted User';
    if (typeof userId === 'object' && userId.name) return userId.name;
    const user = users.find(u => u._id === (typeof userId === 'object' ? userId._id : userId));
    return user ? user.name : 'Unknown User';
  };

  const getBookTitle = (bookId) => {
    if (!bookId) return 'Deleted Book';
    if (typeof bookId === 'object' && bookId.title) return bookId.title;
    const book = books.find(b => b._id === (typeof bookId === 'object' ? bookId._id : bookId));
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
        <h2>🛒 {isAdmin() ? 'All Orders Management' : 'My Orders'}</h2>
        {isAdmin() && (
          <button className="btn btn-success" onClick={() => setShowForm(true)}>
            ➕ Create New Order
          </button>
        )}
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
          <div className="empty-state-text">
            {isAdmin() ? 'No orders found' : 'You haven\'t placed any orders yet'}
          </div>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                {isAdmin() && <th>Customer</th>}
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
                  {isAdmin() && <td>{getUserName(order.user)}</td>}
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
                    {isAdmin() ? (
                      <>
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
