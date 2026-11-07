import { createBrowserRouter, Navigate } from "react-router";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import Protected from "./features/auth/components/Protected";
import Home from "./features/interview/pages/Home";
import Interview from "./features/interview/pages/Interview";

//  application route configuration
export const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login /> // Public login route
    },
    {
        path: "/register",
        element: <Register /> // Public registration route
    },
    {
        path: "/",
        element: <Protected><Home /></Protected> // Protected home dashboard
    },
    {
        path: "/interview/:interviewId",
        element: <Protected><Interview /></Protected> // Protected dynamic interview room route
    },
    {
        path: "*",
        element: <Navigate to="/" replace /> // Fallback for invalid URLs
    }
]);
