import type {Product} from "../../app/models/Product.ts";

// interface CatalogProps {
//     products: Product[],
//     addProducts: () => void
// }

type Props = {
    products: Product[],
    addProducts: () => void
}

export default function Catalog({products, addProducts}: Props) {
    return (
        <>
            <ul>
                {products.map((product, index) => (
                    <li key={index}>
                        {product.name} - ${product.price}
                    </li>
                ))}
            </ul>
            <button onClick={addProducts}>Add Product</button>
        </>
    )
}