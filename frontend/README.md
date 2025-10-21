# BookHive Frontend

A modern React-based frontend application for the BookHive online bookstore.

## Features

- 📚 **Books Management**: Browse, add, edit, and delete books with filtering by genre
- 🛒 **Orders Management**: Create and track orders with multiple books
- 👥 **User Management**: Manage users and their roles
- 🎨 **Modern UI**: Clean and responsive design with intuitive navigation
- ⚡ **Real-time Updates**: Instant feedback on all operations

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API calls
- **CSS3** - Custom styling with CSS variables

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Backend server running on port 5000

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The production build will be in the `dist` folder.

## Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable components
│   │   ├── BookForm.jsx    # Book add/edit form
│   │   ├── OrderForm.jsx   # Order add/edit form
│   │   └── UserForm.jsx    # User add/edit form
│   ├── pages/              # Page components
│   │   ├── HomePage.jsx    # Landing page
│   │   ├── BooksPage.jsx   # Books catalog
│   │   ├── OrdersPage.jsx  # Orders management
│   │   └── UsersPage.jsx   # Users management
│   ├── services/           # API services
│   │   └── api.js         # API endpoints
│   ├── App.jsx            # Main app component
│   ├── index.css          # Global styles
│   └── main.jsx           # App entry point
├── index.html
├── vite.config.js
└── package.json
```

## API Integration

The frontend connects to the backend API at `http://localhost:5000/api` through the Vite proxy configuration.

### Available Endpoints:

- **Books**: GET, POST, PUT, DELETE `/api/books`
- **Orders**: GET, POST, PUT, DELETE `/api/orders`
- **Users**: GET, POST, PUT, DELETE `/api/users`

## Features Overview

### Books Page
- View all books in a card grid layout
- Filter books by genre (fictional, non-fictional, horror, academic, self-help)
- Add new books with title, author, price, genre, category, description, and stock
- Edit existing books
- Delete books

### Orders Page
- View all orders in a table format
- Filter orders by status (pending, confirmed, shipped, delivered, cancelled)
- Create new orders with multiple books
- Calculate total price automatically
- Update order status and delivery dates
- Delete orders

### Users Page
- View all users in a table
- Filter users by role (user, admin)
- Add new users with name, email, password, and role
- Edit user details
- Delete users

## Styling

The app uses CSS variables for consistent theming:

- Primary Color: #2c3e50
- Secondary Color: #3498db
- Success Color: #27ae60
- Danger Color: #e74c3c
- Warning Color: #f39c12

## License

MIT
