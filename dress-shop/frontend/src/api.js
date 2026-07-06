import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

const api = axios.create({ baseURL: API_URL })

api.interceptors.request.use((config) => {
  const adminToken = localStorage.getItem('adminToken')
  if (adminToken) config.headers.Authorization = `Bearer ${adminToken}`
  return config
})

export const getProducts = (params = {}) =>
  api.get('/products', { params }).then(r => r.data)

export const getNewArrivals = () =>
  api.get('/products/new-arrivals').then(r => r.data)

export const getProduct = (id) =>
  api.get(`/products/${id}`).then(r => r.data)

export const createProduct = (product) =>
  api.post('/products', product).then(r => r.data)

export const updateProduct = (id, product) =>
  api.put(`/products/${id}`, product).then(r => r.data)

export const deleteProduct = (id) =>
  api.delete(`/products/${id}`)

export const uploadImage = (file) => {
  const formData = new FormData()
  formData.append('file', file)
  return api.post('/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data)
}

export const login = (username, password) =>
  api.post('/auth/login', { username, password }).then(r => r.data)

export const customerRegister = (data) =>
  api.post('/customer/register', data).then(r => r.data)

export const customerLogin = (data) =>
  api.post('/customer/login', data).then(r => r.data)

export const placeOrder = (data, userToken) =>
  api.post('/orders', data, { headers: { Authorization: `Bearer ${userToken}` } }).then(r => r.data)

export const getMyOrders = (userToken) =>
  api.get('/orders/my', { headers: { Authorization: `Bearer ${userToken}` } }).then(r => r.data)

export default api
