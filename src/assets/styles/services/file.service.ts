// src/assets/styles/services/file.service.ts
// Убедись, что путь к api.interceptor корректен
import { instanse } from "../api/api.interceptor"; // Примерный путь, исправьте на ваш

// Тип ответа от загрузки аватара
interface AvatarUploadResponse {
  imageUrl: string;
}

// Тип ответа от загрузки изображений игры
type GameImageUploadResponse = string[];

// URL для отображения в UI (публичный) и URL, который может ожидать бэкенд для S3 (внутренний)
const PUBLIC_DISPLAY_URL = process.env.NEXT_PUBLIC_MINIO_ENDPOINT_LOCAL || '';
const S3_BACKEND_EXPECTED_URL_PREFIX = process.env.NEXT_PUBLIC_MINIO_ENDPOINT || '';

/**
 * Извлечение сообщения об ошибке из AxiosError или другого типа ошибки.
 */
function extractErrorMessage(error: any, context: string): string {
  if (error?.response?.data?.message) {
    const message = error.response.data.message;
    return Array.isArray(message) ? message.join('; ') : String(message);
  }
  if (error?.message) {
    return error.message;
  }
  return `Неизвестная ошибка ${context}.`;
}

export const FileService = {
  /**
   * Загрузка одного изображения игры.
   */
  async uploadGameImage(
    file: File,
    onUploadProgress?: (progressEvent: any) => void
  ): Promise<string> {
    const formData = new FormData();
    formData.append('game-images', file);
    console.log(`FileService.uploadGameImage: Загрузка файла: ${file.name}`);

    try {
      const { data: responseDataArray } = await instanse.post<GameImageUploadResponse>(
        '/admin/files/game-images',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress,
        }
      );

      if (Array.isArray(responseDataArray) && responseDataArray.length > 0 && typeof responseDataArray[0] === 'string') {
        let imageUrlFromServer = responseDataArray[0];
        if (S3_BACKEND_EXPECTED_URL_PREFIX && PUBLIC_DISPLAY_URL && imageUrlFromServer.startsWith(S3_BACKEND_EXPECTED_URL_PREFIX)) {
          imageUrlFromServer = imageUrlFromServer.replace(S3_BACKEND_EXPECTED_URL_PREFIX, PUBLIC_DISPLAY_URL);
        }
        console.log(`FileService.uploadGameImage: Получен URL: ${imageUrlFromServer}`);
        return imageUrlFromServer;
      }

      console.error('FileService.uploadGameImage: неверный формат ответа от сервера', responseDataArray);
      throw new Error('Сервер не вернул ожидаемый URL изображения игры.');
    } catch (error: any) {
      const msg = extractErrorMessage(error, 'при загрузке изображения игры');
      console.error(`FileService.uploadGameImage: ${msg}`, error);
      throw new Error(msg);
    }
  },

  /**
   * Удаление изображения игры по URL (административная операция).
   */
  async deleteGameImageByUrl(imageUrlToDelete: string): Promise<void> {
    console.log(`FileService.deleteGameImageByUrl: оригинальный URL для удаления: ${imageUrlToDelete}`);
    let urlForBackend = imageUrlToDelete;

    if (S3_BACKEND_EXPECTED_URL_PREFIX && PUBLIC_DISPLAY_URL && urlForBackend.startsWith(PUBLIC_DISPLAY_URL)) {
      urlForBackend = urlForBackend.replace(PUBLIC_DISPLAY_URL, S3_BACKEND_EXPECTED_URL_PREFIX);
    }

    try {
      await instanse.post(
        '/admin/files/delete-by-url',
        { imageUrl: urlForBackend },
        { headers: { 'Content-Type': 'application/json' } }
      );
      console.log(`FileService.deleteGameImageByUrl: запрос на удаление отправлен для: ${urlForBackend}`);
    } catch (error: any) {
      const msg = extractErrorMessage(error, 'при удалении изображения игры');
      console.error(`FileService.deleteGameImageByUrl: ${msg}`, error);
      throw new Error(msg);
    }
  },

  /**
   * Загрузка аватара пользователя.
   */
  async uploadUserAvatar(
    file: File,
    onUploadProgress?: (progressEvent: any) => void
  ): Promise<string> {
    const formData = new FormData();
    formData.append('avatar', file);
    console.log(`FileService.uploadUserAvatar: Загрузка файла: ${file.name}`);

    try {
      const { data } = await instanse.post<AvatarUploadResponse>(
        '/files/avatar', // Эндпоинт в FileController (бэкенд) для загрузки аватара
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress,
        }
      );

      if (data && typeof data.imageUrl === 'string') {
        let avatarUrlFromServer = data.imageUrl;
        if (S3_BACKEND_EXPECTED_URL_PREFIX && PUBLIC_DISPLAY_URL && avatarUrlFromServer.startsWith(S3_BACKEND_EXPECTED_URL_PREFIX)) {
          avatarUrlFromServer = avatarUrlFromServer.replace(S3_BACKEND_EXPECTED_URL_PREFIX, PUBLIC_DISPLAY_URL);
        }
        console.log(`FileService.uploadUserAvatar: Получен URL: ${avatarUrlFromServer}`);
        return avatarUrlFromServer;
      }

      console.error('FileService.uploadUserAvatar: сервер не вернул корректный imageUrl', data);
      throw new Error('Сервер не вернул URL для аватара.');
    } catch (error: any) {
      const msg = extractErrorMessage(error, 'при загрузке аватара');
      console.error(`FileService.uploadUserAvatar: ${msg}`, error);
      throw new Error(msg);
    }
  },

  /**
   * Запрос на удаление СОБСТВЕННОГО аватара текущего пользователя.
   * Обращается к эндпоинту /files/delete-avatar на бэкенде.
   * Важно: бэкенд /files/delete-avatar должен проверять, что пользователь удаляет СВОЙ аватар.
   */
  async requestOwnAvatarDeletion(currentAvatarUrl: string): Promise<{ message: string }> {
    console.log(`FileService.requestOwnAvatarDeletion: оригинальный URL для удаления: ${currentAvatarUrl}`);
    let urlToSendToBackend = currentAvatarUrl;

    if (S3_BACKEND_EXPECTED_URL_PREFIX && PUBLIC_DISPLAY_URL && urlToSendToBackend.startsWith(PUBLIC_DISPLAY_URL)) {
        urlToSendToBackend = urlToSendToBackend.replace(PUBLIC_DISPLAY_URL, S3_BACKEND_EXPECTED_URL_PREFIX);
        console.log(`FileService.requestOwnAvatarDeletion: URL для бэкенда после замены: ${urlToSendToBackend}`);
    }

    try {
      const { data } = await instanse.post<{ message: string }>(
        '/files/delete-avatar', // <--- ИЗМЕНЕН ЭНДПОИНТ ЗДЕСЬ
        { imageUrl: urlToSendToBackend },
        { headers: { 'Content-Type': 'application/json' } }
        // Предполагается, что 'instanse' автоматически добавляет токен авторизации
      );
      console.log(`FileService.requestOwnAvatarDeletion: ответ от сервера:`, data);
      return data;
    } catch (error: any) {
      const msg = extractErrorMessage(error, 'при запросе на удаление своего аватара');
      console.error(`FileService.requestOwnAvatarDeletion: ${msg}`, error);
      throw new Error(msg);
    }
  },
};