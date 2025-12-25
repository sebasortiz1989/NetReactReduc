import ProductList from "./ProductList.tsx";
import {useFetchProductsQuery} from "./catalogApi.ts";
import {Grid} from "@mui/material";
import Filters from "./Filters.tsx";
import {useAppSelector} from "../../app/store/store.ts";

export default function Catalog() {
    const productParams = useAppSelector(state => state.catalogApi);
    const {data, isLoading} = useFetchProductsQuery(productParams);
    
    if (isLoading || !data)
        return <div>Loading products...</div>;
    
    
    return (
        <Grid container spacing={4}>
            <Grid size={3}>
                <Filters />
            </Grid>
            <Grid size={9}>
                <ProductList products={data}/>
            </Grid>
        </Grid>
    )
}