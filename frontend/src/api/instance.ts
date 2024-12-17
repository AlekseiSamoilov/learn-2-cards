import axios, { AxiosError, AxiosResponse } from 'axios';

const BASE_URL = 'http://localhost:3000/';

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// api.interceptors.request.use((config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
// });

// api.interceptors.response.use(
//     (response: AxiosResponse) => response,
//     (error: AxiosError) => {
//         if (error.response?.status === 401) {
//             localStorage.removeItem('token');
//             window.location.href = '/login';
//         }
//         return Promise.reject(error);
//     }
// );

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        // Для отладки
        console.log('Request headers:', config.headers);
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Обработка ответов
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);



export default api;