import apiClient from "./api";
import { Payment, CreatePaymentDto, UpdatePaymentDto } from "@/types";

const ENDPOINT = "/payments";

export const paymentsService = {
  getAll: async (params?: { condominiumId?: string }): Promise<Payment[]> => {
    const { data } = await apiClient.get(ENDPOINT, { params });
    return data;
  },

  getByUnit: async (unitId: string): Promise<Payment[]> => {
    const { data } = await apiClient.get(`${ENDPOINT}?unitId=${unitId}`);
    return data;
  },

  getById: async (id: string): Promise<Payment> => {
    const { data } = await apiClient.get(`${ENDPOINT}/${id}`);
    return data;
  },

  create: async (dto: CreatePaymentDto): Promise<Payment> => {
    const { data } = await apiClient.post(ENDPOINT, dto);
    return data;
  },

  update: async (id: string, dto: UpdatePaymentDto): Promise<Payment> => {
    const { data } = await apiClient.patch(`${ENDPOINT}/${id}`, dto);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`${ENDPOINT}/${id}`);
  },
};
