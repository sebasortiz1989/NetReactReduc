import {z} from "zod";

const passwordValidation = /^(?=.{6,10}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).*$/

export const registerSchema = z.object(
    {
        email: z.string().email(),
        password: z.string().regex(passwordValidation, {
            message: 'Password must be 6-10 characters and include at least one uppercase letter, one lowercase letter, one number, and one special character.'
        }),
    }
);

export type RegisterSchema = z.infer<typeof registerSchema>