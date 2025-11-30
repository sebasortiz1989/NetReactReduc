import {useState} from "react";

function App() {
    const [products, setProducts] = useState([
        { name: 'product1', price: 100 },
        { name: 'product2', price: 200 },
        { name: 'product3', price: 300 },
    ]);

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
