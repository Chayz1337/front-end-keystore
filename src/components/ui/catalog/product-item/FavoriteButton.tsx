import { UserService } from "@/src/assets/styles/services/user.service";
import { useProfile } from "@/src/hooks/useProfile";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FC } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

const FavoriteButton: FC<{ gameId: number }> = ({ gameId }) => {
    const { profile } = useProfile();
    const queryClient = useQueryClient();

    const { mutate } = useMutation({
        mutationFn: () => UserService.toggleFavorite(gameId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['get profile'] });
        },
    });

    if (!profile) return null;

    const isExists = profile?.favorites.some(
        (favorite) => favorite.game_id === gameId
    );

    return (
        <div>
            <button onClick={() => mutate()}>
                {isExists ? <AiFillHeart /> : <AiOutlineHeart />}
            </button>
        </div>
    );
};

export default FavoriteButton;
