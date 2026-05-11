


// import { NextAuthOptions } from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import { prisma } from "@/lib/prisma";
// import bcrypt from "bcryptjs";
// import { Role } from "@prisma/client";

// export const authOptions: NextAuthOptions = {
//   // Credentials provider requires JWT strategy for sessions
//   session: {
//     strategy: "jwt",
//   },
//   pages: {
//     signIn: "/login",
//   },
//   providers: [
//     CredentialsProvider({
//       name: "Institutional Login",
//       credentials: {
//         email: { label: "Email", type: "email", placeholder: "teacher@school.edu" },
//         password: { label: "Password", type: "password" }
//       },
//       async authorize(credentials) {
//         if (!credentials?.email || !credentials?.password) {
//           throw new Error("Missing email or password");
//         }

//         // 1. Find the user in your database
//         const user = await prisma.user.findUnique({
//           where: { email: credentials.email }
//         });

//         if (!user) {
//           throw new Error("User not found");
//         }

//         // 2. Verify the hashed password
//         const isValid = await bcrypt.compare(credentials.password, user.passwordHash);

//         if (!isValid) {
//           throw new Error("Invalid password");
//         }

//         // 3. Return the user object to NextAuth
//         return {
//           id: user.id,
//           email: user.email,
//           name: user.name,
//           role: user.role, // Passing your custom Prisma Role Enum
//         };
//       }
//     })
//   ],
//   callbacks: {
//     // 4. Inject ID and Role into the JWT Token
//     async jwt({ token, user }) {
//       if (user) {
//         token.id = user.id;
//         token.role = (user as { role?: Role }).role;
//       }
//       return token;
//     },
//     // 5. Pass that Token data to the frontend Session object
//     async session({ session, token }) {
//       if (session.user) {
//         (session.user as { id?: string; role?: Role }).id = token.id as string;
//         (session.user as { id?: string; role?: Role }).role = token.role as Role;
//       }
//       return session;
//     }
//   }
// };






import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import {prisma} from "@/lib/prisma"; // Changed to default import just in case!
import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Institutional Login",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "teacher@school.edu" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log("--- 1. NEW LOGIN ATTEMPT ---");
        console.log("-> EMAIL RECEIVED:", credentials?.email);

        if (!credentials?.email || !credentials?.password) {
          console.log("-> ERROR: Missing email or password");
          throw new Error("Missing email or password");
        }

        try {
          // Using .trim() to remove accidental spaces
          const cleanEmail = credentials.email.trim();
          console.log("-> 2. PINGING DATABASE FOR:", cleanEmail);

          const user = await prisma.user.findUnique({
            where: { email: cleanEmail }
          });

          if (!user) {
            console.log("-> ERROR: Email not found in database!");
            throw new Error("User not found");
          }

          console.log("-> 3. USER FOUND IN DB:", user.name);
          console.log("-> 4. COMPARING PASSWORD HASH...");

          const isValid = await bcrypt.compare(credentials.password, user.passwordHash);

          if (!isValid) {
            console.log("-> ERROR: Passwords do not match!");
            throw new Error("Invalid password");
          }

          console.log("-> 5. SUCCESS! PASSWORDS MATCH. LOGGING IN.");

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error) {
          console.log("-> FATAL CATCH ERROR:", error);
          throw error;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: Role }).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string; role?: Role }).id = token.id as string;
        (session.user as { id?: string; role?: Role }).role = token.role as Role;
      }
      return session;
    }
  }
};