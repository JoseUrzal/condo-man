import apiClient from './api';
import { Company, CreateCompanyDto, UpdateCompanyDto } from '@/types';

const ENDPOINT = '/companies';

export const companiesService = {
  getAll: async (): Promise<Company[]> => {
    const { data } = await apiClient.get(ENDPOINT);
    return data;
  },

  getById: async (id: string): Promise<Company> => {
    const { data } = await apiClient.get(`${ENDPOINT}/${id}`);
    return data;
  },

  create: async (dto: CreateCompanyDto): Promise<Company> => {
    const { data } = await apiClient.post(ENDPOINT, dto);
    return data;
  },

  update: async (id: string, dto: UpdateCompanyDto): Promise<Company> => {
    const { data } = await apiClient.patch(`${ENDPOINT}/${id}`, dto);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`${ENDPOINT}/${id}`);
  },
};
