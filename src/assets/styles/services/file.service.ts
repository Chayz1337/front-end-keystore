// src/services/file.service.ts (или твой путь src/assets/styles/services/file.service.ts)
import { instanse } from "../api/api.interceptor"; // Проверь путь

// Тип ответа от эндпоинта загрузки аватара
interface AvatarUploadResponse {
  filePath: string; // Поле с путем к файлу, которое возвращает твой бэкенд /api/files/avatar
  // Могут быть и другие поля
}

// Тип ответа для загрузки изображений игры (если он другой, оставь как было)
interface GameImageUploadResponse {
  urls: string[]; // Если для game-images бэкенд возвращает массив URL
}


export const FileService = {
  /**
   * Загружает изображение игры.
   */
  async uploadGameImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('game-images', file); // Имя поля, которое ожидает сервер для game-images

    try {
      const { data } = await instanse.post<GameImageUploadResponse>( // Используем GameImageUploadResponse
        '/files/game-images', // Эндпоинт для изображений игр
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      // Обработка ответа для game-images (предполагая, что data.urls это массив)
      if (Array.isArray(data.urls) && data.urls.length > 0 && typeof data.urls[0] === 'string') {
        let receivedUrl = data.urls[0];

        // ---- Логика замены URL для MinIO (если нужна и для game-images) ----
        const internalMinioBaseUrl = 'http://minio:9000';
        const publicFacingBaseUrl = 'http://localhost:9000';
        if (receivedUrl.startsWith(internalMinioBaseUrl)) {
          receivedUrl = receivedUrl.replace(internalMinioBaseUrl, publicFacingBaseUrl);
          console.log(`FileService (GameImage): URL преобразован. Новый URL: ${receivedUrl}`);
        }
        // ---- КОНЕЦ ----
        return receivedUrl;
      } else {
        console.error('uploadGameImage: Ответ сервера успешен, но формат данных URL неожиданный:', data);
        throw new Error('Сервер не вернул URL изображения игры в ожидаемом формате.');
      }
    } catch (error: any) {
      // ... твоя детальная обработка ошибок ...
      let errorMessage = 'Неизвестная ошибка при загрузке изображения игры.';
      if (error.response?.data?.message) errorMessage = error.response.data.message;
      else if (error.message) errorMessage = error.message;
      console.error('Ошибка uploadGameImage (FileService):', errorMessage, 'Детали:', error);
      throw new Error(errorMessage);
    }
  },

  /**
   * Загружает аватар пользователя.
   * @param file Файл аватара
   * @param fieldName Имя поля, под которым файл ожидает бэкенд (по умолчанию 'file')
   */
  async uploadUserAvatar(file: File, fieldName: string = 'file'): Promise<string> {
    const formData = new FormData();
    formData.append(fieldName, file); // Имя поля, которое ожидает ваш сервер (/api/files/avatar)

    try {
      const { data } = await instanse.post<AvatarUploadResponse>(
        '/files/avatar', // Эндпоинт для аватаров (/api/files/avatar - учти префикс /api из instanse)
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      if (data && typeof data.filePath === 'string') {
        let receivedPath = data.filePath;

        // ---- Логика замены URL для MinIO (если нужна и для аватаров) ----
        // Если filePath - это ПОЛНЫЙ URL от MinIO, который нужно заменить
        const internalMinioBaseUrl = 'http://minio:9000';
        const publicFacingBaseUrl = 'http://localhost:9000'; // Твой публичный URL для MinIO
        if (receivedPath.startsWith(internalMinioBaseUrl)) {
          receivedPath = receivedPath.replace(internalMinioBaseUrl, publicFacingBaseUrl);
          console.log(`FileService (UserAvatar): URL преобразован. Новый URL/Path: ${receivedPath}`);
        } else if (!receivedPath.startsWith('http') && !receivedPath.startsWith('/')) {
            // Если это просто имя файла или относительный путь без слеша, и его нужно использовать
            // с публичным URL Minio (если картинки там лежат)
            // receivedPath = `${publicFacingBaseUrl}/имя-бакета-для-аватаров/${receivedPath}`;
            // Это пример, адаптируй под свою структуру.
            // Если `/api/files/avatar` уже возвращает публично доступный путь/URL, то преобразование не нужно.
            // Если он возвращает относительный путь типа /uploads/avatars/file.png, то тоже ОК.
        }
        // ---- КОНЕЦ ----

        return receivedPath; // Возвращаем путь к файлу (или уже полный URL)
      } else {
        console.error('uploadUserAvatar: Ответ сервера успешен, но формат данных filePath неожиданный:', data);
        throw new Error('Сервер не вернул filePath для аватара в ожидаемом формате.');
      }
    } catch (error: any) {
      // ... твоя детальная обработка ошибок ...
      let errorMessage = 'Неизвестная ошибка при загрузке аватара.';
      if (error.response?.data?.message) errorMessage = error.response.data.message;
      else if (error.message) errorMessage = error.message;
      console.error('Ошибка uploadUserAvatar (FileService):', errorMessage, 'Детали:', error);
      throw new Error(errorMessage);
    }
  }
};