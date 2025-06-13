import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/app/lib/db"; // Assuming your db utility is here
import bcrypt from "bcryptjs";
import type { JWT } from "next-auth/jwt";
import type { Session, User } from "next-auth";
import type { NextAuthOptions, SessionStrategy } from "next-auth"; // <<< IMPORT SessionStrategy here

// Extend the Session type to include 'id' on user
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email?: string | null;
      name?: string | null;
      image?: string | null;
    };
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials || !credentials.email || !credentials.password) {
          return null;
        }
        const { email, password } = credentials;

        const user = await db.user.findUnique({ where: { email } });
        if (!user) {
          console.log("User not found for email:", email);
          return null;
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
          console.log("Invalid password for user:", email);
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.fullName, // Make sure 'name' matches Session.user.name
        };
      },
    }),
  ],
  pages: {
    signIn: "/",
    error: "/login"
  },
  session: {
    strategy: "jwt" as SessionStrategy, // <<< CAST THE STRING TO SessionStrategy
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};