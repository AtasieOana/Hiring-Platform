import axios from 'axios';
import {store} from "../redux/reducers/persistReducer";

const apiToken = axios.create({
    baseURL: 'http://localhost:8081/',
    headers: {
        'Content-Type': 'multipart/form-data',
    },
});

apiToken.interceptors.request.use(function (config) {
    const token = store.getState().auth.token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default apiToken;
