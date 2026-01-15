import {useState} from "react";
import {Box, Button, FormControlLabel, Paper, Step, StepLabel, Stepper} from "@mui/material";
import {AddressElement} from "@stripe/react-stripe-js";
import { CheckBox } from "@mui/icons-material";

const steps = ['Address', 'Payment', 'Review'];

export default function CheckoutStepper() {
    const [activeStep, setActiveStep] = useState(0)
    
    const handleNext = () => {
        setActiveStep(activeStep + 1);
    };
    
    const handleBack = () => {
        if (activeStep === 0) return;
        setActiveStep(activeStep - 1);
    }
    
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
                            mode: 'shipping'
                        }}
                    />
                    <FormControlLabel
                        sx={{display: 'flex', justifyContent: 'end'}}
                        control={<CheckBox />}
                        label="Save as default address"
                    />
                </Box>
                <Box sx={{display: activeStep === 1 ? 'block' : 'none'}}>
                    Payment Form Goes Here
                </Box>
                <Box sx={{display: activeStep === 2 ? 'block' : 'none'}}>
                    Review Order Goes Here
                </Box>
            </Box>
            
            <Box display='flex' paddingTop={2} justifyContent='space-between'>
                <Button onClick={handleBack}>
                    Back
                </Button>
                <Button onClick={handleNext}>
                    Next
                </Button>
            </Box>
        </Paper>
    )
}
