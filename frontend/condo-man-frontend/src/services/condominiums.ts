import apiClient from './api';
import { Condominium, CreateCondominiumDto, UpdateCondominiumDto } from '@/types';

const ENDPOINT = '/condominiums';

export const condominiumsService = {
  getAll: async (): Promise<Condominium[]> => {
    const { data } = await apiClient.get(ENDPOINT);
    return data;
  },

  getByCompany: async (companyId: string): Promise<Condominium[]> => {
    const { data } = await apiClient.get(`${ENDPOINT}?companyId=${companyId}`);
    return data;
  },

  getById: async (id: string): Promise<Condominium> => {
    const { data } = await apiClient.get(`${ENDPOINT}/${id}`);
    return data;
  },

  create: async (dto: CreateCondominiumDto): Promise<Condominium> => {
    const { data } = await apiClient.post(ENDPOINT, dto);
    return data;
  },

  update: async (id: string, dto: UpdateCondominiumDto): Promise<Condominium> => {
    const { data } = await apiClient.patch(`${ENDPOINT}/${id}`, dto);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`${ENDPOINT}/${id}`);
  },
};
