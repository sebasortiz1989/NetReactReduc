import {useSelector} from "react-redux";
import type {CounterState} from "./counterReducer.ts";
import {Typography} from "@mui/material";

export default function ContactPage() {
    const data = useSelector((state: CounterState) => state.data);
    return (
        <>
            <Typography variant="h2">
                Contact Page
            </Typography>
            <Typography variant="body2">
                The current counter value is: {data}
            </Typography>
        </>
    )
}
