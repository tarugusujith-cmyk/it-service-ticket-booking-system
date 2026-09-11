import axios from 'axios'
export const API_BASE_URL = 'https://it-service-desk-api.onrender.com'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      'Something went wrong while talking to the server.'
    return Promise.reject(new Error(message))
  }
)
