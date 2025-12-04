import axios from 'axios';

const api = axios.create({
  baseURL: 'https://dummyjson.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const loginUser = async (username: string, password: string) => {
  try {
    const response = await api.post('/auth/login', {
      username,
      password,
    });
 
    return response.data; 
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.message || 'Login failed');
    }
    console.error(error);
    throw new Error('An unknown error occurred during login');
  }
};


api.interceptors.request.use(
  (config) => {

    const token = localStorage.getItem('userToken');
    if (token) {
     
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;