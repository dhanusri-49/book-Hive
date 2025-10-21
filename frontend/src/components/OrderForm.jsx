import { useState, useEffect } from 'react';
import { ordersAPI } from '../services/api';

function OrderForm({ order, books, users, onClose }) {
  const [formData, setFormData] = useState({
    user: '',
    books: [{ book: '', quantity: 1 }],
    totalPrice: 0,
    status: 'pending',
    deliveryDate: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (order) {
      setFormData({
        user: order.user,
        books: order.books.map(item => ({
          book: item.book,
          quantity: item.quantity
        })),
        totalPrice: order.totalPrice,
        status: order.status,
        deliveryDate: order.deliveryDate ? new Date(order.deliveryDate).toISOString().split('T')[0] : ''
      });
    }
  }, [order]);

  useEffect(() => {
    calculateTotal();
  }, [formData.books]);

  const calculateTotal = () => {
    let total = 0;
    formData.books.forEach(item => {
      const book = books.find(b => b._id === item.book);
      if (book) {
        total += book.price * item.quantity;
      }
    });
    setFormData(prev => ({ ...prev, totalPrice: total }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBookChange = (index, field, value) => {
    const newBooks = [...formData.books];
    newBooks[index][field] = field === 'quantity' ? parseInt(value) : value;
    setFormData(prev => ({ ...prev, books: newBooks }));
  };

  const addBookItem = () => {
    setFormData(prev => ({
      ...prev,
      books: [...prev.books, { book: '', quantity: 1 }]
    }));
  };

  const removeBookItem = (index) => {
    if (formData.books.length > 1) {
      const newBooks = formData.books.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, books: newBooks }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const orderData = {
        user: formData.user,
        books: formData.books,
        totalPrice: formData.totalPrice,
        status: formData.status,
        deliveryDate: formData.deliveryDate || undefined
      };

      if (order) {
        await ordersAPI.update(order._id, orderData);
      } else {
        await ordersAPI.create(orderData);
      }
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save order');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>{order ? 'Edit Order' : 'Create New Order'}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Customer *</label>
            <select
              name="user"
              className="form-control"
              value={formData.user}
              onChange={handleChange}
              required
            >
              <option value="">Select a customer</option>
              {users.map(user => (
                <option key={user._id} value={user._id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Books *</label>
            {formData.books.map((item, index) => (
              <div key={index} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <select
                  className="form-control"
                  value={item.book}
                  onChange={(e) => handleBookChange(index, 'book', e.target.value)}
                  required
                  style={{ flex: 2 }}
                >
                  <option value="">Select a book</option>
                  {books.map(book => (
                    <option key={book._id} value={book._id}>
                      {book.title} - ${book.price}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  className="form-control"
                  value={item.quantity}
                  onChange={(e) => handleBookChange(index, 'quantity', e.target.value)}
                  min="1"
                  required
                  style={{ flex: 1 }}
                  placeholder="Qty"
                />
                {formData.books.length > 1 && (
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => removeBookItem(index)}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            <button type="button" className="btn btn-primary" onClick={addBookItem}>
              + Add Book
            </button>
          </div>

          <div className="form-group">
            <label>Total Price</label>
            <input
              type="text"
              className="form-control"
              value={`$${formData.totalPrice.toFixed(2)}`}
              readOnly
              style={{ backgroundColor: '#f0f0f0', fontWeight: 'bold' }}
            />
          </div>

          <div className="form-group">
            <label>Status *</label>
            <select
              name="status"
              className="form-control"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="form-group">
            <label>Delivery Date</label>
            <input
              type="date"
              name="deliveryDate"
              className="form-control"
              value={formData.deliveryDate}
              onChange={handleChange}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-danger" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-success" disabled={loading}>
              {loading ? 'Saving...' : (order ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default OrderForm;
