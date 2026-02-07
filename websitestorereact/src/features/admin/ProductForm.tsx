import {type CreateProductSchema, createProductSchema} from "../../lib/schemas/screateProductSchema.ts";
import {zodResolver} from "@hookform/resolvers/zod";
import {Box, Button, Grid, Paper, Typography} from "@mui/material";
import {useForm} from "react-hook-form";
import AppTextInput from "../../app/shared/components/AppTextInput.tsx";

export default function ProductForm() {
    const { control, handleSubmit } = useForm({
        // mode: 'onTouched',
        resolver: zodResolver(createProductSchema),
    });
  
    const onSubmit = (data: CreateProductSchema) => {
        console.log(data);
    }
    
    return (
        <Box component={Paper} sx={{p: 4, maxWidth: 'lg', mx: 'auto'}}>
            <Typography variant="h4" sx={{mb: 4}}>
                Product Details
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={3}>
                    <Grid size={12}>
                        <AppTextInput control={control} label="Product Name" name="name"/>
                    </Grid>
                </Grid>
                <Box display="flex" justifyContent="space-between" sx={{mt: 3}}>
                    <Button variant="contained" color='inherit'>Cancel</Button>
                    <Button variant="contained" color='success' type="submit">Submit</Button>
                </Box>
            </form>
        </Box>
    )
}
