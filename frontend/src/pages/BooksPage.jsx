import { useState, useEffect } from 'react';
import { booksAPI, wishlistAPI, ordersAPI } from '../services/api';
import BookForm from '../components/BookForm';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function BooksPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [filterGenre, setFilterGenre] = useState('all');
  const [wishlist, setWishlist] = useState([]);
  const { isAdmin, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchBooks();
    if (isAuthenticated() && !isAdmin()) {
      fetchWishlist();
    }
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await booksAPI.getAll();
      setBooks(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch books');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchWishlist = async () => {
    try {
      const response = await wishlistAPI.get();
      setWishlist(response.data.wishlist.map(book => book._id));
    } catch (err) {
      console.error('Failed to fetch wishlist:', err);
    }
  };

  const handleAddToWishlist = async (bookId) => {
    try {
      await wishlistAPI.add(bookId);
      setWishlist([...wishlist, bookId]);
      alert('✅ Book added to your TBR list!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add to wishlist');
      console.error(err);
    }
  };

  const handleRemoveFromWishlist = async (bookId) => {
    try {
      await wishlistAPI.remove(bookId);
      setWishlist(wishlist.filter(id => id !== bookId));
      alert('🗑️ Book removed from your TBR list');
    } catch (err) {
      alert('Failed to remove from wishlist');
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
      console.log('🛍️ Creating order for book:', book);
      
      const orderData = {
        books: [
          {
            book: book._id,
            quantity: 1
          }
        ]
      };

      const response = await ordersAPI.create(orderData);
      console.log('✅ Order created:', response.data);
      
      alert(`✅ Order placed successfully!

Order Total: $${book.price.toFixed(2)}
Status: Pending

You can view your order in "My Orders" page.`);
      
      // Refresh books to update stock
      fetchBooks();
      
      // Navigate to orders page after 1 second
      setTimeout(() => {
        navigate('/orders');
      }, 1000);
      
    } catch (err) {
      console.error('❌ Order creation failed:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Failed to create order';
      alert(`❌ Failed to place order:\n${errorMsg}`);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await booksAPI.delete(id);
        fetchBooks();
      } catch (err) {
        alert('Failed to delete book');
        console.error(err);
      }
    }
  };

  const handleEdit = (book) => {
    setEditingBook(book);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingBook(null);
    fetchBooks();
  };

  const filteredBooks = filterGenre === 'all' 
    ? books 
    : books.filter(book => book.genre === filterGenre);

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
        <h2>📚 Books Collection</h2>
        {isAdmin() && (
          <button className="btn btn-success" onClick={() => setShowForm(true)}>
            ➕ Add New Book
          </button>
        )}
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="filter-section">
        <div className="filter-group">
          <div className="filter-item">
            <label>Filter by Genre:</label>
            <select 
              className="form-control" 
              value={filterGenre}
              onChange={(e) => setFilterGenre(e.target.value)}
            >
              <option value="all">All Genres</option>
              <option value="fictional">Fictional</option>
              <option value="non-fictional">Non-Fictional</option>
              <option value="horror">Horror</option>
              <option value="academic">Academic</option>
              <option value="self-help">Self-Help</option>
            </select>
          </div>
        </div>
      </div>

      {filteredBooks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📚</div>
          <div className="empty-state-text">No books found</div>
        </div>
      ) : (
        <div className="card-grid">
          {filteredBooks.map((book) => (
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
                {isAdmin() ? (
                  <>
                    <button className="btn btn-primary" onClick={() => handleEdit(book)}>
                      ✏️ Edit
                    </button>
                    <button className="btn btn-danger" onClick={() => handleDelete(book._id)}>
                      🗑️ Delete
                    </button>
                  </>
                ) : isAuthenticated() ? (
                  <>
                    {wishlist.includes(book._id) ? (
                      <button 
                        className="btn btn-secondary" 
                        onClick={() => handleRemoveFromWishlist(book._id)}
                        style={{ marginRight: '0.5rem' }}
                      >
                        ❤️ In TBR
                      </button>
                    ) : (
                      <button 
                        className="btn btn-primary" 
                        onClick={() => handleAddToWishlist(book._id)}
                        style={{ marginRight: '0.5rem' }}
                      >
                        📖 Add to TBR
                      </button>
                    )}
                    <button 
                      className="btn btn-success" 
                      onClick={() => handleBuyNow(book)}
                      disabled={book.stock === 0}
                    >
                      🛍️ Buy Now
                    </button>
                  </>
                ) : (
                  <span style={{ color: '#666', fontSize: '0.9rem' }}>
                    🔒 Login to purchase
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <BookForm 
          book={editingBook} 
          onClose={handleFormClose}
        />
      )}
    </div>
  );
}

export default BooksPage;
