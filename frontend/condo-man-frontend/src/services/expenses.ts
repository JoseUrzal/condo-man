import apiClient from "./api";
import { Expense, CreateExpenseDto, UpdateExpenseDto } from "@/types";

const ENDPOINT = "/expenses";

export const expensesService = {
  getAll: async (params?: { condominiumId?: string }): Promise<Expense[]> => {
    const { data } = await apiClient.get(ENDPOINT, { params });
    return data;
  },

  getByCondominium: async (condominiumId: string): Promise<Expense[]> => {
    const { data } = await apiClient.get(
      `${ENDPOINT}?condominiumId=${condominiumId}`
    );
    return data;
  },

  getById: async (id: string): Promise<Expense> => {
    const { data } = await apiClient.get(`${ENDPOINT}/${id}`);
    return data;
  },

  create: async (dto: CreateExpenseDto): Promise<Expense> => {
    const { data } = await apiClient.post(ENDPOINT, dto);
    return data;
  },

  update: async (id: string, dto: UpdateExpenseDto): Promise<Expense> => {
    const { data } = await apiClient.patch(`${ENDPOINT}/${id}`, dto);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`${ENDPOINT}/${id}`);
  },
};
