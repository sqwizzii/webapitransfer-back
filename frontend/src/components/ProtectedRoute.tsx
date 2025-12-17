import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../shared/auth";
import type { ReactNode } from "react";

interface Props {
    children: ReactNode;
}

export default function ProtectedRoute({ children }: Props) {
    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
}
