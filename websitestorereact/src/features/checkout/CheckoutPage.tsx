import {Grid, Typography} from "@mui/material";
import OrderSummary from "../../app/shared/components/OrderSummary.tsx";
import CheckoutStepper from "./CheckoutStepper.tsx";
import {loadStripe, type StripeElementsOptions} from "@stripe/stripe-js";
import {Elements} from "@stripe/react-stripe-js";
import {useFetchBasketQuery} from "../basket/basketApi.ts";
import {useEffect, useMemo, useRef} from "react";
import {useCreatePaymentIntentMutation} from "./checkoutApi.ts";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);

export default function CheckoutPage() {
    const {data: basket} = useFetchBasketQuery();
    const [createPaymentIntent, {isLoading}] = useCreatePaymentIntentMutation();
    const created = useRef(false);

    useEffect(() => {
        if (created.current) return;
        createPaymentIntent();
        created.current = true;
    },
        [createPaymentIntent]);
    
    const clientSecret = basket?.clientSecret;
    const options = useMemo<StripeElementsOptions | undefined>(() => {
        if (!clientSecret) return undefined;
        return {
            clientSecret,
        };
    }, [clientSecret]);

    
    return (
        <Grid container spacing={2}>
            <Grid size={8}>
                {!stripePromise || !options || isLoading ? (
                    <Typography variant="h6">Loading Checkout...</Typography>
                ) : (
                    <Elements stripe={stripePromise} options={options}>
                        <CheckoutStepper/>
                    </Elements>
                )}

            </Grid>
            <Grid size={4}>
                <OrderSummary/>
            </Grid>
        </Grid>
    )
}
