import {Box, Container, createTheme, CssBaseline, ThemeProvider} from "@mui/material";
import NavBar from "./NavBar.tsx";
import {Outlet, ScrollRestoration} from "react-router-dom";
import {useAppSelector} from "../store/store.ts";

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

function App() {
    const {darkMode} = useAppSelector(state => state.ui);
    
    return (
        <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
            <ScrollRestoration/>
            <CssBaseline />
            <NavBar />
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
