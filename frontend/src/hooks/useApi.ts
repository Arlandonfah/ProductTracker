import { useState, useCallback } from "react";

interface ApiRequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  headers?: Record<string, string>;
  body?: unknown;
  tokenName?: string;
}

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

export const useApi = <T>() => {
  const [apiState, setApiState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const callApi = useCallback(
    async (
      url: string,
      options: ApiRequestOptions = {}
    ): Promise<ApiResponse<T>> => {
      setApiState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const baseUrl =
          process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";
        const apiPrefix = process.env.REACT_APP_API_PREFIX || "";

        // Construction robuste de l'URL
        const normalizedUrl = url.startsWith("/") ? url : `/${url}`;
        const fullUrl = `${baseUrl}${apiPrefix}${normalizedUrl}`;

        // Gestion flexible du token
        const tokenName = options.tokenName || "authToken";
        const token = localStorage.getItem(tokenName);

        const headers: Record<string, string> = {
          "Content-Type": "application/json",
          ...(options.headers || {}),
        };

        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await fetch(fullUrl, {
          method: options.method || "GET",
          headers,
          body: options.body ? JSON.stringify(options.body) : undefined,
        });

        if (!response.ok) {
          // Gestion des erreurs 401 (non autorisé)
          if (response.status === 401) {
            localStorage.removeItem(tokenName);

            // Éviter la boucle de redirection si on est déjà sur /admin
            if (!window.location.pathname.includes("/admin")) {
              window.location.href = "/admin";
            }

            throw new Error("Session expirée. Veuillez vous reconnecter.");
          }

          let errorMessage = `Erreur HTTP: ${response.status}`;
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorData.error || errorMessage;
          } catch (e) {
            // Ignorer si la réponse n'est pas du JSON
          }
          throw new Error(errorMessage);
        }

        const data: T = await response.json();
        setApiState({ data, loading: false, error: null });
        return { data, error: null };
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Une erreur inconnue est survenue";
        setApiState({ data: null, loading: false, error: message });
        return { data: null, error: message };
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

interface AuthResponse {
  token: string;
}

export const useAdminAuth = () => {
  const { callApi, ...state } = useApi<AuthResponse>();

  const login = async (username: string, password: string) => {
    const { data, error } = await callApi("/auth/login", {
      method: "POST",
      body: { username, password },
      tokenName: "adminToken",
    });

    if (data && data.token) {
      localStorage.setItem("adminToken", data.token);
    }

    return { data, error };
  };

  return { login, ...state };
};
