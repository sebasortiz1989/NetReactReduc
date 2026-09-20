import {Avatar, Box, Divider, Grid, Paper, Stack, Typography} from "@mui/material";
import {EmojiEvents, LocalShipping, Nature, SupportAgent} from "@mui/icons-material";

// Placeholder copy for a fictional store - none of this is real company information.
const stats = [
    {value: '2014', label: 'Founded'},
    {value: '38', label: 'Staff on the mountain'},
    {value: '120k+', label: 'Orders shipped'},
    {value: '4.8/5', label: 'Average rating'},
];

const values = [
    {
        icon: <EmojiEvents/>,
        title: 'Gear we actually ride',
        text: 'Every board, boot and glove in the catalogue gets a season on the mountain before it earns a place on the shelf.'
    },
    {
        icon: <LocalShipping/>,
        title: 'Free delivery over $100',
        text: 'Orders above one hundred dollars ship at no cost, and everything leaves the warehouse within one business day.'
    },
    {
        icon: <SupportAgent/>,
        title: 'Real people on support',
        text: 'No scripts and no phone trees. The person answering your email has fitted more boots than they can count.'
    },
    {
        icon: <Nature/>,
        title: 'Built to last a decade',
        text: 'We stock durable kit and run a repair programme, because the greenest jacket is the one you already own.'
    },
];

const team = [
    {initials: 'MR', name: 'Marta Ruiz', role: 'Founder & buyer'},
    {initials: 'TO', name: 'Tomas Olsen', role: 'Head of workshop'},
    {initials: 'AK', name: 'Aiko Kimura', role: 'Customer support lead'},
    {initials: 'DB', name: 'Diego Braga', role: 'Warehouse manager'},
];

export default function AboutPage() {
    return (
        <Box maxWidth="lg" mx="auto">
            <Typography variant="h3" fontWeight="bold" gutterBottom>
                About Restore
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{mb: 4, maxWidth: 760}}>
                Restore started as a single repair bench at the bottom of a chairlift and grew
                into a shop for people who would rather fix their gear than replace it. We sell
                boards, boots, gloves and hats we trust, and we stand behind every one of them.
            </Typography>

            <Paper sx={{p: 4, borderRadius: 3, mb: 3}}>
                <Grid container spacing={3}>
                    {stats.map(stat => (
                        <Grid size={{xs: 6, md: 3}} key={stat.label}>
                            <Typography variant="h4" fontWeight="bold" color="primary">
                                {stat.value}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {stat.label}
                            </Typography>
                        </Grid>
                    ))}
                </Grid>
            </Paper>

            <Grid container spacing={3} sx={{mb: 3}}>
                {values.map(value => (
                    <Grid size={{xs: 12, md: 6}} key={value.title}>
                        <Paper sx={{p: 3, borderRadius: 3, height: '100%'}}>
                            <Stack direction="row" spacing={2} alignItems="flex-start">
                                <Avatar sx={{bgcolor: 'primary.main'}}>
                                    {value.icon}
                                </Avatar>
                                <Box>
                                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                                        {value.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {value.text}
                                    </Typography>
                                </Box>
                            </Stack>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            <Paper sx={{p: 4, borderRadius: 3}}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                    The team
                </Typography>
                <Divider sx={{mb: 3}}/>
                <Grid container spacing={3}>
                    {team.map(member => (
                        <Grid size={{xs: 12, sm: 6, md: 3}} key={member.name}>
                            <Stack spacing={1} alignItems="center" textAlign="center">
                                <Avatar sx={{width: 72, height: 72, bgcolor: 'secondary.main', fontSize: '1.4rem'}}>
                                    {member.initials}
                                </Avatar>
                                <Typography variant="subtitle1" fontWeight="bold">
                                    {member.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {member.role}
                                </Typography>
                            </Stack>
                        </Grid>
                    ))}
                </Grid>
            </Paper>
        </Box>
    );
}
