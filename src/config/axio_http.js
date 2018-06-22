import axios from 'axios';
import config from 'config.js'

export const HTTP = axios.create({
  baseURL: config.apiUrl,
  headers: {
    Authorization: 'Bearer {token}'
  }
})