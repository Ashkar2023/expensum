import useUserStore from '@/stores/user.store';
import { TokenErrorTypes } from '@/types/token.types';
import axios, { Axios, AxiosError, AxiosRequestConfig } from 'axios';

const axios_v1 = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL + "/v1",
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true
});

export const axiosPublic = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL + "/v1",
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true
});

declare module "axios" {
    export interface AxiosRequestConfig {
        _sent?: boolean
    }
}

axios_v1.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = (error as AxiosError).config;

        if (!originalRequest || !error.response) { // if network crashes happens
            return Promise.reject(error);
        }

        if (error.response.status === 401 && !originalRequest?._sent && TokenErrorTypes.invalid_access_token) {
            originalRequest._sent = true;

            try {
                const response = await axiosPublic.post("/users/auth/r", {}, {
                    withCredentials: true
                });

                if (response.data.success)
                    return axios_v1(originalRequest as AxiosRequestConfig);
            } catch (refreshError) {
                useUserStore.getState().clearUser();
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default axios_v1;