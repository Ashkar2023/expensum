import { IBudget } from '@/types/entities/budget.interface';
import { api_v1_data } from '@/types/api-response.types';
import axios_v1 from '../axios.instances';

export const createBudget = async (data: IBudget) => {
    const response = await axios_v1.post<api_v1_data<IBudget>>('/budgets', data);
    return response.data;
};

export const editBudget = async (budget_id: string, data: Partial<IBudget>) => {
    const response = await axios_v1.patch<api_v1_data<IBudget>>(`/budgets/${budget_id}`, data);
    return response.data;
};

export const deleteBudget = async (budget_id: string) => {
    const response = await axios_v1.delete<api_v1_data<null>>(`/budgets/${budget_id}`);
    return response.data;
};

export const getCurrentMonthBudget = async () => {
    const response = await axios_v1.get<api_v1_data<IBudget>>('/budgets/current');
    return response.data;
};