import type {Product} from "../../app/models/Product.ts";
import ProductCard from "./ProductCard.tsx";
import {Box} from "@mui/material";

type Props = {
    products: Product[],
}

export default function ProductList({products}:Props) {
    return (
        <Box sx={{display: "flex", flexWrap: "wrap", gap: 3, justifyContent: "center"}}>
            {products.map((product) => (
                <ProductCard key={product.id} product={product}/>
            ))}
        </Box>
    )
}