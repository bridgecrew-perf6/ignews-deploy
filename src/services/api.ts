import axios from 'axios'

export const api = axios.create({
  baseURL: '/api',
  headers: {
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY}`
  }
})
