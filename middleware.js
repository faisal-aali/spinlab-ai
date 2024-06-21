import { NextResponse } from "next/server";

const protectedRoutes = [
    '/dashboard',
    '/leaderboard',
    '/drill-library',
    '/metrics',
    '/history',
    '/coachingCall',
    '/purchases',
    '/subscriptions',
    '/settings',
];

export default function middleware(req) {
    let verify = req.cookies.get("loggedin");
    let url = req.url;

    const isProtectedRoute = protectedRoutes.some(route => url.includes(route));
    if (!verify && isProtectedRoute) {
        return NextResponse.redirect("http://localhost:3000/login");
    }
    if (verify && url === "http://localhost:3000/") {
        return NextResponse.redirect("http://localhost:3000/dashboard");
    }
    if (verify && (url.includes("/login") || url.includes("/register"))) {
        return NextResponse.redirect("http://localhost:3000/dashboard");
    }
    if (url === "http://localhost:3000/") {
        return NextResponse.redirect("http://localhost:3000/login");
    }
    return NextResponse.next();
}
