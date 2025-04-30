import { useCart } from "@/src/hooks/useCart";
import { useActions } from "@/src/hooks/user.actions";
import { IProduct } from "@/src/types/product.interface";
import { FC } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { RiShoppingCartFill, RiShoppingCartLine } from "react-icons/ri";

const AddToCartButton: FC<{ games: IProduct }> = ({ games }) => {
    const { addToCart, removeFromCart } = useActions();
    const { items } = useCart();

    const currentElement = items.find(
        cartItem => cartItem.games.game_id === games.game_id
    )

    return (
        <div>
            <button className="text-primary"
                onClick={() => 
                    currentElement 
                        ? removeFromCart({ id: currentElement.id }) 
                        : addToCart({ games, quantity: 1, price: games.price, })
                }
            >
                {currentElement ? <RiShoppingCartFill />: <RiShoppingCartLine />}
            </button>
        </div>
    );
};

export default AddToCartButton;
