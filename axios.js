import axios from 'axios';

const instance = axios.create({
    // baseURL: 'http://103.174.103.122:3838/',
    baseURL: 'http://192.168.0.103:3030/',
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
