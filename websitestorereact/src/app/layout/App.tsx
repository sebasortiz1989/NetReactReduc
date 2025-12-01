import Catalog from "../../features/catalog/Catalog.tsx";
import {useEffect, useState} from "react";
import type {Product} from "../models/Product.ts";

function App() {
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

    const addProducts = () => {
        setProducts(prevState => [...prevState,
            {
                id: prevState.length + 1,
                name: 'product' + (prevState.length + 1),
                price: (prevState.length * 100) + 100,
                quantityInStock: 100,
                description: 'test',
                pictureUrl: 'https//picsum.photo/200',
                type: 'test',
                brand: 'test'
            }]);
    }
    
    return (
        <div style={{fontSize: '1.2rem'}}>
            <h1 style={{color: 'red'}}>Re-store</h1>
            <Catalog products={products} addProducts={addProducts}/>
        </div>
    )
}

export default App
