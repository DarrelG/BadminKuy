import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
    route("login", "frontEnd/views/auth/login.tsx"),
    route("register", "frontEnd/views/auth/register.tsx"),

    layout("frontEnd/views/layout/appLayout.tsx", [
        index("frontEnd/views/dashboard/dashboard.tsx"),
        route("courts", "frontEnd/views/courts/courts.tsx"),
        route("mabar", "frontEnd/views/mabar/mabar.tsx"),
        route("chat", "frontEnd/views/chat/chat.tsx"),
        route("clubs", "frontEnd/views/clubs/clubs.tsx"),
        route("score", "frontEnd/views/score/score.tsx"),
        route("leaderboards", "frontEnd/views/leaderboards/leaderboards.tsx"),
        route("coaches", "frontEnd/views/coaches/coaches.tsx"),
        route("marketplace", "frontEnd/views/marketplace/marketplace.tsx"),
    ]),
] satisfies RouteConfig;
