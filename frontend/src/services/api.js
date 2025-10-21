import axios from 'axios';

const API_URL = '/api';

// Books API
export const booksAPI = {
  getAll: () => axios.get(`${API_URL}/books`),
  getById: (id) => axios.get(`${API_URL}/books/${id}`),
  create: (book) => axios.post(`${API_URL}/books`, book),
  update: (id, book) => axios.put(`${API_URL}/books/${id}`, book),
  delete: (id) => axios.delete(`${API_URL}/books/${id}`)
};

// Orders API
export const ordersAPI = {
  getAll: () => axios.get(`${API_URL}/orders`),
  getById: (id) => axios.get(`${API_URL}/orders/${id}`),
  create: (order) => axios.post(`${API_URL}/orders`, order),
  update: (id, order) => axios.put(`${API_URL}/orders/${id}`, order),
  delete: (id) => axios.delete(`${API_URL}/orders/${id}`)
};

// Users API
export const usersAPI = {
  getAll: () => axios.get(`${API_URL}/users`),
  getById: (id) => axios.get(`${API_URL}/users/${id}`),
  create: (user) => axios.post(`${API_URL}/users`, user),
  update: (id, user) => axios.put(`${API_URL}/users/${id}`, user),
  delete: (id) => axios.delete(`${API_URL}/users/${id}`)
};
