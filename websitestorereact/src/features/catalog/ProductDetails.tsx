import {useParams} from "react-router-dom";
import type {Product} from "../../app/models/Product.ts";
import {useEffect, useState} from "react";

export default function ProductDetails() {
    const {id} = useParams();
    const [product, setProduct] = useState<Product | null>(null);

    const isLocalhost = window.location.hostname === 'localhost';
    const protocol = isLocalhost ? 'https' : 'http';
    const port = isLocalhost ? '5005' : '5010';
    const url = `${protocol}://${window.location.hostname}:${port}/api/products/${id}`;
    
    useEffect(() => {
      fetch(url)
          .then(res => res.json())
          .then(data => setProduct(data))
          .catch(err => console.error(err));
    },
        [id, url]);
    
    return (
        <div>{product?.name}</div>
    )
}