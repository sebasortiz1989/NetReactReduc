import {type CreateProductSchema, createProductSchema} from "../../lib/schemas/createProductSchema.ts";
import {zodResolver} from "@hookform/resolvers/zod";
import {Box, Button, Grid, Paper, Typography} from "@mui/material";
import {type FieldValues, useForm} from "react-hook-form";
import AppTextInput from "../../app/shared/components/AppTextInput.tsx";
import {useFetchFiltersQuery} from "../catalog/catalogApi.ts";
import AppSelectInput from "../../app/shared/components/AppSelectInput.tsx";
import AppDropZone from "../../app/shared/components/AppDropZone.tsx";
import type {Product} from "../../app/models/Product.ts";
import {useEffect} from "react";
import {useCreateProductMutation, useUpdateProductMutation} from "./adminApi.ts";
import {handleApiError} from "../../lib/util.ts";

type Props = {
    setEditMode: (editMode: boolean) => void;
    product: Product | null;
    refetch: () => void;
    setSelectedProduct: (value: Product | null) => void;
}

export default function ProductForm({setEditMode, product, refetch, setSelectedProduct}: Props) {
    const { control, handleSubmit, watch, reset, setError, formState: {isSubmitting} } = useForm({
        mode: 'onTouched',
        resolver: zodResolver(createProductSchema),
    });
    
    const watchFile = watch('file');
    const {data} = useFetchFiltersQuery();
    const [createProduct] = useCreateProductMutation();
    const [updateProduct] = useUpdateProductMutation();
    
    useEffect(() => {
        if (product) {
            reset({
                name: product.name,
                brand: product.brand,
                type: product.type,
                price: product.price,
                quantity: product.quantityInStock,
                description: product.description,
            })
        }
        
        return () => {
            if (watchFile) {
                URL.revokeObjectURL(watchFile.preview);
            }
        }
    }, [product, reset, watchFile]);

    const createFormData = (items: FieldValues) => {
        const formData = new FormData();
        for (const key in items) {
            formData.append(key, items[key]);
        }
        return formData;
    }
    
    const onSubmit = async (data: CreateProductSchema) => {
        try {
            const formData = createFormData(data);
            
            if (watchFile)
                formData.append('file', watchFile);
            
            if (product) {
                await updateProduct({id: product.id, data: formData}).unwrap();
            } else {
                await createProduct(formData).unwrap();
            }
            
            setEditMode(false);
            setSelectedProduct(null);
            refetch();
        } catch (error) {
            console.log(error);
            handleApiError<CreateProductSchema>(error, setError, ['brand', 'description', 'file', 'name', 'pictureUrl', 'price', 'quantity', 'type']);
        }
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
                    <Grid size={6}>
                        {data?.brands &&
                            <AppSelectInput
                                items={data.brands}
                                control={control}
                                label="Brand"
                                name="brand"/>}
                    </Grid>
                    <Grid size={6}>
                        {data?.types &&
                            <AppSelectInput
                                items={data.types}
                                control={control}
                                label="Type"
                                name="type"/>}
                    </Grid>
                    <Grid size={6}>
                        <AppTextInput type={"number"} control={control} label="Price in cents" name="price"/>
                    </Grid>
                    <Grid size={6}>
                        <AppTextInput type={"number"} control={control} label="Quantity in stock" name="quantity"/>
                    </Grid>
                    <Grid size={12}>
                        <AppTextInput
                            control={control}
                            multiline
                            rows={4}
                            label="Description"
                            name="description"/>
                    </Grid>
                    <Grid size={12} display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                        <AppDropZone control={control} name="file"/>
                        {watchFile ? (
                            <img src={watchFile.preview} alt="preview of image" style={{maxHeight: 200}}/>
                        ) : product?.pictureUrl && (
                            <img src={product?.pictureUrl} alt="preview of image" style={{maxHeight: 200}}/>
                        )}
                    </Grid>
                </Grid>
                <Box display="flex" justifyContent="space-between" sx={{mt: 3}}>
                    <Button onClick={() => setEditMode(false)} variant="contained" color='inherit'>Cancel</Button>
                    <Button loading={isSubmitting} variant="contained" color='success' type="submit">Submit</Button>
                </Box>
            </form>
        </Box>
    )
}
