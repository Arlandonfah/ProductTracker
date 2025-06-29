import { useState, useCallback } from "react";

interface ApiRequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  headers?: Record<string, string>;
  body?: unknown;
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
          process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";
        const fullUrl = `${baseUrl}${url}`;

        // Get token from localStorage
        const token = localStorage.getItem("adminToken");

        const headers: Record<string, string> = {
          "Content-Type": "application/json",
          ...options.headers,
        };

        // Add Authorization header if token exists
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const body = options.body ? JSON.stringify(options.body) : null;

        const response = await fetch(fullUrl, {
          method: options.method || "GET",
          headers,
          body,
        });

        if (!response.ok) {
          // Handle 401 errors
          if (response.status === 401) {
            localStorage.removeItem("adminToken");
            window.location.href = "/admin";
          }

          let errorMessage = `HTTP error! status: ${response.status}`;
          try {
            const errorData = await response.json();
            errorMessage = errorData.error || errorData.message || errorMessage;
          } catch {
            // If response is not JSON, use default error message
          }

          throw new Error(errorMessage);
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
    const result = await callApi("/api/auth/login", {
      method: "POST",
      body: { username, password },
    });

    // Store the token if login is successful
    if (result && result.token) {
      localStorage.setItem("adminToken", result.token);
    }

    return result;
  };

  return { login, ...state };
};
