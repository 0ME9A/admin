import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: string; // Add 'id' to the User type
  }

  interface Session {
    user: User; // Ensure the session has the extended 'user' type
  }
}
