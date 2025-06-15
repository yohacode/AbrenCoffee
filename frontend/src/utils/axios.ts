// axios.ts or main axios config file
import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://abrencoffeeproduction.onrender.com', // match your backend
  withCredentials: true,
});

export default instance;
