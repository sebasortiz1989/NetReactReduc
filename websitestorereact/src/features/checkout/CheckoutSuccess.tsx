import {Box, Button, Container, Divider, Paper, Typography} from "@mui/material";
import {Link, useLocation} from "react-router-dom";
import type {Order} from "../../app/models/Order.ts";
import {cardInfoFormat, currencyFormat, shippingAddressFormat} from "../../lib/util.ts";

export default function CheckoutSuccess() {
    const {state} = useLocation();
    const order = state.data as Order;
    
    if (!order) {
        return (
            <Typography variant="h5">
                No order data found.
            </Typography>
        )
    }

    const addressString = () => {
        const address = order.shippingAddress;
        return shippingAddressFormat(address);
    }

    const paymentString = () => {
        const card = order.paymentSummary;
        return cardInfoFormat(card);
    }
    
    return (
        <Container maxWidth="md">
            <>
                <Typography variant="h4" gutterBottom fontWeight="bold">
                    Thank you for your fake order!
                </Typography>
                <Typography variant="body1" color="textSecondary" gutterBottom>
                    Your Order <strong>#{order.id}</strong> will never be proccessed as this is a fake shop.
                </Typography>
                <Paper elevation={1} sx={{p: 2, mb: 2, display: 'flex', flexDirection: 'column', gap: 1}}>
                    <Box display='flex' justifyContent='space-between'>
                        <Typography variant="body2" color='textSecondary'>
                            Order date
                        </Typography>
                        <Typography variant="body2" fontWeight={'bold'}>
                            {order.orderDate}
                        </Typography>
                    </Box>
                    <Divider/>
                    <Box display='flex' justifyContent='space-between'>
                        <Typography variant="body2" color='textSecondary'>
                            Payment method
                        </Typography>
                        <Typography variant="body2" fontWeight={'bold'}>
                            {paymentString()}
                        </Typography>
                    </Box>
                    <Divider/>
                    <Box display='flex' justifyContent='space-between'>
                        <Typography variant="body2" color='textSecondary'>
                            Shipping address
                        </Typography>
                        <Typography variant="body2" fontWeight={'bold'}>
                            {addressString()}
                        </Typography>
                    </Box>
                    <Divider/>
                    <Box display='flex' justifyContent='space-between'>
                        <Typography variant="body2" color='textSecondary'>
                            Amount
                        </Typography>
                        <Typography variant="body2" fontWeight={'bold'}>
                            {currencyFormat(order.total)}
                        </Typography>
                    </Box>
                </Paper>
                
                <Box display='flex' justifyContent='flex-start' gap={2}>
                    <Button variant="contained" color="primary" component={Link} to={`/orders/${order.id}`}>
                        View Order Details
                    </Button>
                    <Button variant="outlined" color="primary" component={Link} to={`/catalog`}>
                        Continue shopping
                    </Button>
                </Box>
            </>

        </Container>
    )
}