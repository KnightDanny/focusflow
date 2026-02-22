import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db";
import authConfig from "@/lib/auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // On first sign-in, ensure user exists in DB (for Credentials provider)
        if (process.env.NODE_ENV === "development" && user.email) {
          const dbUser = await prisma.user.upsert({
            where: { email: user.email },
            update: {},
            create: {
              email: user.email,
              name: user.name,
              image: user.image,
            },
          });
          token.sub = dbUser.id;
        } else {
          token.sub = user.id;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  ...authConfig,
});
