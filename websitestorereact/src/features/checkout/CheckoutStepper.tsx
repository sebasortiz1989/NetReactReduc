import {useState} from "react";
import {Box, Button, Checkbox, FormControlLabel, Paper, Step, StepLabel, Stepper, Typography} from "@mui/material";
import {AddressElement, PaymentElement, useElements, useStripe} from "@stripe/react-stripe-js";
import Review from "./Review.tsx";
import {useFetchAddressQuery, useUpdateUserAddressMutation} from "../account/accountApi.ts";
import type {Address} from "../../app/models/User.ts";
import type {ConfirmationToken, StripeAddressElementChangeEvent, StripePaymentElementChangeEvent} from "@stripe/stripe-js";
import {useBasket} from "../../lib/hooks/useBasket.ts";
import {currencyFormat} from "../../lib/util.ts";
import {toast} from "react-toastify";

const steps = ['Address', 'Payment', 'Review'];

export default function CheckoutStepper() {
    const [activeStep, setActiveStep] = useState(0);
    const {data: {name, ...restAddress} = {} as Address, isLoading} = useFetchAddressQuery();
    const [updateAddress] = useUpdateUserAddressMutation();
    const [saveAddressChecked, setSaveAddressChecked] = useState(false);
    const elements = useElements();
    const stripe = useStripe();
    const [addressComplete, setAddressComplete] = useState(false);
    const [paymentComplete, setPaymentComplete] = useState(false);
    const {total} = useBasket();
    const [confirmationToken, setConfirmationToken] = useState<ConfirmationToken | null>(null);

    const handleNext = async () => {
        if (activeStep === 0 && saveAddressChecked && elements) {
            const address = await getStripeAddress();
            if (address) {
                await updateAddress(address);
            }
        }
        if (activeStep === 1) {
            if (!elements || !stripe) return;
            const result = await elements.submit();
            if (result.error) {
                return toast.error(result.error.message);
            }

            const stripeResult = await stripe.createConfirmationToken({elements});
            if (stripeResult.error) {
                return toast.error(stripeResult.error.message);
            }

            setConfirmationToken(stripeResult.confirmationToken);
        }
        
        setActiveStep(activeStep + 1);
    };

    const handleBack = () => {
        if (activeStep === 0) return;
        setActiveStep(activeStep - 1);
    }

    const handleAddressChange = (event: StripeAddressElementChangeEvent) => {
        setAddressComplete(event.complete);
    }

    const handlePaymentChange = (event: StripePaymentElementChangeEvent) => {
        setPaymentComplete(event.complete);
    }
    
    const getStripeAddress = async () => {
        const addressElement = elements?.getElement('address');
        if (!addressElement) {
            return null;
        }

        const {value: {name, address}} = await addressElement.getValue();
        if (name && address) {
            return {...address, name};
        }

        return null;
    }

    if (isLoading)
        return <Typography variant="h6">Loading Checkout...</Typography>;
    
    return (
        <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Stepper activeStep={activeStep} >
                {steps.map((label, index) => {
                    return (
                        <Step key={index}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    );
                })}
            </Stepper>

            <Box sx={{mt: 2}}>
                <Box sx={{display: activeStep === 0 ? 'block' : 'none'}}>
                    <AddressElement
                        options={{
                            mode: 'shipping',
                            defaultValues: {
                                name: name,
                                address: restAddress,
                            }
                        }}
                        onChange={handleAddressChange}
                    />
                    <FormControlLabel
                        sx={{display: 'flex', justifyContent: 'end'}}
                        control={
                            <Checkbox
                                checked={saveAddressChecked}
                                onChange={(event) => setSaveAddressChecked(event.target.checked)}
                            />
                        }
                        label="Save as default address"
                    />
                </Box>
                <Box sx={{display: activeStep === 1 ? 'block' : 'none'}}>
                    <PaymentElement
                        onChange={handlePaymentChange}
                    />
                </Box>
                <Box sx={{display: activeStep === 2 ? 'block' : 'none'}}>
                    <Review confirmationToken={confirmationToken}/>
                </Box>
            </Box>

            <Box display='flex' paddingTop={2} justifyContent='space-between'>
                <Button onClick={handleBack}>
                    Back
                </Button>
                <Button onClick={handleNext} disabled={
                    (activeStep === 0 && !addressComplete) ||
                    (activeStep === 1 && !paymentComplete)
                }>
                    {activeStep === steps.length - 1 && total ? `Pay ${currencyFormat(total)}` : 'Next'}
                </Button>
            </Box>
        </Paper>
    )
}
