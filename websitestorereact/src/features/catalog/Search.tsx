import {debounce, TextField} from "@mui/material";
import {useAppDispatch, useAppSelector} from "../../app/store/store.ts";
import {setSearchTerm} from "./catalogSlice.ts";
import {useEffect, useState} from "react";

export default function Search() {
    const {searchTerm} = useAppSelector(state => state.catalogApi);
    const dispatch = useAppDispatch();
    const [term, setTerm] = useState(searchTerm);
    
    useEffect(() => {
        setTerm(searchTerm);
    }, [searchTerm]);
    
    const debouncedSearch = debounce(event => {
        dispatch(setSearchTerm(event.target.value));
    }, 1000);
    
    return (
        <TextField
            label='Search products'
            variant='outlined'
            fullWidth
            type="search"
            value={term}
            onChange={e => {
                setTerm(e.target.value);
                debouncedSearch(e);
            }}/>
    )
}
