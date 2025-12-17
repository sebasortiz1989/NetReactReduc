import { Link } from "react-router-dom";
import type {Product} from "../../app/models/Product.ts";
import {Button, Card, CardActions, CardContent, CardMedia, Typography} from "@mui/material";
import {useAddItemToBasketMutation} from "../basket/basketApi.ts";

type Props ={
    product: Product
}

export default function ProductCard({product}: Props) {
    const [addBasketItem, { isLoading }] = useAddItemToBasketMutation();
    
    return (
        <Card elevation={3} sx={{width: 280, borderRadius: 2, display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
            <CardMedia sx={{height: 240, backgroundSize: 'cover'}} image={product.pictureUrl} title={product.name}/>
            <CardContent>
                <Typography
                    gutterBottom
                    variant='subtitle2'
                    sx={{textTransform: 'uppercase'}}>
                    {product.name}
                </Typography>
                
                <Typography
                    variant="h6"
                    sx={{color: 'secondary.main'}}>
                    ${(product.price / 100).toFixed(2)}
                </Typography>
            </CardContent>

            <CardActions sx={{justifyContent: 'space-between'}}>
                <Button disabled={isLoading} onClick={() => addBasketItem({productId: product.id, quantity: 1})}>
                    Add to cart
                </Button>
                <Button component={Link} to={`/catalog/${product.id}`}>View</Button>
            </CardActions>
        </Card>
    )
}
