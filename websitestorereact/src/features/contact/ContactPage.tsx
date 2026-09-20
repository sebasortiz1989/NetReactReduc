import {Box, Button, Divider, Grid, Link as MuiLink, Paper, Stack, Typography} from "@mui/material";
import {AccessTime, Email, LocationOn, Phone, Send} from "@mui/icons-material";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {toast} from "react-toastify";
import {contactSchema, type ContactSchema} from "../../lib/schemas/contactSchema.ts";
import AppTextInput from "../../app/shared/components/AppTextInput.tsx";

// Placeholder details for a fictional store - not real contact information.
const details = [
    {
        icon: <LocationOn color="primary"/>,
        label: 'Address',
        lines: ['142 Powder Ridge Road', 'Snowview, CO 80424', 'United States']
    },
    {
        icon: <Email color="primary"/>,
        label: 'Email',
        lines: ['support@restore.example', 'sales@restore.example']
    },
    {
        icon: <Phone color="primary"/>,
        label: 'Phone',
        lines: ['+1 (555) 0142-8800', 'Mon-Fri only']
    },
    {
        icon: <AccessTime color="primary"/>,
        label: 'Opening hours',
        lines: ['Mon - Fri: 09:00 - 18:00', 'Saturday: 10:00 - 16:00', 'Sunday: closed']
    },
];

export default function ContactPage() {
    // Empty strings rather than undefined, so an untouched field reports the
    // schema's own message instead of Zod's "expected string, received undefined".
    const {control, handleSubmit, reset, formState: {isSubmitting}} = useForm<ContactSchema>({
        mode: 'onTouched',
        resolver: zodResolver(contactSchema),
        defaultValues: {name: '', email: '', subject: '', message: ''}
    });

    // There is no contact endpoint on the API, so this only acknowledges locally.
    const onSubmit = (data: ContactSchema) => {
        toast.success(`Thanks ${data.name}, we will reply to ${data.email} shortly!`);
        reset();
    };

    return (
        <Box maxWidth="lg" mx="auto">
            <Typography variant="h3" fontWeight="bold" gutterBottom>
                Contact us
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{mb: 4}}>
                Questions about an order, a product or a return? Send us a message and the
                team will get back to you within one business day.
            </Typography>

            <Grid container spacing={3} alignItems="stretch">
                <Grid size={{xs: 12, md: 5}}>
                    <Paper sx={{p: 4, borderRadius: 3, height: '100%'}}>
                        <Typography variant="h5" fontWeight="bold" gutterBottom>
                            Get in touch
                        </Typography>
                        <Divider sx={{mb: 3}}/>
                        <Stack spacing={3}>
                            {details.map(detail => (
                                <Box key={detail.label} display="flex" gap={2} alignItems="flex-start">
                                    {detail.icon}
                                    <Box>
                                        <Typography variant="subtitle2" color="text.secondary">
                                            {detail.label}
                                        </Typography>
                                        {detail.lines.map(line => (
                                            <Typography key={line} variant="body1">
                                                {line}
                                            </Typography>
                                        ))}
                                    </Box>
                                </Box>
                            ))}
                        </Stack>
                        <Divider sx={{my: 3}}/>
                        <Typography variant="body2" color="text.secondary">
                            Prefer the FAQ? Most answers live in our{' '}
                            <MuiLink href="#" underline="hover">help centre</MuiLink>.
                        </Typography>
                    </Paper>
                </Grid>

                <Grid size={{xs: 12, md: 7}}>
                    <Paper sx={{p: 4, borderRadius: 3, height: '100%'}}>
                        <Typography variant="h5" fontWeight="bold" gutterBottom>
                            Send us a message
                        </Typography>
                        <Divider sx={{mb: 3}}/>
                        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                            <Grid container spacing={3}>
                                <Grid size={{xs: 12, sm: 6}}>
                                    <AppTextInput control={control} label="Your name" name="name"/>
                                </Grid>
                                <Grid size={{xs: 12, sm: 6}}>
                                    <AppTextInput control={control} label="Your email" name="email"/>
                                </Grid>
                                <Grid size={12}>
                                    <AppTextInput control={control} label="Subject" name="subject"/>
                                </Grid>
                                <Grid size={12}>
                                    <AppTextInput
                                        control={control}
                                        label="Message"
                                        name="message"
                                        multiline
                                        rows={5}/>
                                </Grid>
                            </Grid>
                            <Box display="flex" justifyContent="flex-end" sx={{mt: 3}}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    size="large"
                                    startIcon={<Send/>}
                                    loading={isSubmitting}>
                                    Send message
                                </Button>
                            </Box>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}
