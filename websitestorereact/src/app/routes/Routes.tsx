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
import RegisterForm from "../../features/account/RegisterForm.tsx";
import RequireAuth from "./RequireAuth.tsx";
import CheckoutSuccess from "../../features/checkout/CheckoutSuccess.tsx";
import OrdersPage from "../../features/orders/OrdersPage.tsx";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
        children: [
            {element: <RequireAuth/>, children: [
                    {path: '/checkout', element: <CheckoutPage/>},
                    {path: '/checkout/success', element: <CheckoutSuccess/>},
                    {path: 'orders', element: <OrdersPage/>},
                ]},
            {path: "", element: <HomePage/>},
            {path: 'catalog', element: <Catalog/>},
            {path: 'catalog/:id', element: <ProductDetails />},
            {path: '/about', element: <AboutPage/>},
            {path: '/contact', element: <ContactPage/>},
            {path: '/basket', element: <BasketPage/>},
            {path: '/server-error', element: <ServerError/>},
            {path: '/register', element: <RegisterForm/>},
            {path: '/login', element: <LoginForm/>},
            {path: '/not-found', element: <NotFound/>},
            {path: '*', element: <Navigate replace to='/not-found'/>},
        ]
    },
])