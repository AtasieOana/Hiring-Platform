import axios from 'axios';
import {store} from "../redux/reducers/persistReducer";

const apiAdmin = axios.create({
    baseURL: 'http://localhost:8084/',
    headers: {
        'Content-Type': 'application/json',
    },
});

apiAdmin.interceptors.request.use(function (config) {
    const token = store.getState().admin.token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});


export default apiAdmin;
