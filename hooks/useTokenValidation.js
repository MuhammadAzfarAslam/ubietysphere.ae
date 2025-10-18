"use client";
import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

const useTokenValidation = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Only run on client side and when session is loaded
    if (status === "loading") return;

    // Don't redirect if we're already on login page or other public pages
    const publicPages = ["/login", "/register", "/forgot-password", "/reset-password", "/verify-email", "/join-our-team", "/contact", "/our-experts", "/our-services"];
    if (publicPages.includes(pathname)) {
      return;
    }

    // Check if session is null or undefined (user not authenticated)
    if (status === "unauthenticated" || !session) {
      console.log("🚨 User not authenticated, redirecting to login");
      router.push("/login");
      return;
    }

    // Check if user is authenticated but has no accessToken
    if (status === "authenticated" && (!session?.accessToken || session?.accessToken === "")) {
      console.log("🚨 No accessToken found, logging out user");
      signOut({ callbackUrl: "/login" });
      return;
    }

    // If we have a session and accessToken, validate it
    if (session?.accessToken) {
      try {
        // Decode JWT to check expiration
        const tokenParts = session.accessToken.split('.');
        if (tokenParts.length === 3) {
          const payload = JSON.parse(atob(tokenParts[1]));
          const currentTime = Math.floor(Date.now() / 1000);
          
          // Check if token is expired (with 5 minute buffer)
          if (payload.exp && payload.exp < currentTime + 300) {
            console.log("🚨 AccessToken expired, logging out user");
            signOut({ callbackUrl: "/login" });
            return;
          }
        }
      } catch (error) {
        console.error("Error validating token:", error);
        console.log("🚨 Invalid token format, logging out user");
        signOut({ callbackUrl: "/login" });
        return;
      }
    }
  }, [session, status, router]);

  return {
    session,
    status,
    isTokenValid: session?.accessToken && status === "authenticated"
  };
};

export default useTokenValidation;
