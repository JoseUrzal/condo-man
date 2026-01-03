import apiClient from './api';
import { User, CreateUserDto, UpdateUserDto } from '@/types';

const ENDPOINT = '/users';

export const usersService = {
  getAll: async (): Promise<User[]> => {
    const { data } = await apiClient.get(ENDPOINT);
    return data;
  },

  getByCompany: async (companyId: string): Promise<User[]> => {
    const { data } = await apiClient.get(`${ENDPOINT}?companyId=${companyId}`);
    return data;
  },

  getById: async (id: string): Promise<User> => {
    const { data } = await apiClient.get(`${ENDPOINT}/${id}`);
    return data;
  },

  create: async (dto: CreateUserDto): Promise<User> => {
    const { data } = await apiClient.post(ENDPOINT, dto);
    return data;
  },

  update: async (id: string, dto: UpdateUserDto): Promise<User> => {
    const { data } = await apiClient.patch(`${ENDPOINT}/${id}`, dto);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`${ENDPOINT}/${id}`);
  },
};
