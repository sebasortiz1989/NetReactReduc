import Catalog from "../../features/catalog/Catalog.tsx";
import {useEffect, useState} from "react";
import type {Product} from "../models/Product.ts";
import {Box, Container, createTheme, CssBaseline, ThemeProvider} from "@mui/material";
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
    
    const darkTheme = createTheme({
        palette: {
            mode: 'dark',
            background: {
                default: '#121212'
            }
        },
    });

    const lightTheme = createTheme({
        palette: {
            mode: 'light',
            background: {
                default: '#eaeaea'
            }
        },
    });

    const [darkMode, setDarkMode] = useState(false);
    return (
        <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
            <CssBaseline />
            <NavBar setDarkMode = {setDarkMode}/>
            <Box sx={{ 
                minHeight: '100vh',
                background: darkMode ? '#121212' : '#eaeaea'
            }}>
                <Container maxWidth={"xl"} sx={{mt: 12}}>
                    <Catalog products={products}/>
                </Container>
            </Box>
      
        </ThemeProvider>
    )
}

export default App
