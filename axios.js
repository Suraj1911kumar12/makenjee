import axios from "axios";

const instance = axios.create({
    baseURL: "http://103.174.102.241:3030/",
  // baseURL: "http://127.0.0.1:3030/",
  headers: {
    post: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    get: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  },
  withCredentials: false,
});

export default instance;
