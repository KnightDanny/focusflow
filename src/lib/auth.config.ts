import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

const providers: NextAuthConfig["providers"] = [
  Google({
    clientId: process.env.AUTH_GOOGLE_ID!,
    clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    authorization: {
      params: {
        scope:
          "openid email profile https://www.googleapis.com/auth/calendar",
        access_type: "offline",
        prompt: "consent",
      },
    },
  }),
];

// Dev-only credentials provider for testing without Google OAuth
if (process.env.NODE_ENV === "development") {
  providers.push(
    Credentials({
      name: "Dev Login",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "dev@focusflow.local" },
      },
      async authorize(credentials) {
        const email = credentials?.email as string;
        if (!email) return null;
        // Return a user object — Auth.js will handle the rest
        return {
          id: email,
          name: email.split("@")[0],
          email,
          image: null,
        };
      },
    })
  );
}

export default {
  providers,
} satisfies NextAuthConfig;
