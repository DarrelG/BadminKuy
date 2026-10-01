import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
    route("login", "frontEnd/views/auth/login.tsx"),
    route("register", "frontEnd/views/auth/register.tsx"),

    layout("frontEnd/views/layout/appLayout.tsx", [
        index("frontEnd/views/Home/Home.tsx"),
        route("courts", "frontEnd/views/Courts/courts.tsx"),
        route("mabar", "frontEnd/views/Mabar/mabar.tsx"),
        route("chat", "frontEnd/views/Chat/chat.tsx"),
        route("clubs", "frontEnd/views/Clubs/clubs.tsx"),
        route("score", "frontEnd/views/Score/score.tsx"),
        route("leaderboards", "frontEnd/views/Leaderboards/Leaderboards.tsx"),
        route("coaches", "frontEnd/views/Coaches/Coaches.tsx"),
        route("marketplace", "frontEnd/views/Marketplace/Marketplace.tsx"),
    ]),
] satisfies RouteConfig;
