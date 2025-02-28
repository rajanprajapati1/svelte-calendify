import { SvelteKitAuth } from "@auth/sveltekit";
import Google from "@auth/sveltekit/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "$lib/db.js";
import {
  AUTH_GOOGLE_ID,
  AUTH_GOOGLE_SECRET,
  AUTH_SECRET,
  MONGODB_DATABASE,
} from "$env/static/private";

export const { handle } = SvelteKitAuth({
  providers: [
    Google({
        clientId: AUTH_GOOGLE_ID,
        clientSecret: AUTH_GOOGLE_SECRET,
        authorization: {
          params: {
            scope: "openid email profile https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/tasks",
          },
        },
      }),
      
  ],
  adapter: MongoDBAdapter(clientPromise, { databaseName: MONGODB_DATABASE }),
  pages: {
    signIn: "/login",
    signOut: "/login",
  },
  session: {
    strategy: "jwt", 
  },
  trustHost: true, // Add this to trust localhost during dev/preview
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.access_token = account.access_token;
        token.refresh_token = account.refresh_token;
        token.expires_at = account.expires_at;
      }
  
      if (Date.now() > token.expires_at * 1000) {
        try {
          const response = await fetch("https://oauth2.googleapis.com/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
              client_id: AUTH_GOOGLE_ID,
              client_secret: AUTH_GOOGLE_SECRET,
              refresh_token: token.refresh_token,
              grant_type: "refresh_token",
            }),
          });
  
          const data = await response.json();
          if (data.access_token) {
            token.access_token = data.access_token;
            token.expires_at = Math.floor(Date.now() / 1000) + data.expires_in;
          }
        } catch (error) {
          console.error("Error refreshing access token:", error);
        }
      }
  
      return token;
    },
    async session({ session, token }) {
      session.access_token = token.access_token;
      return session;
    },
  },
  
});
