import axios from 'axios';
import {store} from "../redux/reducers/persistReducer";

const apiCandidate = axios.create({
    baseURL: 'http://localhost:8082/',
    headers: {
        'Content-Type': 'application/json',
    },
});

apiCandidate.interceptors.request.use(function (config) {
    const token = store.getState().auth.token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});


export default apiCandidate;
