import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Admin from "../pages/admin/Admin";
import ProtectedRoute from "../components/ProtectedRoute";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { index: true, element: <Home /> },
            { path: "login", element: <Login /> },
            {
                path: "admin",
                element: (
                    <ProtectedRoute>
                        <Admin />
                    </ProtectedRoute>
                ),
            },
        ],
    },
]);
