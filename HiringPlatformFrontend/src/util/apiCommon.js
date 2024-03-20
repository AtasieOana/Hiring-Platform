import axios from 'axios';
import {store} from "../redux/reducers/persistReducer";

const apiCommon = axios.create({
    baseURL: 'http://localhost:8083/',
    headers: {
        'Content-Type': 'application/json',
    },
});

apiCommon.interceptors.request.use(function (config) {
    const token = store.getState().auth.token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});


export default apiCommon;
