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

        <section style={{ marginTop: '3rem' }}>
          <h2 style={{ marginBottom: '2rem', color: 'var(--primary-color)', textAlign: 'center' }}>Book Genres & Categories</h2>
          
          <div style={{ display: 'grid', gap: '1.5rem', maxWidth: '900px', margin: '0 auto' }}>
            <div className="card">
              <div className="card-body">
                <h3 style={{ color: 'var(--primary-color)', marginBottom: '0.75rem' }}>📖 1. Self-Help Books</h3>
                <p style={{ color: '#555', lineHeight: '1.6' }}>
                  Self-help books are written to inspire personal growth, improve habits, and build confidence. They guide readers on topics like motivation, success, relationships, and emotional well-being.
                </p>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <h3 style={{ color: 'var(--primary-color)', marginBottom: '0.75rem' }}>📚 2. Fictional Books</h3>
                <p style={{ color: '#555', lineHeight: '1.6' }}>
                  Fiction books are stories created from the imagination of the author. They may include realistic or fantastical elements, characters, and plots that entertain and inspire readers.
                </p>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <h3 style={{ color: 'var(--primary-color)', marginBottom: '0.75rem' }}>📰 3. Non-Fiction Books</h3>
                <p style={{ color: '#555', lineHeight: '1.6' }}>
                  Non-fiction books are based on real events, facts, and information. They educate readers on subjects like history, science, biographies, and true stories.
                </p>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <h3 style={{ color: 'var(--primary-color)', marginBottom: '0.75rem' }}>🎓 4. Academic Books</h3>
                <p style={{ color: '#555', lineHeight: '1.6' }}>
                  Academic books are written for educational and research purposes. They are used by students, teachers, and professionals to gain in-depth knowledge of specific subjects.
                </p>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <h3 style={{ color: 'var(--primary-color)', marginBottom: '0.75rem' }}>👻 5. Horror Books</h3>
                <p style={{ color: '#555', lineHeight: '1.6' }}>
                  Horror books are designed to thrill and scare readers through suspenseful plots and eerie atmospheres. They often explore fear, mystery, and the supernatural.
                </p>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--primary-color)' }}>Featured Categories</h3>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <span className="badge badge-secondary">Self-Help</span>
              <span className="badge badge-info">Fictional</span>
              <span className="badge badge-success">Non-Fictional</span>
              <span className="badge badge-warning">Academic</span>
              <span className="badge badge-danger">Horror</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default HomePage;
