import {Box, Button, Paper} from "@mui/material";
import Search from "./Search.tsx";
import RadioButtonGroup from "../../app/shared/components/RadioButtonGroup.tsx";
import {useAppDispatch, useAppSelector} from "../../app/store/store.ts";
import {setBrands, setTypes, setOrderBy, resetParams} from "./catalogSlice.ts";
import CheckboxButtons from "../../app/shared/components/CheckboxButtons.tsx";

const sortOptions = [
    {value: 'name', label: 'Alphabetical'},
    {value: 'priceDesc', label: 'Price: High to Low'},
    {value: 'price', label: 'Price: Low to High'},
]

type Props = {
    filtersData: {
        brands: string[];
        types: string[];
    };
}

export default function Filters({filtersData: data}: Props) {
    const {orderBy, types, brands} = useAppSelector(state => state.catalogApi);
    const dispatch = useAppDispatch();
    
    return (
        <Box display='flex' flexDirection='column' gap={3}>
            <Paper>
                <Search/>
            </Paper>
            <Paper sx={{p: 3}}>
                <RadioButtonGroup
                    selectedValue={orderBy}
                    options={sortOptions}
                    onChange={e => dispatch(setOrderBy(e.currentTarget.value))}/>
            </Paper>
            <Paper sx={{p: 3}}>
                <CheckboxButtons
                    items={data.brands}
                    checked={brands}
                    onChange={(items: string[]) => dispatch(setBrands(items))}/>
            </Paper>
            <Paper sx={{p: 3}}>
                <CheckboxButtons
                    items={data.types}
                    checked={types}
                    onChange={(items: string[]) => dispatch(setTypes(items))}/>
            </Paper>
            <Button onClick={() => {
                dispatch(resetParams());
                window.scrollTo({top: 0, behavior: 'smooth'});
            }}>
                Reset Filters
            </Button>
        </Box>
    )
}