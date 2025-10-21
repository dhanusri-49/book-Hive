import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import BooksPage from './pages/BooksPage';
import OrdersPage from './pages/OrdersPage';
import UsersPage from './pages/UsersPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <div className="container">
            <Link to="/" className="navbar-brand">
              📚 BookHive
            </Link>
            <ul className="navbar-nav">
              <li><Link to="/" className="nav-link">Home</Link></li>
              <li><Link to="/books" className="nav-link">Books</Link></li>
              <li><Link to="/orders" className="nav-link">Orders</Link></li>
              <li><Link to="/users" className="nav-link">Users</Link></li>
            </ul>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/books" element={<BooksPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/users" element={<UsersPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
