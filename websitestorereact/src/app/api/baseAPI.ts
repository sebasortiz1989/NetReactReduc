import {type BaseQueryApi, type FetchArgs, fetchBaseQuery} from "@reduxjs/toolkit/query/react";

const isLocalhost = window.location.hostname === 'localhost';
const protocol = isLocalhost ? 'https' : 'http';
const port = isLocalhost ? '5005' : '5010';
const baseUrl = `${protocol}://${window.location.hostname}:${port}/api`;

const customBaseQuery = fetchBaseQuery({
    baseUrl: baseUrl,
});

const sleep = () => new Promise(resolve => setTimeout(resolve, 1000));

export const baseQueryWithErrorHandling = async (args: string | FetchArgs, api: BaseQueryApi, extraOptions: object) => {
    await sleep();
    const result = await customBaseQuery(args, api, extraOptions);

    if (result.error) {
        const {status, data} = result.error;
        console.error("API Error:", {status, data});
    }

    return result;
}