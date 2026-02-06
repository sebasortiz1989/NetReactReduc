import { z } from 'zod';

const fileSchema = z.instanceof(File).refine((file) => file.size > 0, {
    message: "A file must be uploaded",
});

export const createProductSchema = z.object({
    name: z.string({error: "Product name is required"}),
    description: z.string({error: "Product description is required"}).min(10, "Description must be at least 10 characters long"),
    price: z.coerce.number({error: "Product price is required"}).min(100, "Price must be at least $1.00"),
    brand: z.string({error: "Product brand is required"}),
    quantity: z.coerce.number({error: "Product quantity is required"}).min(0, "Quantity cannot be negative"),
    type: z.string({error: "Product type is required"}),
    file: fileSchema,
});

export type CreateProductSchema = z.infer<typeof createProductSchema>;