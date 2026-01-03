import apiClient from './api';
import { Unit, CreateUnitDto, UpdateUnitDto } from '@/types';

const ENDPOINT = '/units';

export const unitsService = {
  getAll: async (): Promise<Unit[]> => {
    const { data } = await apiClient.get(ENDPOINT);
    return data;
  },

  getByCondominium: async (condominiumId: string): Promise<Unit[]> => {
    const { data } = await apiClient.get(`${ENDPOINT}?condominiumId=${condominiumId}`);
    return data;
  },

  getById: async (id: string): Promise<Unit> => {
    const { data } = await apiClient.get(`${ENDPOINT}/${id}`);
    return data;
  },

  create: async (dto: CreateUnitDto): Promise<Unit> => {
    const { data } = await apiClient.post(ENDPOINT, dto);
    return data;
  },

  update: async (id: string, dto: UpdateUnitDto): Promise<Unit> => {
    const { data } = await apiClient.patch(`${ENDPOINT}/${id}`, dto);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`${ENDPOINT}/${id}`);
  },

  assignOwner: async (unitId: string, ownerId: string): Promise<void> => {
    await apiClient.post(`${ENDPOINT}/${unitId}/owners/${ownerId}`);
  },

  removeOwner: async (unitId: string, ownerId: string): Promise<void> => {
    await apiClient.delete(`${ENDPOINT}/${unitId}/owners/${ownerId}`);
  },
};
