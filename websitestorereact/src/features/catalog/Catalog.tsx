import type {Product} from "../../app/models/Product.ts";
import ProductList from "./ProductList.tsx";

type Props = {
    products: Product[],
}

export default function Catalog({products}: Props) {
    return (
        <>
            <ProductList products={products}/>
        </>
    )
}