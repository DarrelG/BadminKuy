import { authHandler } from "~/backend/handlers/auth/authHandler";
import type { LoginPageModel } from "~/frontEnd/viewModels/auth/loginModel";
import type { RegisterPageModel } from "~/frontEnd/viewModels/auth/registerModel";
import { redirect } from "react-router";
import type { AuthUser } from "~/backend/models/UserModel";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const registerError = (error: string): RegisterPageModel => ({
    error,
    needsEmailConfirmation: false,
});

export const authController = {
    async login(email: string, password: string): Promise<LoginPageModel> {
        if (!emailPattern.test(email) || !password) {
            return { error: "Enter your email and password." };
        }
        try {
            await authHandler.signIn(email, password);
            return { error: null };
        } catch (e) {
            const message = e instanceof Error ? e.message : "";
            if (message.includes("Email not confirmed")) {
                return { error: "Please confirm your email first." };
            }
            // Same message for wrong email or wrong password, so it doesn't reveal which accounts exist
            return { error: "Wrong email or password." };
        }
    },

    async register(input: {
        username: string;
        email: string;
        password: string;
        confirmPassword: string;
    }): Promise<RegisterPageModel> {
        const username = input.username.trim();
        if (username.length < 2 || username.length > 40) {
            return registerError("Username must be 2 to 40 characters.");
        }
        if (!emailPattern.test(input.email)) {
            return registerError("Enter a valid email.");
        }
        if (input.password.length < 8) {
            return registerError("Password must be at least 8 characters.");
        }
        if (input.password !== input.confirmPassword) {
            return registerError("Passwords do not match.");
        }
        try {
            const result = await authHandler.signUp(input.email, input.password, username);
            return { error: null, needsEmailConfirmation: result.needsEmailConfirmation };
        } catch (e) {
            return registerError(e instanceof Error ? e.message : "Could not register.");
        }
    },

    async requireUser(): Promise<AuthUser> {
        const user = await authHandler.getCurrentUser();
        if (!user) throw redirect("/login");
        return user;
    },

    async redirectIfLoggedIn(): Promise<void> {
        if (await authHandler.getCurrentUser()) throw redirect("/");
    },

    async logout(): Promise<void> {
        await authHandler.signOut();
    },
};