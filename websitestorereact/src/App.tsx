import {useEffect, useState} from "react";

function App() {
    const [products, setProducts] = useState<{name: string, price: number}[]>([]);

    const isLocalhost = window.location.hostname === 'localhost';

    // Use 5001 for HTTPS (Localhost)
    // Use 5005 for HTTP (Network/Phone)
    const protocol = isLocalhost ? 'https' : 'http';
    const port = isLocalhost ? '5000' : '5005';
    const url = `${protocol}://${window.location.hostname}:${port}/api/products`;

    useEffect(() => {
        fetch(url)
            .then(response => response.json())
            .then(data => setProducts(data));
    }, []);
    
    const addProducts = () => {
        setProducts(prevState => [...prevState,
            { 
                name: 'product' + (prevState.length + 1),
                price: (prevState.length * 100) + 100
            }]);
    }
    
    return (
        <div style={{fontSize: '1.6rem'}}>
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
