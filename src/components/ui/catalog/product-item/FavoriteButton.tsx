// FavoriteButton.tsx
import { UserService } from "@/src/assets/styles/services/user.service";
import { useProfile } from "@/src/hooks/useProfile";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FC } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { useAuth } from "@/src/hooks/useAuth";

const FavoriteButton: FC<{ gameId: number }> = ({ gameId }) => {
    const { user } = useAuth();
    const { profile } = useProfile();
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: () => UserService.toggleFavorite(gameId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['get profile'] });
        },
        onError: (err) => { console.error("Error toggling favorite:", err); },
    });

    if (!user) return null;

    if (user && !profile && !isPending) {
        return ( <button disabled className="text-gray-400" aria-label="Загрузка состояния избранного"> <AiOutlineHeart size={20} /> </button> );
    }
    
    const isCurrentlyFavorite = profile?.favorites.some(fav => fav.game_id === gameId);

    return (
        <button 
            onClick={() => mutate()} 
            disabled={isPending || !profile}
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