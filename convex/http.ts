import { httpRouter } from "convex/server";
import { authComponent, createAuth } from "./auth";

const http = httpRouter();

// Better Auth handles all auth routes: OAuth, sessions, sign-out, cross-domain token relay
authComponent.registerRoutes(http, createAuth, { cors: true });

export default http;
