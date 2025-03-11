import { IExpense } from '@/types/entities/expense.interface';
import { api_v1_data } from '@/types/api-response.types';
import axios_v1 from '../axios.instances';
import { computeNextPageParam } from '@/lib/query.utils';

export const fetchInfiniteExpenses = async (pageParam: number, category?: string) => {
    const response = await axios_v1.get<api_v1_data<IExpense[]>>('/expenses', {
        params: { page: pageParam, category: category }
    });

    const nextPageParam = computeNextPageParam(response.data.body.length, 10, pageParam);

    return { expenses: response.data.body, nextPageParam };
};

export const getAllExpenses = async () => {
    const response = await axios_v1.get<api_v1_data<IExpense[]>>('/expenses');
    return  response.data
};

export const createExpense = async (data: IExpense) => {
    const response = await axios_v1.put<api_v1_data<IExpense>>('/expenses', data);
    return response.data;
};

export const deleteExpense = async (expenseId: string) => {
    const response = await axios_v1.delete<api_v1_data<IExpense>>(`/expenses/${expenseId}`);
    return response.data;
};