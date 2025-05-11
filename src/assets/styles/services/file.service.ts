// src/services/file.service.ts (или ваш путь src/assets/styles/services/file.service.ts)
import { instanse } from "../api/api.interceptor"; // ИСПРАВЛЕНО: instanse -> instanse. Проверьте путь!

// Тип ответа от эндпоинта загрузки аватара
interface AvatarUploadResponse {
  filePath: string; // Поле с путем к файлу, которое возвращает твой бэкенд /files/avatar
  // Могут быть и другие поля
}

// Тип ответа для загрузки изображений игры.
// Судя по ошибке "Array(1)", сервер возвращает массив URL-строк напрямую.
type GameImageUploadResponse = string[];


export const FileService = {
  /**
   * Загружает изображение игры.
   * @param file - Файл изображения для загрузки.
   * @param onUploadProgress - Опциональный callback для отслеживания прогресса загрузки.
   * @returns Promise, который разрешается URL-строкой загруженного изображения.
   */
  async uploadGameImage(
    file: File,
    onUploadProgress?: (progressEvent: any) => void // Добавлен для AddGameModal
  ): Promise<string> {
    const formData = new FormData();
    // Ключ 'image' или 'file' более стандартный, но если ваш сервер ожидает 'game-images', оставьте так.
    // Часто сервер ожидает один и тот же ключ для одиночных файлов, например 'file'.
    formData.append('game-images', file); // Имя поля, которое ожидает сервер для game-images

    console.log(`FileService.uploadGameImage: Загрузка файла: ${file.name}`);

    try {
      // ИСПРАВЛЕНО: используется instanse
      // ИСПРАВЛЕНО: тип ответа GameImageUploadResponse (string[])
      const { data: responseDataArray } = await instanse.post<GameImageUploadResponse>(
        '/files/game-images', // Эндпоинт для изображений игр. Убедитесь, что он использует /admin префикс, если защищен
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: onUploadProgress, // Передаем callback для прогресса
        }
      );

      console.log('FileService.uploadGameImage: Ответ сервера:', responseDataArray);

      // Обработка ответа для game-images
      // Сервер возвращает массив строк: ["url1.jpg", "url2.png"]
      // Даже если загружен один файл, это будет массив с одним элементом: ["url1.jpg"]
      if (Array.isArray(responseDataArray) && responseDataArray.length > 0 && typeof responseDataArray[0] === 'string') {
        let receivedUrl = responseDataArray[0]; // Берем первый URL из массива

        // ---- Логика замены URL для MinIO (если нужна и для game-images) ----
        const internalMinioBaseUrl = 'http://minio:9000'; // Ваш внутренний URL MinIO
        const publicFacingBaseUrl = 'http://localhost:9000'; // Ваш публичный URL MinIO
        if (receivedUrl.startsWith(internalMinioBaseUrl)) {
          receivedUrl = receivedUrl.replace(internalMinioBaseUrl, publicFacingBaseUrl);
          console.log(`FileService (GameImage): URL преобразован. Новый URL: ${receivedUrl}`);
        }
        // ---- КОНЕЦ ----

        console.log(`FileService.uploadGameImage: URL извлечен: ${receivedUrl}`);
        return receivedUrl;
      } else {
        console.error('FileService.uploadGameImage: Ответ сервера успешен, но формат данных URL неожиданный (ожидался массив строк с хотя бы одним URL):', responseDataArray);
        throw new Error('Сервер не вернул URL изображения игры в ожидаемом формате.');
      }
    } catch (error: any) {
      let errorMessage = 'Неизвестная ошибка при загрузке изображения игры.';
      if (error.response?.data?.message) {
        errorMessage = Array.isArray(error.response.data.message)
          ? error.response.data.message.join('; ')
          : String(error.response.data.message);
      } else if (error.message) {
        errorMessage = error.message;
      }
      console.error(`FileService.uploadGameImage: Ошибка при загрузке файла ${file.name}:`, errorMessage, 'Детали:', error);
      throw new Error(errorMessage);
    }
  },

  /**
   * Загружает аватар пользователя.
   * @param file Файл аватара
   * @param fieldName Имя поля, под которым файл ожидает бэкенд (по умолчанию 'file')
   * @param onUploadProgress - Опциональный callback для отслеживания прогресса загрузки.
   * @returns Promise, который разрешается URL-строкой загруженного аватара.
   */
  async uploadUserAvatar(
    file: File,
    fieldName: string = 'file', // 'file' - частый стандарт для имени поля
    onUploadProgress?: (progressEvent: any) => void
  ): Promise<string> {
    const formData = new FormData();
    formData.append(fieldName, file);

    console.log(`FileService.uploadUserAvatar: Загрузка файла: ${file.name}`);

    try {
      // ИСПРАВЛЕНО: используется instanse
      const { data } = await instanse.post<AvatarUploadResponse>(
        '/files/avatar', // Эндпоинт для аватаров. Убедитесь, что он использует /admin префикс, если защищен
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: onUploadProgress,
        }
      );

      console.log('FileService.uploadUserAvatar: Ответ сервера:', data);

      if (data && typeof data.filePath === 'string') {
        let receivedPath = data.filePath;

        // ---- Логика замены URL для MinIO (если нужна и для аватаров) ----
        const internalMinioBaseUrl = 'http://minio:9000';
        const publicFacingBaseUrl = 'http://localhost:9000';
        if (receivedPath.startsWith(internalMinioBaseUrl)) {
          receivedPath = receivedPath.replace(internalMinioBaseUrl, publicFacingBaseUrl);
          console.log(`FileService (UserAvatar): URL/Path преобразован. Новый URL/Path: ${receivedPath}`);
        }
        // Пример: если filePath это только имя файла, и вам нужно сформировать полный URL
        // else if (!receivedPath.startsWith('http') && !receivedPath.startsWith('/')) {
        //   const bucketName = 'user-avatars'; // Замените на имя вашего бакета
        //   receivedPath = `${publicFacingBaseUrl}/${bucketName}/${receivedPath}`;
        //   console.log(`FileService (UserAvatar): Относительный путь преобразован в полный URL: ${receivedPath}`);
        // }
        // ---- КОНЕЦ ----

        console.log(`FileService.uploadUserAvatar: URL/Path извлечен: ${receivedPath}`);
        return receivedPath;
      } else {
        console.error('FileService.uploadUserAvatar: Ответ сервера успешен, но формат данных filePath неожиданный (ожидался объект с filePath: string):', data);
        throw new Error('Сервер не вернул filePath для аватара в ожидаемом формате.');
      }
    } catch (error: any) {
      let errorMessage = 'Неизвестная ошибка при загрузке аватара.';
      if (error.response?.data?.message) {
        errorMessage = Array.isArray(error.response.data.message)
          ? error.response.data.message.join('; ')
          : String(error.response.data.message);
      } else if (error.message) {
        errorMessage = error.message;
      }
      console.error(`FileService.uploadUserAvatar: Ошибка при загрузке файла ${file.name}:`, errorMessage, 'Детали:', error);
      throw new Error(errorMessage);
    }
  }
};