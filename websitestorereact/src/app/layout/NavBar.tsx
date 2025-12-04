import {AppBar, Box, Switch, Toolbar, Typography} from "@mui/material";
import {type Dispatch, type SetStateAction, useState} from "react";

type Props = {
    setDarkMode: Dispatch<SetStateAction<boolean>>
}

export default function NavBar({setDarkMode}: Props) {
    const [darkModeText, setDarkModeText] = useState(false);

    return (
        <AppBar>
            <Toolbar>
                <Typography variant='h6'>RE-STORE</Typography>
                <Box marginLeft='auto' display='flex' alignItems='center'>
                    <Typography variant='h6'>{darkModeText ? 'Dark Mode' : 'Light Mode'}</Typography>
                    <Switch
                        checked={darkModeText}
                        onChange={(e) => {
                            setDarkModeText(e.target.checked);
                            setDarkMode(e.target.checked);
                        }} />   
                </Box>
            </Toolbar>
        </AppBar>
    )
}
