// app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("📦 credentials:", credentials);

        // Call your backend login API
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        });

        const userData = await res.json();
        console.log("🔍 userData:", userData);

        const user = userData?.data;
        console.log("🔍 user:", user);

        if (res.ok && user && user.accessToken) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role, // "Doctor", "Patient", etc.
            accessToken: user.accessToken, // your backend JWT
          };
        } else {
          console.log("❌ Login failed or missing accessToken");
        }

        return null;
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      console.log("🔑 JWT callback - user:", user);
      if (user) {
        token.accessToken = user.accessToken; // copy to token
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      console.log("📦 Session callback - token:", token);
      session.accessToken = token.accessToken; // expose in session
      session.user.role = token.role; // add role to user object
      session.user.id = token.sub;
      return session;
    },
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
