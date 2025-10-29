import { useState, useEffect } from 'react';
import { wishlistAPI, ordersAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

function WishlistPage() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const response = await wishlistAPI.get();
      setWishlist(response.data.wishlist);
      setError(null);
    } catch (err) {
      setError('Failed to fetch wishlist');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (bookId) => {
    try {
      await wishlistAPI.remove(bookId);
      fetchWishlist();
    } catch (err) {
      alert('Failed to remove book');
      console.error(err);
    }
  };

  const handleBuyNow = async (book) => {
    if (book.stock === 0) {
      alert('❌ Sorry, this book is out of stock!');
      return;
    }

    const confirmed = window.confirm(
      `Buy "${book.title}" for $${book.price.toFixed(2)}?\n\nThis will create an order immediately.`
    );

    if (!confirmed) return;

    try {
      const orderData = {
        books: [
          {
            book: book._id,
            quantity: 1
          }
        ]
      };

      const response = await ordersAPI.create(orderData);
      
      alert(`✅ Order placed successfully!

Order Total: $${book.price.toFixed(2)}
Status: Pending

You can view your order in "My Orders" page.`);
      
      // Navigate to orders page
      navigate('/orders');
      
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to create order';
      alert(`❌ Failed to place order:\n${errorMsg}`);
    }
  };

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
        <h2>📖 My TBR (To Be Read) List</h2>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {wishlist.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📚</div>
          <div className="empty-state-text">Your TBR list is empty</div>
          <button 
            className="btn btn-primary" 
            onClick={() => navigate('/books')}
            style={{ marginTop: '1rem' }}
          >
            Browse Books
          </button>
        </div>
      ) : (
        <div className="card-grid">
          {wishlist.map((book) => (
            <div key={book._id} className="card">
              <div className="card-header">
                <span className="badge badge-info">{book.genre}</span>
              </div>
              <div className="card-body">
                <h3 className="card-title">{book.title}</h3>
                <p className="card-text"><strong>Author:</strong> {book.author}</p>
                <p className="card-text"><strong>Category:</strong> {book.category || 'N/A'}</p>
                <p className="card-text">{book.description}</p>
                <div className="card-price">${book.price.toFixed(2)}</div>
                <p className="card-text">
                  <strong>Stock:</strong> 
                  <span style={{ color: book.stock > 0 ? 'var(--success-color)' : 'var(--accent-color)' }}>
                    {' '}{book.stock} units
                  </span>
                </p>
              </div>
              <div className="card-footer">
                <button 
                  className="btn btn-success" 
                  onClick={() => handleBuyNow(book)}
                  disabled={book.stock === 0}
                  style={{ marginRight: '0.5rem' }}
                >
                  🛒 Buy Now
                </button>
                <button 
                  className="btn btn-danger" 
                  onClick={() => handleRemove(book._id)}
                >
                  ❌ Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default WishlistPage;
