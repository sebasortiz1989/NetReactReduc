import type {Product} from "../../app/models/Product.ts";
import ProductList from "./ProductList.tsx";
import {useEffect, useState} from "react";

// interface CatalogProps {
//     products: Product[],
//     addProducts: () => void
// }

export default function Catalog() {
    const [products, setProducts] = useState<Product[]>([]);

    const isLocalhost = window.location.hostname === 'localhost';
    const protocol = isLocalhost ? 'https' : 'http';
    const port = isLocalhost ? '5005' : '5010';
    const url = `${protocol}://${window.location.hostname}:${port}/api/products`;

    useEffect(() => {
        fetch(url)
            .then(response => response.json())
            .then(data => setProducts(data));
    }, []);
    
    return (
        <>
            <ProductList products={products}/>
        </>
    )
}