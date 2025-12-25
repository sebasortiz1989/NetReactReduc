import type {Product} from "../../app/models/Product.ts";
import ProductCard from "./ProductCard.tsx";
import {Grid} from "@mui/material";

type Props = {
    products: Product[],
}

export default function ProductList({products}:Props) {
    return (
        <Grid spacing={3} sx={{display: "flex", flexWrap: "wrap", gap: 3, justifyContent: "center"}}>
            {products.map((product) => (
                <Grid size={3} display='flex' key={product.id}>
                    <ProductCard key={product.id} product={product}/> 
                </Grid>
            ))}
        </Grid>
    )
}