import { DarkMode, LightMode, ShoppingCart } from "@mui/icons-material";
import {AppBar, Badge, Box, IconButton, List, ListItem, Toolbar, Typography} from "@mui/material";
import {type Dispatch, type SetStateAction} from "react";
import {NavLink} from "react-router-dom";

const midLinks = [
    {title: 'catalog', path: '/catalog'},
    {title: 'about', path: '/about'},
    {title: 'contact', path: '/contact'},
]

const navStyles = {
    color: 'inherit',
    typography: 'h6',
    textDecoration: 'none',
    '&:hover': {
        color: 'grey.500'
    },
    '&.active': {
        color: '#baecf9'
    }
};

const rightLinks = [
    {title: 'login', path: '/login'},
    {title: 'register', path: '/register'},
]

type Props = {
    darkMode: boolean,
    setDarkMode: Dispatch<SetStateAction<boolean>>
}

export default function NavBar({darkMode, setDarkMode}: Props) {
    return (
        <AppBar>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box display='flex' alignItems='center' >
                    <Typography component={NavLink} to="" variant='h6' sx={navStyles}>RE-STORE</Typography>
                    <IconButton onClick={()=>setDarkMode(!darkMode)}>
                        {darkMode ? <DarkMode/> : <LightMode sx={{color: 'yellow'}}/>}
                    </IconButton>
                </Box>
                
                <List sx={{display: 'flex'}}>
                    {midLinks.map(({title, path}) => (
                        <ListItem
                            component={NavLink}
                            to={path}
                            key={path}
                            sx={navStyles}>
                            {title.toUpperCase()}
                        </ListItem>
                    ))}
                </List>

                <Box display='flex' alignItems='center'>
                    <IconButton size='large' sx={{color: 'inherit'}}>
                        <Badge badgeContent={4} color='secondary'>
                            <ShoppingCart/>
                        </Badge>
                    </IconButton>

                    <List sx={{display: 'flex'}}>
                        {rightLinks.map(({title, path}) => (
                            <ListItem component={NavLink} to={path} key={path} sx={navStyles}>
                                {title.toUpperCase()}
                            </ListItem>
                        ))}
                    </List>
                </Box>
                
            </Toolbar>
        </AppBar>
    )
}
