import {useRegisterMutation} from "./accountApi.ts";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {registerSchema, type RegisterSchema} from "../../lib/schemas/registerSchema.ts";
import {Box, Button, Container, Paper, TextField, Typography} from "@mui/material";
import {LockOutlined} from "@mui/icons-material";
import {Link} from "react-router-dom";

export default function RegisterForm() {
    const [registerUser] = useRegisterMutation();
    const {register, handleSubmit, setError, formState: {errors, isValid, isLoading}} = useForm<RegisterSchema>({
        mode: 'onTouched',
        resolver: zodResolver(registerSchema)
    });
    
    const onSubmit = async (data: RegisterSchema) => {
        try {
            await registerUser(data).unwrap();   
        } catch (error) {
            const apiError = error as Error;
            if (apiError.message && typeof apiError.message === 'string') {
                const errorArray = apiError.message.split(',');

                errorArray.forEach((errMsg) => {
                    if (errMsg.includes('Password')) {
                        setError('password', {message: errMsg});
                    } else if (errMsg.includes('Email')) {
                        setError('email', {message: errMsg});
                    }
                });
            }
        }
    }
    
    return (
        <Container maxWidth='sm' sx={{borderRadius: 3}}>
            <Paper sx={{borderRadius: 3}}>
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    marginTop={8}
                    onSubmit={handleSubmit(onSubmit)}
                    component="form"
                    padding={4}
                >
                    <LockOutlined sx={{mt: 3, color: 'secondary.main', fontSize: 40}}/>
                    <Typography variant='h5'>
                        Register
                    </Typography>

                    <Box width="100%" display="flex" flexDirection="column" gap={3} marginY={3}>
                        <TextField
                            fullWidth
                            label="Email"
                            autoFocus {...register('email')}
                            error={!!errors.email}
                            helperText={errors.email?.message} />
                        <TextField
                            fullWidth
                            label="Password"
                            type="password" {...register('password')}
                            error={!!errors.password}
                            helperText={errors.password?.message} />
                        <Button disabled={isLoading || !isValid} variant="contained" type="submit">
                            Register
                        </Button>
                        <Typography sx={{textAlign: 'center'}}>
                            Already have an account?
                            <Typography sx={{marginLeft: 1}} component={Link} to='/login' color='primary'>
                                Sign in here
                            </Typography>
                        </Typography>
                    </Box>
                </Box>
            </Paper>
        </Container>
    )
}
