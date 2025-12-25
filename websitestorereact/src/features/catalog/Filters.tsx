import {useFetchFiltersQuery} from "./catalogApi.ts";
import {Box, Checkbox, FormControl, FormControlLabel, FormGroup, Paper, Radio, TextField} from "@mui/material";

const sortOptions = [
    {value: 'name', label: 'Alphabetical'},
    {value: 'priceDesc', label: 'Price: High to Low'},
    {value: 'priceAsc', label: 'Price: Low to High'},
]

export default function Filters() {
    const {data} = useFetchFiltersQuery();
    console.log(data);
    return (
        <Box display='flex' flexDirection='column' gap={3}>
            <Paper>
                <TextField label='Search products' variant='outlined' fullWidth/>
            </Paper>
            <Paper sx={{p: 3}}>
                <FormControl>
                    {sortOptions.map(({value, label}) => (
                        <FormControlLabel
                            key={label}
                            control={<Radio sx={{py: 0.7}} />}
                            label={label}
                            value={value}
                        />
                    ))}
                </FormControl>
            </Paper>
            <Paper sx={{p: 3}}>
                <FormGroup>
                    {data?.brands.map(brand => (
                        <FormControlLabel
                            key={brand}
                            control={<Checkbox sx={{py: 0.7, fontSize: 40}} />}
                            label={brand}
                        />
                    ))}
                </FormGroup>
            </Paper>
            <Paper sx={{p: 3}}>
                <FormGroup>
                    {data?.types.map(type => (
                        <FormControlLabel
                            key={type}
                            control={<Checkbox sx={{py: 0.7, fontSize: 40}} />}
                            label={type}
                        />
                    ))}
                </FormGroup>
            </Paper>
        </Box>
    )
}