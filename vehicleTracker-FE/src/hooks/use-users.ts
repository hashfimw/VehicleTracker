import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/services";
import { QUERY_KEYS } from "@/lib/constants";
import { PaginationQuery, CreateUserRequest, UpdateUserRequest } from "@/types";

export const useUsers = (params?: PaginationQuery) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.USERS, params],
    queryFn: () => userService.getUsers(params),
    staleTime: 5000,
  });
};

export const useUser = (id: number) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.USERS, id],
    queryFn: () => userService.getUserById(id),
    enabled: !!id,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserRequest) => userService.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateUserRequest }) =>
      userService.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => userService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS });
    },
  });
};
