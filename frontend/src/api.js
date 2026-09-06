import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

const client = axios.create({ baseURL: API });

export const getConfig = () => client.get("/config").then((r) => r.data);
export const getProducts = (params) => client.get("/products", { params }).then((r) => r.data);
export const getCart = (cartId) => client.get(`/cart/${cartId}`).then((r) => r.data);
export const addToCart = (cartId, product_id, quantity = 1) =>
  client.post(`/cart/${cartId}/items`, { product_id, quantity }).then((r) => r.data);
export const updateCartItem = (cartId, product_id, quantity) =>
  client.put(`/cart/${cartId}/items/${product_id}`, { quantity }).then((r) => r.data);
export const removeCartItem = (cartId, product_id) =>
  client.delete(`/cart/${cartId}/items/${product_id}`).then((r) => r.data);
export const clearCart = (cartId) => client.delete(`/cart/${cartId}`).then((r) => r.data);
export const subscribeNewsletter = (email) => client.post("/newsletter", { email }).then((r) => r.data);
export const createOrder = (payload) => client.post("/orders", payload).then((r) => r.data);
export const trackOrder = (q) => client.get("/orders/track", { params: { q } }).then((r) => r.data);

export const inr = (n) => "₹" + Number(n || 0).toLocaleString("en-IN");
