import {useState} from "react";
import {Box, Container, createTheme, CssBaseline, ThemeProvider} from "@mui/material";
import NavBar from "./NavBar.tsx";
import { Outlet } from "react-router-dom";

const getInitialDarkMode = () => {
    const storedDarkMode = localStorage.getItem("darkMode");
    return storedDarkMode ? JSON.parse(storedDarkMode) : true;
}

function App() {
    const [darkMode, setDarkMode] = useState(getInitialDarkMode());
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

    const toggleDarkMode = () => {
        console.log("Toggling dark mode:", !darkMode);
        localStorage.setItem("darkMode", JSON.stringify(!darkMode));
        setDarkMode(!darkMode);
    }
    
    return (
        <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
            <CssBaseline />
            <NavBar toggleDarkMode = {toggleDarkMode} darkMode={darkMode}/>
            <Box sx={{ 
                minHeight: '100vh',
                background: darkMode ? darkModeColor : lightModeColor}}
                py={6}>
                <Container maxWidth={"xl"} sx={{mt: 8}}>
                    <Outlet/>
                </Container>
            </Box>
      
        </ThemeProvider>
    )
}

export default App
