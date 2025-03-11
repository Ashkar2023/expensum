import { IUser } from '@/types/entities/user.interface';
import { api_v1_data } from '@/types/api-response.types';
import { axiosPublic } from '../axios.instances';

export const signupUser = async (data: Pick<IUser, "email" | "password">) => {
    const response = await axiosPublic.put<api_v1_data<IUser>>('/users/auth/signup', data);

    return response.data;
};

export const loginUser = async (data: Pick<IUser, "email" | "password">) => {
    const response = await axiosPublic.post<api_v1_data<IUser>>('/users/auth/login', data);

    return response.data;
};

export const logoutUser = async () => {
    const response = await axiosPublic.post('/users/auth/logout');

    return response.data;
};