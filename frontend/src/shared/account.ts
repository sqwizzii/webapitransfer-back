import { api } from "./api";


export async function forgotPassword(email: string) {
    return api.post("/api/Account/ForgotPassword", { email });
}
