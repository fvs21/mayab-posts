import axios, { AxiosInstance } from "axios";

const BASE_URL = "http://192.168.100.25:8080/api";

export const apiGuest: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    },
    withCredentials: true
});

export const api: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    },
    withCredentials: true
});

export const apiMultiPart: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "multipart/form-data",
        "Accept": "application/json"
    },
    withCredentials: true
});