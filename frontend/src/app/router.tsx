import { createBrowserRouter } from "react-router-dom";
import App from "./App";

import Home from "../pages/Home";
import Login from "../pages/Login";

import Admin from "../pages/admin/Admin";
import AdminUsers from "../pages/admin/AdminUsers";

import ProtectedRoute from "../components/ProtectedRoute";
import UserSearch from "../pages/admin/UserSearch";

import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { index: true, element: <Home /> },
            { path: "login", element: <Login /> },

            { path: "forgot-password", element: <ForgotPassword /> },
            { path: "reset-password", element: <ResetPassword /> },

            {
                path: "admin",
                element: (
                    <ProtectedRoute>
                        <Admin />
                    </ProtectedRoute>
                ),
            },

            {
                path: "admin/users",
                element: (
                    <ProtectedRoute>
                        <AdminUsers />
                    </ProtectedRoute>
                ),
            },
        ],
    },
]);
