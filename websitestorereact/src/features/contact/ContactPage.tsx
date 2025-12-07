import {useDispatch, useSelector} from "react-redux";
import {type CounterState, decrement, increment} from "./counterReducer.ts";
import {Button, ButtonGroup, Typography} from "@mui/material";

export default function ContactPage() {
    const data = useSelector((state: CounterState) => state.data);
    const dispatch = useDispatch();
    
    return (
        <>
            <Typography variant="h2">
                Contact Page
            </Typography>
            <Typography variant="body2">
                The current counter value is: {data}
            </Typography>
            <ButtonGroup>
                <Button onClick={() => dispatch(decrement())} color="error">Decrement</Button>
                <Button onClick={() => dispatch(increment())} color="success">Increment</Button>
                <Button onClick={() => dispatch(increment(5))} color="primary">Increment by  5</Button>
            </ButtonGroup>
        </>
    )
}
