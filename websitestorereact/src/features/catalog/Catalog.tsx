import type {Product} from "../../app/models/Product.ts";
import ProductList from "./ProductList.tsx";

// interface CatalogProps {
//     products: Product[],
//     addProducts: () => void
// }

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