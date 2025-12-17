import {useFetchBasketQuery} from "./basketApi.ts";
import {Typography} from "@mui/material";

export default function BasketPage() {
    const {data,  isLoading} = useFetchBasketQuery();
    
    if (isLoading) {
        return <Typography>Loading basket...</Typography>
    }
    
    if (!data) {
        return <Typography variant='h3'>Your basket is empty</Typography>;
    }

    return (
        <div>{data.basketId}</div>
    )
}