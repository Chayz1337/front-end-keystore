// src/assets/styles/services/file.service.ts// Убедитесь, что путь к инстансу Axios верный

import { instanse } from "../api/api.interceptor";

export const FileService = {
  async uploadGameImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('game-images', file); // Имя поля, которое ожидает ваш сервер

    try {
      // Ожидаем, что сервер вернет массив URL-ов
      const { data: urls } = await instanse<string[]>({
        url: '/files/game-images',
        method: 'POST',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (Array.isArray(urls) && urls.length > 0 && typeof urls[0] === 'string') {
        let receivedUrl = urls[0]; // Например, "http://minio:9000/game-images/some-file.jpg"

        // ---- НАЧАЛО: Логика замены URL ----
        const internalMinioBaseUrl = 'http://minio:9000'; // Этот URL приходит от бэкенда
        const publicFacingBaseUrl = 'http://localhost:9000'; // Этот URL доступен из браузера

        if (receivedUrl.startsWith(internalMinioBaseUrl)) {
          receivedUrl = receivedUrl.replace(internalMinioBaseUrl, publicFacingBaseUrl);
          console.log(`FileService: URL преобразован с ${internalMinioBaseUrl} на ${publicFacingBaseUrl}. Новый URL: ${receivedUrl}`);
        }
        // ---- КОНЕЦ: Логика замены URL ----

        return receivedUrl; // Возвращаем уже преобразованный URL
      } else {
        console.error('Ответ сервера успешен, но формат данных URL неожиданный:', urls);
        throw new Error('Сервер не вернул URL изображения в ожидаемом формате (ожидался массив URL).');
      }
    } catch (error: any) {
      let errorMessage = 'Неизвестная ошибка при загрузке изображения.';
      if (error.response) {
        if (error.response.data) {
          if (typeof error.response.data.message === 'string') {
            errorMessage = error.response.data.message;
          } else if (typeof error.response.data === 'string') {
            errorMessage = error.response.data;
          } else {
            errorMessage = `Ошибка сервера: ${error.response.status} - ${JSON.stringify(error.response.data)}`;
          }
        } else {
          errorMessage = `Ошибка сервера: ${error.response.status}`;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      console.error('Ошибка загрузки изображения (FileService):', errorMessage, 'Детали:', error.response?.data || error);
      throw new Error(errorMessage);
    }
  },
};
