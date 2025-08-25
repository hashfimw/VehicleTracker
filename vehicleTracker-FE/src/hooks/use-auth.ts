import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { authService } from "@/services";
import { useAuthStore } from "@/store";
import { QUERY_KEYS } from "@/lib/constants";
import { LoginRequest } from "@/types";

export const useAuth = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { login: setAuth, logout: clearAuth } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginRequest) => authService.login(credentials),
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken, data.refreshToken);
      navigate("/dashboard");
    },
    onError: (error: any) => {
      console.error("Login failed:", error);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      clearAuth();
      queryClient.clear();
      navigate("/login");
    },
  });

  const { data: currentUser, isLoading } = useQuery({
    queryKey: QUERY_KEYS.AUTH,
    queryFn: () => authService.getCurrentUser(),
    enabled: !!useAuthStore.getState().accessToken,
    retry: false,
  });

  return {
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    currentUser,
    isLoading: loginMutation.isPending || logoutMutation.isPending || isLoading,
    isLoginLoading: loginMutation.isPending,
    loginError: loginMutation.error,
  };
};
