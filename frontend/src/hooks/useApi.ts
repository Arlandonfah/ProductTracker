import { useState, useCallback } from "react";

interface ApiRequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  headers?: Record<string, string>;
  body?: unknown; // Modifié de BodyInit à unknown
}

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export const useApi = <T>() => {
  const [apiState, setApiState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const callApi = useCallback(
    async (url: string, options: ApiRequestOptions = {}): Promise<T | null> => {
      setApiState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const baseUrl =
          process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api";
        const fullUrl = `${baseUrl}${url}`;

        const body = options.body ? JSON.stringify(options.body) : null;

        const response = await fetch(fullUrl, {
          method: options.method || "GET",
          headers: {
            "Content-Type": "application/json",
            ...options.headers,
          },
          body,
          credentials: "include",
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || `HTTP error! status: ${response.status}`
          );
        }

        const data: T = await response.json();
        setApiState({ data, loading: false, error: null });
        return data;
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Erreur inconnue";
        setApiState({ data: null, loading: false, error: message });
        return null;
      }
    },
    []
  );

  return {
    ...apiState,
    callApi,
    reset: () => setApiState({ data: null, loading: false, error: null }),
  };
};

export const useAdminAuth = () => {
  const { callApi, ...state } = useApi<{ token: string }>();

  const login = async (username: string, password: string) => {
    return callApi("/api/auth/login", {
      method: "POST",
      body: { username, password },
    });
  };

  return { login, ...state };
};
