import { IProduct } from "@/src/types/product.interface";
import { FC } from "react";
import ProductItem from "./product-item/ProductItem";
import Spinner from "../input/Spinner";
import Heading from "../button/Heading";
import SortDropdown from "./SortDropdown";
import Button from "../button/Button";



 interface ICatalog {
    games: IProduct[]
    isLoading?: boolean
    title?:string
 }
const Catalog: FC<ICatalog> = ({ games, isLoading, title}) => {

    if (isLoading) return <Spinner />



    return (
        <section>
            {title && <Heading classname="mb-5">{title}</Heading>}
            {games.length ? (
                <>
                <div className="grid grid-cols-4 gap-10">
                {games.map((game => <ProductItem key={game.game_id} games={game} />))}
                </div>
                </>
            ) : (
                <div>Тут нет продуктов</div>
            )}
        </section>
    );
};

export default Catalog;
