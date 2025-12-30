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
    credentials: 'include',
});

type ErrorResponse = unknown;

const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === 'object' && value !== null;

const getTitle = (data: unknown): string | undefined => {
    if (!isRecord(data)) return undefined;
    const title = data['title'];
    return typeof title === 'string' ? title : undefined;
};

const getErrors = (data: unknown): string[] | undefined => {
    if (!isRecord(data)) return undefined;
    const errors = data['errors'];

    // supports either { errors: string[] } or { errors: { field: string[] } }
    if (Array.isArray(errors) && errors.every(e => typeof e === 'string')) return errors;

    if (isRecord(errors)) {
        return Object.values(errors)
            .flatMap(v => Array.isArray(v) ? v : [v])
            .filter((v): v is string => typeof v === 'string');
    }

    return undefined;
};

const sleep = () => new Promise(resolve => setTimeout(resolve, 1000));

export const baseQueryWithErrorHandling = async (args: string | FetchArgs, api: BaseQueryApi, extraOptions: object) => {
    api.dispatch(startLoading());
    await sleep();
    const result = await customBaseQuery(args, api, extraOptions);

    api.dispatch(stopLoading());

    if (result.error) {
        const status = result.error.status as number;
        const data = result.error.data as ErrorResponse;

        const isFetchBasketRequest =
            (typeof args === 'string' && args.replace(/^\//, '') === 'basket') ||
            (typeof args === 'object' && args.url?.replace(/^\//, '') === 'basket' && (args.method ?? 'GET').toUpperCase() === 'GET');

        const isMissingBasketId = status === 400 && typeof data === 'string' && data.toLowerCase().includes('basketid is required');

        // Treat "no basket yet" as a normal "empty" result; downstream code can handle null.
        if (isFetchBasketRequest && isMissingBasketId) {
            return { data: null, meta: result.meta };
        }

        console.error("API Error:", result.error);

        switch (status) {
            case 400: {
                if (typeof data === 'string') {
                    toast.error(data);
                    break;
                }

                const errors = getErrors(data);
                if (errors && errors.length > 0) {
                    throw errors.join(', ');
                }

                const title = getTitle(data);
                toast.error(title ?? 'Bad request');
                break;
            }
            case 401: {
                const title = getTitle(data);
                toast.error(title ?? 'Unauthorized');
                break;
            }
            case 404:
                await router.navigate('/not-found');
                break;
            case 500:
                await router.navigate('/server-error', {state: {error: isRecord(data) ? data : null}});
                break;
            default: {
                toast.error(typeof data === 'string' ? data : 'Unexpected error');
                break;
            }
        }
    }

    return result;
}