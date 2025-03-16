import { ICategory } from '@/types/entities/category.interface';
import { api_v1_data } from '@/types/api-response.types';
import axios_v1 from '../axios.instances';

export const getAllCategories = async () => {
    const response = await axios_v1.get<api_v1_data<ICategory[]>>('/categories');
    return response.data;
};

export const createCategory = async (data: Pick<ICategory, "name" | "user_id">) => {
    const response = await axios_v1.put<api_v1_data<ICategory>>('/categories', data);
    return response.data;
};

export const editCategory = async (categoryId: string, data: Pick<ICategory,"user_id"| "name">) => {
    const response = await axios_v1.patch<api_v1_data<ICategory>>(`/categories/${categoryId}`, data);
    return response.data;
};

export const deleteCategory = async (categoryId: string) => {
    const response = await axios_v1.delete<api_v1_data<ICategory>>(`/categories/${categoryId}`);
    return response.data;
};