import ProductList from "./ProductList.tsx";
import {useFetchProductsQuery} from "./catalogApi.ts";
import {Grid, Typography} from "@mui/material";
import Filters from "./Filters.tsx";
import {useAppDispatch, useAppSelector} from "../../app/store/store.ts";
import {setPageNumber} from "./catalogSlice.ts";
import AppPagination from "../../app/shared/components/AppPagination.tsx";

export default function Catalog() {
    const productParams = useAppSelector(state => state.catalogApi);
    const {data, isLoading} = useFetchProductsQuery(productParams);
    const dispatch = useAppDispatch();
    
    if (isLoading || !data)
        return <div>Loading products...</div>;
    
    return (
        <Grid container spacing={4}>
            <Grid size={3}>
                <Filters />
            </Grid>
            <Grid size={9}>
                {data.items && data.items.length > 0 ? (
                    <>
                        <ProductList products={data.items}/>
                        {data.pagination && (
                            <AppPagination
                                metadata={data.pagination}
                                onPageChange={(page: number) => dispatch(setPageNumber(page))}
                            />
                        )}
                    </>
                ) : (
                    <Typography variant='h5'>There are no results for this filter</Typography>
                )}
            </Grid>
        </Grid>
    )
}