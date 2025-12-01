import {useEffect, useState} from "react";
import type {Product} from "./Product.ts";

function App() {
    const [products, setProducts] = useState<Product[]>([]);

    const isLocalhost = window.location.hostname === 'localhost';

    // Use 5001 for HTTPS (Localhost)
    // Use 5005 for HTTP (Network/Phone)
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
            <ul>
                {products.map((product, index) => (
                    <li key={index}>
                        {product.name} - ${product.price}
                    </li>
                ))}
            </ul>
            <button onClick={addProducts}>Add Product</button>
        </div>
    )
}

export default App
