import { instanse } from "../api/api.interceptor";

// Тип ответа от загрузки аватара
interface AvatarUploadResponse {
  imageUrl: string;
}

// Тип ответа от загрузки изображений игры
type GameImageUploadResponse = string[];

// Публичный URL (для отображения в UI) и внутренний (для запросов на удаление)
const PUBLIC_URL   = process.env.NEXT_PUBLIC_MINIO_ENDPOINT_LOCAL!;
const INTERNAL_URL = process.env.NEXT_PUBLIC_MINIO_ENDPOINT!;

export const FileService = {
  /**
   * Загрузка изображения игры.
   */
  async uploadGameImage(
    file: File,
    onUploadProgress?: (progressEvent: any) => void
  ): Promise<string> {
    const formData = new FormData();
    formData.append('game-images', file);
    console.log(`uploadGameImage: Загрузка файла: ${file.name}`);

    try {
      const { data: responseDataArray } = await instanse.post<GameImageUploadResponse>(
        '/admin/files/game-images',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress,
        }
      );

      if (
        Array.isArray(responseDataArray) &&
        responseDataArray.length > 0 &&
        typeof responseDataArray[0] === 'string'
      ) {
        let imageUrl = responseDataArray[0];
        // internal → public
        if (imageUrl.startsWith(INTERNAL_URL)) {
          imageUrl = imageUrl.replace(INTERNAL_URL, PUBLIC_URL);
        }
        console.log(`uploadGameImage: Получен URL: ${imageUrl}`);
        return imageUrl;
      }

      console.error('uploadGameImage: неверный формат ответа', responseDataArray);
      throw new Error('Сервер не вернул URL изображения игры.');
    } catch (error: any) {
      const msg = extractErrorMessage(error, 'при загрузке изображения игры');
      console.error(`uploadGameImage: ${msg}`, error);
      throw new Error(msg);
    }
  },

  /**
   * Удаление изображения игры по URL.
   */
  async deleteGameImageByUrl(imageUrl: string): Promise<void> {
    console.log(`deleteGameImageByUrl: оригинальный URL: ${imageUrl}`);
    let url = imageUrl;
    // public → internal
    if (url.startsWith(PUBLIC_URL)) {
      url = url.replace(PUBLIC_URL, INTERNAL_URL);
      console.log(`deleteGameImageByUrl: заменён на internal URL: ${url}`);
    }
    try {
      await instanse.post(
        '/admin/files/delete-game-images',
        { imageUrl: url },
        { headers: { 'Content-Type': 'application/json' } }
      );
      console.log(`deleteGameImageByUrl: запрос на удаление отправлен: ${url}`);
    } catch (error: any) {
      const msg = extractErrorMessage(error, 'при удалении изображения игры');
      console.error(`deleteGameImageByUrl: ${msg}`, error);
      throw new Error(msg);
    }
  },

  /**
   * Загрузка аватара пользователя.
   */
  async uploadUserAvatar(
    file: File,
    fieldName: string = 'avatar',
    onUploadProgress?: (progressEvent: any) => void
  ): Promise<string> {
    const formData = new FormData();
    formData.append(fieldName, file);
    console.log(`uploadUserAvatar: Загрузка файла: ${file.name}`);

    try {
      const { data } = await instanse.post<AvatarUploadResponse>(
        '/files/avatar',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress,
        }
      );

      if (data && typeof data.imageUrl === 'string') {
        let avatarUrl = data.imageUrl;
        // internal → public
        if (avatarUrl.startsWith(INTERNAL_URL)) {
          avatarUrl = avatarUrl.replace(INTERNAL_URL, PUBLIC_URL);
        }
        console.log(`uploadUserAvatar: Получен URL: ${avatarUrl}`);
        return avatarUrl;
      }

      console.error('uploadUserAvatar: неверный формат imageUrl', data);
      throw new Error('Сервер не вернул imageUrl для аватара.');
    } catch (error: any) {
      const msg = extractErrorMessage(error, 'при загрузке аватара');
      console.error(`uploadUserAvatar: ${msg}`, error);
      throw new Error(msg);
    }
  },

  /**
   * Удаление аватара пользователя.
   */
  async deleteUserAvatarByUrl(imageUrl: string): Promise<void> {
    console.log(`deleteUserAvatarByUrl: оригинальный URL: ${imageUrl}`);
    let url = imageUrl;
    // public → internal
    if (url.startsWith(PUBLIC_URL)) {
      url = url.replace(PUBLIC_URL, INTERNAL_URL);
      console.log(`deleteUserAvatarByUrl: заменён на internal URL: ${url}`);
    }
    try {
      await instanse.post(
        '/files/delete-avatar',
        { imageUrl: url },
        { headers: { 'Content-Type': 'application/json' } }
      );
      console.log(`deleteUserAvatarByUrl: запрос на удаление отправлен: ${url}`);
    } catch (error: any) {
      const msg = extractErrorMessage(error, 'при удалении аватара');
      console.error(`deleteUserAvatarByUrl: ${msg}`, error);
      throw new Error(msg);
    }
  },
};

/**
 * Извлечение сообщения об ошибке из AxiosError.
 */
function extractErrorMessage(error: any, context: string): string {
  if (error.response?.data?.message) {
    return Array.isArray(error.response.data.message)
      ? error.response.data.message.join('; ')
      : String(error.response.data.message);
  }
  return error.message || `Неизвестная ошибка ${context}.`;
}
