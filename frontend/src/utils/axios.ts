// axios.ts or main axios config file
import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // fixed syntax
  withCredentials: true,
});

export default instance;

