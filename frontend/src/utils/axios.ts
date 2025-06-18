// axios.ts or main axios config file
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://127.0.0.1:8000', // match your backend
  withCredentials: true,
});

export default instance;
