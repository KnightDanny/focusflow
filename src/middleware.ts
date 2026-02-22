import NextAuth from "next-auth";
import authConfig from "@/lib/auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;

  const protectedRoutes = [
    "/focus",
    "/tasks",
    "/calendar",
    "/analytics",
    "/settings",
  ];

  const isProtected =
    pathname === "/" ||
    protectedRoutes.some((route) => pathname.startsWith(route));

  if (isProtected && !isLoggedIn) {
    return Response.redirect(new URL("/login", req.nextUrl));
  }
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|manifest\\.json|icons|sounds).*)",
  ],
};
