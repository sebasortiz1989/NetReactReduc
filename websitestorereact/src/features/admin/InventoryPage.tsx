import {useAppDispatch, useAppSelector} from "../../app/store/store.ts";
import {useFetchProductsQuery} from "../catalog/catalogApi.ts";
import {Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography} from "@mui/material";
import {currencyFormat} from "../../lib/util.ts";
import {Delete, Edit} from "@mui/icons-material";
import AppPagination from "../../app/shared/components/AppPagination.tsx";
import {setPageNumber} from "../catalog/catalogSlice.ts";
import {useState} from "react";
import ProductForm from "./ProductForm.tsx";

export default function InventoryPage() {
    const productParams = useAppSelector(state => state.catalogApi);
    const {data} = useFetchProductsQuery(productParams);
    const dispatch = useAppDispatch();
    const [editMode, setEditMode] = useState(false);
    
    if (editMode) {
        return <ProductForm/>
    }
    
    return (
        <>
            <Box display="flex" justifyContent="space-between">
                <Typography variant="h4" sx={{p: 2}}>Inventory</Typography>
                <Button variant="contained" size='large' sx={{m: 2}} onClick={() => setEditMode(true)}>Create</Button>
            </Box>
            <TableContainer component={Paper}>
                <Table sx={{minWidth: 650}}>
                    <TableHead>
                        <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell align={"left"}>Product</TableCell>
                            <TableCell align={"right"}>Price</TableCell>
                            <TableCell align={"left"}>Type</TableCell>
                            <TableCell align={"center"}>Brand</TableCell>
                            <TableCell align={"right"}>Quantity</TableCell>
                            <TableCell align={"right"}></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data && data.items.map(product => (
                            <TableRow key={product.id} sx={{'&:last-child td, &:last-child th': {border: 0}}}>
                                <TableCell component="th" scope="row">{product.id}</TableCell>
                                <TableCell align={"left"}>
                                    <Box display="flex" alignItems={"center"}>
                                        <img src={product.pictureUrl} alt={product.name} style={{height: 50, marginRight: 20}} />
                                        <span>{product.name}</span>
                                    </Box>
                                </TableCell>
                                <TableCell align={"right"}>{currencyFormat(product.price)}</TableCell>
                                <TableCell align={"left"}>{product.type}</TableCell>
                                <TableCell align={"center"}>{product.brand}</TableCell>
                                <TableCell align={"center"}>{product.quantityInStock}</TableCell>
                                <TableCell align={"right"}>
                                    <Button startIcon={<Edit/>}/>
                                    <Button startIcon={<Delete/>} color={"error"}/>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <Box sx={{p:3}}>
                    {data && data.pagination && data.items.length > 0 && (
                        <AppPagination
                            metadata={data.pagination}
                            onPageChange={(page: number) => dispatch(setPageNumber(page))}
                        />
                    )}
                </Box>
            </TableContainer>
        </>
    )
}
