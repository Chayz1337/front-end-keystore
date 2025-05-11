import axios, { AxiosError, AxiosHeaders, InternalAxiosRequestConfig } from "axios";
import { errorCatch, getContentType } from "./api.helper"; // Убедитесь, что эти хелперы существуют и корректны
import { getAccessToken, removeFromStorage } from "../services/auth/auth.helper"; // Путь к auth.helper
import { AuthService } from "../services/auth/auth.service"; // Путь к auth.service

const axiosOptions = {
    baseURL: process.env.SERVER_URL || 'http://localhost:4200/api', // Добавьте URL по умолчанию, если SERVER_URL не определен
    headers: getContentType()
};

export const axiosClassic = axios.create(axiosOptions);

// Исправлена опечатка: instanse -> instance
export const instanse = axios.create(axiosOptions);

instanse.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const accessToken = getAccessToken();

    if (config.headers && accessToken) {
        (config.headers as AxiosHeaders).set('Authorization', `Bearer ${accessToken}`);
    }

    return config;
});

instanse.interceptors.response.use(
    config => config,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _isRetry?: boolean }; // Добавляем _isRetry в тип

        if (
            originalRequest && // Убедимся, что originalRequest существует
            (error.response?.status === 401 ||
                errorCatch(error) === 'jwt expired' ||
                errorCatch(error) === 'jwt must be provided') &&
            !originalRequest._isRetry
        ) {
            originalRequest._isRetry = true;
            try {
                // Предполагаем, что getNewTokens - это асинхронный метод, который нужно вызвать
                await AuthService.getNewTokens();
                return instanse.request(originalRequest);
            } catch (refreshError) {
                // Если при обновлении токена снова ошибка 'jwt expired' (например, refresh token тоже истек)
                if (errorCatch(refreshError) === 'jwt expired') {
                    removeFromStorage();
                    // Опционально: перенаправить на страницу логина или показать сообщение
                    // window.location.href = '/login';
                }
                // Важно: нужно пробросить ошибку дальше, если это не ошибка обновления токена
                // или если мы хотим, чтобы оригинальный запрос также завершился ошибкой
                return Promise.reject(refreshError); // Пробрасываем ошибку от AuthService.getNewTokens
            }
        }
        // Если это не 401 или уже была попытка повтора, пробрасываем ошибку дальше
        return Promise.reject(error);
    }
);