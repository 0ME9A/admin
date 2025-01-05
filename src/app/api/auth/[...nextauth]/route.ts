import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectMongo from "@/utils/connect";
import NextAuth from "next-auth/next";
import Admin from "@/models/admin";

const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        await connectMongo();
        const admin = await Admin.findOne({ email: credentials?.email });

        if (admin && admin.password === credentials?.password) {
          console.log("successfully signedIn!");
          return { id: admin._id.toString(), email: admin.email }; // Include 'id'
        } else {
          console.log("Invalid Credentials!");
          return null; // Return null if no matching admin found
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/signin",
  },
};

const handler = NextAuth(authOptions);

// Default export for the API route
export default handler;

// Additional exports for GET and POST methods
export { handler as GET, handler as POST };
