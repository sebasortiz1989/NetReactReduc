import type {Product} from "../../app/models/Product.ts";
import {Button} from "@mui/material";
import ProductList from "./ProductList.tsx";

// interface CatalogProps {
//     products: Product[],
//     addProducts: () => void
// }

type Props = {
    products: Product[],
    addProducts: () => void
}

export default function Catalog({products, addProducts}: Props) {
    return (
        <>
            <ProductList products={products}/>
        </>
    )
}