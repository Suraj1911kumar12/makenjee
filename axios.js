import axios from 'axios';

const instance = axios.create({
    // baseURL: 'http://0.0.0.0:3030/',
    baseURL: 'http://192.168.68.141:3030/',
    headers: {
        post: {
            "Accept": 'application/json',
            "Content-Type": "application/json",
        },
        get: {
            "Accept": 'application/json',
            "Content-Type": "application/json",
        },
    },
    withCredentials: false,
})

export default instance;
