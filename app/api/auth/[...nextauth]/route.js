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
      
      // Initialize token if it doesn't exist
      if (!token) {
        token = {};
      }
      
      if (user) {
        token.accessToken = user.accessToken; // copy to token
        token.role = user.role;

        // Extract 'exp' from the token (JWT token will have the 'exp' claim)
        try {
          if (user.accessToken && user.accessToken.split('.').length === 3) {
            const decodedToken = JSON.parse(atob(user.accessToken.split('.')[1]));
            console.log("🔑 Decoded token:", decodedToken);
            
            // Store expiration time in token if available
            if (decodedToken && decodedToken.exp) {
              token.expiresAt = decodedToken.exp * 1000; // Convert to milliseconds
            }
          }
        } catch (error) {
          console.error("Error decoding token:", error);
          // Mark as invalid but don't return null
          token.invalid = true;
        }
      }

      // Check if the token has expired or is missing
      if (!token.accessToken || token.invalid || (token.expiresAt && Date.now() > token.expiresAt)) {
        console.log("🔑 Token expired or missing, marking as expired");
        token.expired = true; // Mark as expired instead of returning null
      }
      
      return token;
    },
    async session({ session, token }) {
      console.log("📦 Session callback - token:", token);

      // Check if the token has expired, is missing, or is invalid
      if (!token || !token.accessToken || token.expired || token.invalid || (token.expiresAt && Date.now() > token.expiresAt)) {
        console.log("📦 Session expired or missing token, returning null");
        return null; // Expired session, return null to clear the session
      }

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
