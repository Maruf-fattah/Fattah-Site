import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../services/api';
import { Patient, PaginatedResponse } from '@hospital-system/shared';

export const usePatients = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ['patients', page, limit],
    queryFn: async () => {
      const response = await apiClient.get<PaginatedResponse<Patient>>(
        `/patients?page=${page}&limit=${limit}`
      );
      return response.data;
    },
  });
};

export const usePatient = (patientId: string | undefined) => {
  return useQuery({
    queryKey: ['patient', patientId],
    queryFn: async () => {
      const response = await apiClient.get<Patient>(`/patients/${patientId}`);
      return response.data;
    },
    enabled: !!patientId,
  });
};

export const useCreatePatient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Patient>) => {
      const response = await apiClient.post<Patient>('/patients', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
  });
};

export const useUpdatePatient = (patientId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Patient>) => {
      const response = await apiClient.put<Patient>(`/patients/${patientId}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patient', patientId] });
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
  });
};
