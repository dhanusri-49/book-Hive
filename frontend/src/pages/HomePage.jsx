import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div>
      <section className="hero">
        <div className="container">
          <h1>Welcome to BookHive 📚</h1>
          <p>Your one-stop destination for discovering and managing books online</p>
        </div>
      </section>

      <div className="container">
        <div className="card-grid">
          <div className="card">
            <div className="card-header">
              📖 Browse Books
            </div>
            <div className="card-body">
              <h3 className="card-title">Explore Our Collection</h3>
              <p className="card-text">
                Discover a wide variety of books across different genres including fiction, non-fiction, horror, academic, and self-help.
              </p>
            </div>
            <div className="card-footer">
              <Link to="/books" className="btn btn-primary">View Books</Link>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              🛒 Manage Orders
            </div>
            <div className="card-body">
              <h3 className="card-title">Track Your Orders</h3>
              <p className="card-text">
                View and manage all book orders. Track order status from pending to delivered.
              </p>
            </div>
            <div className="card-footer">
              <Link to="/orders" className="btn btn-primary">View Orders</Link>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              👥 User Management
            </div>
            <div className="card-body">
              <h3 className="card-title">Manage Users</h3>
              <p className="card-text">
                Admin panel to view and manage all registered users and their roles.
              </p>
            </div>
            <div className="card-footer">
              <Link to="/users" className="btn btn-primary">View Users</Link>
            </div>
          </div>
        </div>

        <section style={{ marginTop: '3rem', textAlign: 'center' }}>
          <h2 style={{ marginBottom: '1rem', color: 'var(--primary-color)' }}>Featured Categories</h2>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <span className="badge badge-info">Fictional</span>
            <span className="badge badge-success">Non-Fictional</span>
            <span className="badge badge-danger">Horror</span>
            <span className="badge badge-warning">Academic</span>
            <span className="badge badge-secondary">Self-Help</span>
          </div>
        </section>
      </div>
    </div>
  );
}

export default HomePage;
