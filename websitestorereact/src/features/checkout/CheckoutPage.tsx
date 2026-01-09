import {Grid} from "@mui/material";
import OrderSummary from "../../app/shared/components/OrderSummary.tsx";

export default function CheckoutPage() {
    return (
        <Grid container spacing={2}>
            <Grid size={8}>
                Checkout stepper goes here
            </Grid>
            <Grid size={4}>
                <OrderSummary/>
            </Grid>
        </Grid>
    )
}
