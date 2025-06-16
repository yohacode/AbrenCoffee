// axios.ts or main axios config file
import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://abrencoffeeproduction-production.up.railway.app', // match your backend
  withCredentials: true,
});

export default instance;
