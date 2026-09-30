import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("frontEnd/views/dashboard/dashboard.tsx"),
    route("login", "frontEnd/views/auth/login.tsx"),
    route("register", "frontEnd/views/auth/register.tsx"),
] satisfies RouteConfig;
