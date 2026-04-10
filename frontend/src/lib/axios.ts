import axios from "axios";

const BASE_URL = import.meta.env.VITE_APP_SERVER;
const baseAxios = axios.create({ baseURL: `${BASE_URL}/api`, withCredentials: true });

export type ErrorResponse = { status: number; message: string };
export type AxiosResponse<T> = { status: number; message: string; data: T; meta?: { page: number; limit: number; total: number } };

baseAxios.interceptors.response.use(
    function (res) {
        return res.data;
    },
    function (error) {
        const status = error?.response?.status || 500;
        const message = error?.response?.data?.message || error?.message || "Something went wrong...";

        return Promise.reject({ status, message });
    },
);

export default baseAxios;
