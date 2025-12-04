import Catalog from "../../features/catalog/Catalog.tsx";
import {useEffect, useState} from "react";
import type {Product} from "../models/Product.ts";
import {Container} from "@mui/material";
import NavBar from "./NavBar.tsx";

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
    
    return (
        <>
            <NavBar/>
            <Container maxWidth={"xl"} sx={{mt: 12}}>
                <Catalog products={products}/>
            </Container>
        </>

    )
}

export default App
