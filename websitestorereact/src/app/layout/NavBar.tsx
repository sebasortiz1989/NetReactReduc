import { DarkMode, LightMode } from "@mui/icons-material";
import {AppBar, Box, IconButton, Toolbar, Typography} from "@mui/material";
import {type Dispatch, type SetStateAction} from "react";

type Props = {
    darkMode: boolean,
    setDarkMode: Dispatch<SetStateAction<boolean>>
}

export default function NavBar({darkMode, setDarkMode}: Props) {
    return (
        <AppBar>
            <Toolbar>
                <Typography variant='h6'>RE-STORE</Typography>
                <Box marginLeft='auto' display='flex' alignItems='center'>
                    <IconButton onClick={()=>setDarkMode(!darkMode)}>
                        {darkMode ? <DarkMode/> : <LightMode sx={{color: 'white'}}/>}
                    </IconButton>
                    {/*<Switch*/}
                    {/*    checked={darkMode}*/}
                    {/*    onChange={(e) => {*/}
                    {/*        setDarkMode(e.target.checked);*/}
                    {/*    }} />*/}
                </Box>
            </Toolbar>
        </AppBar>
    )
}
