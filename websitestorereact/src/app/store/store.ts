import {configureStore, legacy_createStore} from "@reduxjs/toolkit";
import counterReducer, {counterSlice} from "../../features/contact/counterReducer.ts";
import {useDispatch, useSelector} from "react-redux";
import {catalogApi} from "../../features/catalog/catalogApi.ts";
import {uiSlice} from "../layout/uiSlice.ts";
import {errorApi} from "../../features/about/errorApi.ts";
import {basketApi} from "../../features/basket/basketApi.ts";
import {catalogSlice} from "../../features/catalog/catalogSlice.ts";

export function configureTheStore() {
    return legacy_createStore(counterReducer);
}

export const store = configureStore({
    reducer: {
        [catalogApi.reducerPath]: catalogApi.reducer,
        [errorApi.reducerPath]: errorApi.reducer,
        [basketApi.reducerPath]: basketApi.reducer,
        counter: counterSlice.reducer,
        ui: uiSlice.reducer,
        catalogApi: catalogSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            catalogApi.middleware,
            errorApi.middleware,
            basketApi.middleware),
});

// This comes from the documentation of Redux Toolkit
// https://redux-toolkit.js.org/usage/usage-with-typescript#define-root-state-and-dispatch-types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();