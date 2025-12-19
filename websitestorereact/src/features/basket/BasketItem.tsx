import {Box, Grid, IconButton, Paper, Typography} from "@mui/material";
import type {Item} from "../../app/models/Basket.ts";
import {Add, Close, Remove } from "@mui/icons-material";

type Props = {
    item: Item
}

export default function BasketItem({ item }: Props) {
    return (
        <Paper sx={{
            height: 140,
            borderRadius: 3,
            display: "flex",
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 2,
        }}>
            <Box display={"flex"} alignItems="center">
                <Box component="img" src={item.pictureUrl} alt={item.name} sx={{width: 100, height: 100, objectFit: 'cover', borderRadius: 4, mr: 8, marginLeft: 4}}/>
                <Box display={"flex"} flexDirection="column" gap={1}>
                  <Typography variant="h6">{item.name}</Typography>  
                    <Box display='flex' alignItems='center' gap={3}>
                        <Typography sx={{fontSize: '1.1rem'}}>
                            ${(item.price / 100).toFixed(2)} x {item.quantity}
                        </Typography>
                        <Typography sx={{fontSize: '1.1rem'}} color="primary">
                            ${(item.price / 100 * item.quantity).toFixed(2)}
                        </Typography>      
                    </Box>
                    
                    <Grid container spacing={1} alignItems='center'>
                        <IconButton color='error' size='small' sx={{border: 1, borderRadius: 1, minWidth: 0}}>
                            <Remove/>
                        </IconButton>
                        <Typography variant='h6'>{item.quantity}</Typography>
                        <IconButton color='success' size='small' sx={{border: 1, borderRadius: 1, minWidth: 0}}>
                            <Add/>
                        </IconButton>
                    </Grid>
                </Box>
            </Box>

            <IconButton color='error' size='small' sx={{border: 1, borderRadius: 1, minWidth: 0, alignSelf: 'start', margin: 1}}>
                <Close/>
            </IconButton>
        </Paper>
    )
}
