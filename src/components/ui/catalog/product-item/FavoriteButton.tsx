// src/components/ui/catalog/product-item/FavoriteButton.tsx
'use client'; // Если это клиентский компонент

import { UserService } from "@/src/assets/styles/services/user.service";
import { useProfile } from "@/src/hooks/useProfile"; // Убедитесь, что useProfile возвращает { profile: IFullUser | undefined, isLoading: boolean }
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FC } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { useAuth } from "@/src/hooks/useAuth";

const FavoriteButton: FC<{ gameId: number }> = ({ gameId }) => {
    const { user } = useAuth();
    const { profile, isLoading: isLoadingProfile } = useProfile(); // Предполагаем, что useProfile возвращает состояние загрузки
    const queryClient = useQueryClient();

    const { mutate, isPending: isToggleFavoritePending } = useMutation({
        mutationFn: () => UserService.toggleFavorite(gameId),
        onSuccess: () => {
            // Инвалидация заставит useProfile получить свежие данные, включая favorites
            queryClient.invalidateQueries({ queryKey: ['get profile'] });
        },
        onError: (err) => { console.error("Error toggling favorite:", err); },
    });

    if (!user) return null;

    // Если профиль еще грузится (начальная загрузка или после инвалидации)
    if (isLoadingProfile && !profile) { // Показываем лоадер, если профиль грузится и еще не определен
        return (
            <button disabled className="text-gray-400" aria-label="Загрузка состояния избранного">
                <AiOutlineHeart size={20} />
            </button>
        );
    }
    
    // Используем optional chaining и nullish coalescing operator для безопасного доступа
    // Это предотвратит ошибку, даже если profile или profile.favorites временно undefined
    const isCurrentlyFavorite = profile?.favorites?.some(fav => fav.game_id === gameId) ?? false;

    return (
        <button 
            onClick={() => mutate()} 
            // Кнопка неактивна, если идет операция toggle ИЛИ профиль не загружен (чтобы избежать действий с неполными данными)
            disabled={isToggleFavoritePending || !profile} 
            className={`transition-all duration-200 ease-in-out hover:scale-110 focus-visible:outline-none transform active:scale-100
                        ${isCurrentlyFavorite ? 'text-red-500 hover:text-red-600' : 'text-gray-600 hover:text-red-500'}`}
            aria-label={isCurrentlyFavorite ? "Удалить из избранного" : "Добавить в избранное"}
            title={isCurrentlyFavorite ? "Удалить из избранного" : "Добавить в избранное"}
        >
            {isCurrentlyFavorite ? <AiFillHeart size={20} /> : <AiOutlineHeart size={20} />}
        </button>
    );
};

export default FavoriteButton;