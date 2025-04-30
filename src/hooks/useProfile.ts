import { useQuery } from "@tanstack/react-query";
import { UserService } from "../assets/styles/services/user.service";
import { IFullUser } from "../types/user.interface";

export const useProfile = () => {
    const { data } = useQuery<IFullUser>({
        queryKey: ['get profile'],  // Ключ запроса
        queryFn: async () => {
            const response = await UserService.getProfile();  // Получаем ответ от сервиса
            return response.data;  // Достаем данные из response
        },
    });

    return { profile: data };
};
