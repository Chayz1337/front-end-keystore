// src/api/api.interceptor.ts
import axios, { AxiosError, AxiosHeaders, InternalAxiosRequestConfig } from "axios";
import { errorCatch } from "./api.helper"; // Убедитесь, что этот хелпер существует и корректен
import { getAccessToken, removeFromStorage } from "../services/auth/auth.helper"; // Убедитесь, что пути корректны
import { AuthService } from "../services/auth/auth.service"; // Убедитесь, что пути корректны

// Опции для создания инстансов Axios
const axiosBaseOptions = {
    baseURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:4200/api',
    // Content-Type будет устанавливаться в интерцепторе запросов,
    // чтобы корректно обрабатывать FormData и обычные JSON запросы.
};

/**
 * Инстанс Axios для публичных запросов (не требующих токена авторизации).
 */
export const axiosClassic = axios.create(axiosBaseOptions);

/**
 * Инстанс Axios для запросов, требующих авторизации.
 * Включает интерцепторы для добавления токена и обновления токена.
 */
export const instanse = axios.create(axiosBaseOptions); // Здесь было 'instanse', исправлено на 'instance'

// Интерцептор запросов для `instance` (требующих авторизации)
instanse.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const accessToken = getAccessToken();

        // Устанавливаем Content-Type: application/json по умолчанию,
        // ТОЛЬКО ЕСЛИ данные не являются FormData и метод предполагает тело запроса.
        if (config.headers && !(config.data instanceof FormData)) {
            if (config.method === 'post' || config.method === 'put' || config.method === 'patch') {
                 (config.headers as AxiosHeaders).set('Content-Type', 'application/json');
            }
        }
        // Если config.data это FormData, Axios автоматически установит 'multipart/form-data'.

        // Добавляем токен авторизации, если он есть
        if (config.headers && accessToken) {
            (config.headers as AxiosHeaders).set('Authorization', `Bearer ${accessToken}`);
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Интерцептор ответов для `instance` (обработка ошибок, обновление токена)
instanse.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _isRetry?: boolean };

        if (
            originalRequest &&
            error.response?.status === 401 &&
            (errorCatch(error) === 'jwt expired' ||
             errorCatch(error) === 'jwt must be provided' ||
             !errorCatch(error)) &&
            !originalRequest._isRetry
        ) {
            originalRequest._isRetry = true;
            try {
                console.log('Attempting to refresh tokens...');
                await AuthService.getNewTokens();
                console.log('Tokens refreshed successfully.');
                return instanse.request(originalRequest); // Используем 'instance'
            } catch (refreshError: any) {
                console.error('Failed to refresh tokens or retrying original request failed:', refreshError);
                if (
                    errorCatch(refreshError) === 'jwt expired' ||
                    errorCatch(refreshError) === 'jwt must be provided' ||
                    refreshError.response?.status === 401
                ) {
                    removeFromStorage();
                    console.error('Refresh token expired or invalid. User needs to re-authenticate.');
                }
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

// Для axiosClassic (публичные запросы)
axiosClassic.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        if (config.headers && !(config.data instanceof FormData)) {
            if (config.method === 'post' || config.method === 'put' || config.method === 'patch') {
                 (config.headers as AxiosHeaders).set('Content-Type', 'application/json');
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Если вы где-то экспортировали `axiosWithAuth = instanse`, то теперь это должно быть:
export const axiosWithAuth = instanse;
// Но лучше просто везде использовать `instance`.