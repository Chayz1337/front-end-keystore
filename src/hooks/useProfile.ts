import { useQuery, UseQueryResult } from "@tanstack/react-query";
// Убедитесь, что пути импорта ниже корректны для вашей структуры проекта
import { UserService } from "@/src/assets/styles/services/user.service";
import { IFullUser } from "@/src/types/user.interface";

// Опционально: тип возвращаемого значения для ясности
interface UseProfileResult {
  profile: IFullUser | undefined;
  isLoading: boolean;
  isError: boolean;
  // можно добавить другие поля из UseQueryResult<IFullUser>, если они нужны, например:
  // error: Error | null;
  // refetch: () => Promise<UseQueryResult<IFullUser>>;
}

export const useProfile = (): UseProfileResult => {
  const { 
    data: profileData, // Переименовываем data в profileData, чтобы не конфликтовать с profile ниже
    isLoading, 
    isError,
    // error, // Можно также вернуть ошибку
    // refetch // и функцию для перезапроса
  } = useQuery<IFullUser, Error>({ // Второй generic тип для useQuery - это тип ошибки
    queryKey: ['get profile'],
    queryFn: async () => {
      const response = await UserService.getProfile();
      if (!response || !response.data) { // Дополнительная проверка
        throw new Error("Failed to fetch profile or data is missing");
      }
      return response.data;
    },

  });

  return { profile: profileData, isLoading, isError /*, error, refetch */ };
};