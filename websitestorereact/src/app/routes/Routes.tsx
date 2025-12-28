import {createBrowserRouter, Navigate} from "react-router-dom";
import App from "../layout/App.tsx";
import HomePage from "../../features/home/HomePage.tsx";
import Catalog from "../../features/catalog/Catalog.tsx";
import ProductDetails from "../../features/catalog/ProductDetails.tsx";
import AboutPage from "../../features/about/AboutPage.tsx";
import ContactPage from "../../features/contact/ContactPage.tsx";
import ServerError from "../errors/ServerError.tsx";
import NotFound from "../errors/NotFound.tsx";
import BasketPage from "../../features/basket/BasketPage.tsx";
import CheckoutPage from "../../features/checkout/CheckoutPage.tsx";
import LoginForm from "../../features/account/LoginForm.tsx";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
        children: [
            {path: "", element: <HomePage/>},
            {path: 'catalog', element: <Catalog/>},
            {path: 'catalog/:id', element: <ProductDetails />},
            {path: '/about', element: <AboutPage/>},
            {path: '/contact', element: <ContactPage/>},
            {path: '/basket', element: <BasketPage/>},
            {path: '/checkout', element: <CheckoutPage/>},
            {path: '/server-error', element: <ServerError/>},
            {path: '/login', element: <LoginForm/>},
            {path: '/not-found', element: <NotFound/>},
            {path: '*', element: <Navigate replace to='/not-found'/>},
        ]
    },
])