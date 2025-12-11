import ProductList from "./ProductList.tsx";
import {useFetchProductsQuery} from "./catalogApi.ts";

export default function Catalog() {
    const {data, isLoading} = useFetchProductsQuery();
    
    if (isLoading || !data)
        return <div>Loading products...</div>;
    
    
    return (
        <>
            <ProductList products={data}/>
        </>
    )
}