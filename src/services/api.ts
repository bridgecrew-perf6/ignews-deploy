import axios from 'axios'

export const api = axios.create({
  baseURL: '/api',
  headers: {
    Authorization: `Bearer ${process.env.STRIPE_API_KEY}`
  }
})
