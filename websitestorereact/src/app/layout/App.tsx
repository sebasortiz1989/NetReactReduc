import Catalog from "../../features/catalog/Catalog.tsx";
import {useEffect, useState} from "react";
import type {Product} from "../models/Product.ts";
import {Box, Container, createTheme, CssBaseline, ThemeProvider} from "@mui/material";
import NavBar from "./NavBar.tsx";

function App() {
    const [products, setProducts] = useState<Product[]>([]);
    const [darkMode, setDarkMode] = useState(false);

    const isLocalhost = window.location.hostname === 'localhost';
    const protocol = isLocalhost ? 'https' : 'http';
    const port = isLocalhost ? '5005' : '5010';
    const url = `${protocol}://${window.location.hostname}:${port}/api/products`;

    useEffect(() => {
        fetch(url)
            .then(response => response.json())
            .then(data => setProducts(data));
    }, []);

    const darkModeColor = 'radial-gradient(circle, #1e3aBa, #111B27)';
    const lightModeColor = 'radial-gradient(circle, #baecf9, #f0f9ff)';
    const darkTheme = createTheme({
        palette: {
            mode: 'dark',
            background: {
                default: darkModeColor
            }
        },
    });

    const lightTheme = createTheme({
        palette: {
            mode: 'light',
            background: {
                default: lightModeColor
            }
        },
    });

    return (
        <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
            <CssBaseline />
            <NavBar darkMode={darkMode} setDarkMode = {setDarkMode}/>
            <Box sx={{ 
                minHeight: '100vh',
                background: darkMode ? darkModeColor : lightModeColor}}
                py={6}>
                <Container maxWidth={"xl"} sx={{mt: 8}}>
                    <Catalog products={products}/>
                </Container>
            </Box>
      
        </ThemeProvider>
    )
}

export default App
