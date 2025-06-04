import { useQuery, UseQueryResult, QueryKey } from "@tanstack/react-query"; // QueryKey для типа ключа
import { UserService } from "@/src/assets/styles/services/user.service";
import { IFullUser } from "@/src/types/user.interface";

interface UseProfileResult {
  profile: IFullUser | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null; // Добавим для полноты
  refetch: () => Promise<UseQueryResult<IFullUser, Error>>; // Добавим для полноты
}

const PROFILE_QUERY_KEY: QueryKey = ['get profile']; // Лучше вынести ключ в константу

export const useProfile = (): UseProfileResult => {
  const { 
    data: profile, // Сразу переименуем data в profile
    isLoading, 
    isError,
    error,    // Извлекаем ошибку
    refetch,  // Извлекаем refetch
  } = useQuery<
    IFullUser,    // TQueryFnData: Тип данных, возвращаемых queryFn
    Error,        // TError: Тип ошибки
    IFullUser,    // TData: Тип данных, которые будут в 'data' (здесь profile)
    QueryKey      // TQueryKey: Тип ключа (['get profile'])
  >({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: async (): Promise<IFullUser> => { // Явно указываем, что queryFn возвращает Promise<IFullUser>
      const fetchedProfile = await UserService.getProfile();
      // Если UserService.getProfile() может вернуть null/undefined при "успехе", то нужна проверка.
      // Но обычно сервисы либо возвращают данные, либо бросают ошибку.
      if (!fetchedProfile) {
           console.warn("useProfile: UserService.getProfile() did not return data.");
           throw new Error("Profile data could not be fetched or is empty.");
      }
      return fetchedProfile;
    },
    // Опциональные настройки для useQuery:
    // staleTime: 1000 * 60 * 5, // 5 минут
    // enabled: !!user, // Например, если запрос зависит от наличия пользователя в useAuth()
    // retry: 1, // Попробовать еще 1 раз при ошибке
  });

  return { profile, isLoading, isError, error, refetch };
};