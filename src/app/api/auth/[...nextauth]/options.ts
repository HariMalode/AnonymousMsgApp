import { NextAuthOptions } from "next-auth"; // Importing the type definition for NextAuth options
import CredentialsProvider from "next-auth/providers/credentials"; // Importing the credentials provider from NextAuth
import bcrypt from "bcryptjs"; // Importing bcryptjs library to hash and compare passwords

import dbConnect from "@/lib/dbConnect"; // Importing a function to connect to the database
import UserModel from "@/model/User"; // Importing the User model from the models directory

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials", // Setting an ID for the provider
      name: "Credentials", // Display name for the provider
      credentials: {
        email: { label: "Email", type: "text" }, // Configuration for the email input
        password: { label: "Password", type: "password" }, // Configuration for the password input
      },
      async authorize(credentials: any): Promise<any> {
        // Function to authorize the user with provided credentials
        await dbConnect(); // Connecting to the database
        try {
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.email }, // Check for user by email
              { username: credentials.email }, // Check for user by username (if email not found)
            ],
          });

          if (!user) {
            throw new Error("User not found"); // Throw an error if user not found
          }

          if (!user.isVerified) {
            throw new Error("Please verify your email"); // Throw an error if user is not verified
          }

          const isPasswordCorrect = await bcrypt.compare(
            credentials.password, // Compare provided password
            user.password // With stored password
          );

          if (isPasswordCorrect) {
            return user; // Return user if password is  (main)
          } else {
            throw new Error("Incorrect Password"); // Throw an error if password is incorrect
          }
        } catch (error: any) {
          throw new Error(error); // Handle any errors during authorization
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // JWT callback to include user info in the token
      if (user) {
        // If user object is available, modify the token
        token._id = user._id?.toString(); // Add user ID to the token
        token.isVerified = user.isVerified; // Add user verification status to the token
        token.isAcceptingMessages = user.isAcceptingMessages; // Add user messaging status to the token
        token.username = user.username; // Add username to the token
      }
      return token; // Return the modified token
    },
    async session({ session, token }) {
      // Session callback to include token info in the session
      if (token) {
        // If token object is available, modify the session
        session.user._id = token._id; // Add user ID to the session
        session.user.isVerified = token.isVerified; // Add user verification status to the session
        session.user.isAcceptingMessages = token.isAcceptingMessages; // Add user messaging status to the session
        session.user.username = token.username; // Add username to the session
      }
      return session; // Return the modified session
    },
  },
  pages: {
    signIn: "/sign-in", // Custom sign-in page URL
  },
  session: {
    strategy: "jwt", // Use JWT strategy for sessions
  },
  secret: process.env.NEXT_AUTH_SECRET, // Secret for signing JWT tokens
};
