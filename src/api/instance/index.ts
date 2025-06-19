import axios from 'axios';

const Serveraxios = axios.create({
  baseURL: "/api",
  timeout: 600000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default Serveraxios;