import apiClient from "./api";
import { Owner, CreateOwnerDto, UpdateOwnerDto } from "@/types";

const ENDPOINT = "/owners";

export const ownersService = {
  getAll: async (params?: { condominiumId?: string }): Promise<Owner[]> => {
    const { data } = await apiClient.get(ENDPOINT, { params });
    return data;
  },

  getById: async (id: string): Promise<Owner> => {
    const { data } = await apiClient.get(`${ENDPOINT}/${id}`);
    return data;
  },

  create: async (dto: CreateOwnerDto): Promise<Owner> => {
    const { data } = await apiClient.post(ENDPOINT, dto);
    return data;
  },

  update: async (id: string, dto: UpdateOwnerDto): Promise<Owner> => {
    const { data } = await apiClient.patch(`${ENDPOINT}/${id}`, dto);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`${ENDPOINT}/${id}`);
  },
};
