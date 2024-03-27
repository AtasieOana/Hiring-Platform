import axios from 'axios';

const apiAdminWithoutAdmin = axios.create({
    baseURL: 'http://localhost:8084/',
    headers: {
        'Content-Type': 'application/json',
    },
});

export default apiAdminWithoutAdmin;
