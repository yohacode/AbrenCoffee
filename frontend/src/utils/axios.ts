// axios.ts or main axios config file
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8000', // match your backend
  withCredentials: true,
});

export default instance;
