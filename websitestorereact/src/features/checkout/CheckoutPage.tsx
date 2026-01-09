import {Grid} from "@mui/material";
import OrderSummary from "../../app/shared/components/OrderSummary.tsx";
import CheckoutStepper from "./CheckoutStepper.tsx";

export default function CheckoutPage() {
    return (
        <Grid container spacing={2}>
            <Grid size={8}>
                <CheckoutStepper/>
            </Grid>
            <Grid size={4}>
                <OrderSummary/>
            </Grid>
        </Grid>
    )
}
