import {useFetchBasketQuery} from "../basket/basketApi.ts";
import {Box, Divider, Table, TableBody, TableCell, TableRow, Typography} from "@mui/material";
import {currencyFormat} from "../../lib/util.ts";
import type {ConfirmationToken} from "@stripe/stripe-js";
import {useBasket} from "../../lib/hooks/useBasket.ts";

type Props = {
    confirmationToken: ConfirmationToken | null;
}

export default function Review({confirmationToken} : Props) {
    const {basket} = useBasket();
    const addressString = () => {
        if (!confirmationToken?.shipping) return '';
        const {name, address} = confirmationToken.shipping;
        return `${name}, ${address?.line1}, ${address?.line2 ? address.line2 + ', ' : ''}${address?.city}, ${address?.state ? address.state + ', ' : ''}${address?.postal_code}, ${address?.country}`;
    }
    
    const paymentString = () => {
        if (!confirmationToken?.payment_method_preview.card) return '';
        const {card} = confirmationToken.payment_method_preview;
        if (!card) return '';
        return `${card.brand.toLocaleUpperCase()}, **** **** **** ${card.last4}, exp: ${card.exp_month}/${card.exp_year}`;
    }
    
    return (
        <div>
            <Box mt={4} width='100%'>
                <Typography variant='h6' fontWeight='bold'>
                    Billing and Delivery Information
                </Typography>
                <dl>
                    <Typography component='dt' fontWeight='medium'>
                        Shipping Address
                    </Typography>
                    <Typography component='dd' mt={1} color='textSecondary'>
                        {addressString()}
                    </Typography>

                    <Typography component='dt' fontWeight='medium'>
                        Payment Details
                    </Typography>
                    <Typography component='dd' mt={1} color='textSecondary'>
                        {paymentString()}
                    </Typography>
                </dl>
            </Box>
            
            <Box mt={6} mx='auto'>
                <Divider />
                <Table>
                    <TableBody>
                        {basket?.items.map(item => (
                            <TableRow key={item.productId} sx={{borderBottom: '1px solid rgba24, 224, 224, 1)'}}>
                                <TableCell sx={{py: 4}}>
                                    <Box display='flex' gap={3} alignItems='center'>
                                        <img
                                            src={item.pictureUrl}
                                            alt={item.name}
                                            style={{width: 40, height: 40}}
                                        />
                                        <Typography>
                                            {item.name}
                                        </Typography>
                                    </Box>
                                </TableCell>
                                <TableCell align='center' sx={{p:4}}>
                                    {currencyFormat(item.price)}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Box>
        </div>
    )
}
