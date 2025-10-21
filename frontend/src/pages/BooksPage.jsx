import { useState, useEffect } from 'react';
import { booksAPI } from '../services/api';
import BookForm from '../components/BookForm';

function BooksPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [filterGenre, setFilterGenre] = useState('all');

  useEffect(() => {
    fetchBooks();
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
        <button className="btn btn-success" onClick={() => setShowForm(true)}>
          ➕ Add New Book
        </button>
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
                <button className="btn btn-primary" onClick={() => handleEdit(book)}>
                  ✏️ Edit
                </button>
                <button className="btn btn-danger" onClick={() => handleDelete(book._id)}>
                  🗑️ Delete
                </button>
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
