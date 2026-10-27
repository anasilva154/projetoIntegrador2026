// Configuração base da API
const API_URL = process.env.EXPO_PUBLIC_API_URL || "https://sua-api.com/api";
const API_TOKEN = process.env.EXPO_PUBLIC_API_TOKEN || "";

/**
 * Função utilitária genérica para chamadas HTTP com autenticação
 */
export async function apiRequest<T = any>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const url = `${API_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

    const headers = new Headers(options.headers || {});

    if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
        headers.set("Content-Type", "application/json");
    }

    if (API_TOKEN) {
        headers.set("Authorization", `Bearer ${API_TOKEN}`);
    }

    const response = await fetch(url, {
        ...options,
        headers,
    });

    if (!response.ok) {
        let errorMessage = `Erro HTTP ${response.status}: ${response.statusText}`;
        try {
            const errorBody = await response.json();
            if (errorBody && errorBody.message) {
                errorMessage = errorBody.message;
            }
        } catch (_) {
            // Se o corpo não for JSON, mantém a mensagem padrão
        }
        throw new Error(errorMessage);
    }

    // Se a resposta não tiver conteúdo (ex: 204 No Content), retorna null
    if (response.status === 204) {
        return null as T;
    }

    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
        return response.json();
    }

    return response.text() as unknown as T;
}

export { API_URL, API_TOKEN };
