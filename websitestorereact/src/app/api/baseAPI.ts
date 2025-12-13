import {type BaseQueryApi, type FetchArgs, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {startLoading, stopLoading} from "../layout/uiSlice.ts";
import {toast} from "react-toastify";
import {router} from "../routes/Routes.tsx";

const isLocalhost = window.location.hostname === 'localhost';
const protocol = isLocalhost ? 'https' : 'http';
const port = isLocalhost ? '5005' : '5010';
const baseUrl = `${protocol}://${window.location.hostname}:${port}/api`;

const customBaseQuery = fetchBaseQuery({
    baseUrl: baseUrl,
});

type ErrorResponse = | string | { title: string; } | {errors: string[]};

const sleep = () => new Promise(resolve => setTimeout(resolve, 1000));

export const baseQueryWithErrorHandling = async (args: string | FetchArgs, api: BaseQueryApi, extraOptions: object) => {
    api.dispatch(startLoading());
    await sleep();
    const result = await customBaseQuery(args, api, extraOptions);

    api.dispatch(stopLoading());
    if (result.error) {
        const status = result.error.status as number;
        const data = result.error.data as ErrorResponse;
        console.error("API Error:", result.error);
        switch (status) {
            case 400:
                if (typeof data === 'string') {
                    toast.error(data);
                }
                else if ('errors' in data) {
                    throw Object.values(data.errors).flat().join(', ');
                }
                else{
                    toast.error(data.title);
                }
                break;
            case 401:
                if (typeof data === 'object' && 'title' in data) {
                    toast.error(data.title);
                }
                break;
            case 404:
                if (typeof data === 'object' && 'title' in data) {
                    await router.navigate('/not-found');
                }
                break;
            case 500:
                if (typeof data === 'object') {
                    await router.navigate('/server-error', {state: {error: data}});
                }
                break;
            default:
                toast.error(data as string);
                break;
        }
    }

    return result;
}