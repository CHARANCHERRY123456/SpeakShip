import axios from 'axios';
import { API_BASE_URL } from '../constants/config';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // if you want to send cookies
});

export default axiosInstance;