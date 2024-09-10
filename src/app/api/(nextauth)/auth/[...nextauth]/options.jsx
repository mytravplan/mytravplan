// /api/(nextauth)/auth/[...nextauth]/options.jsx

import { DbConnect } from '@/database/database';
import OtpUserModel from '@/model/otpUser';
   
 
import CredentialsProvider from 'next-auth/providers/credentials';
 

export const authOptions = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
   
    async jwt({ token, user }) {
      if (user) {
        user.role = user.role == null ? 'user' : user.role;
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user;
      return session;
    },
  },
  providers: [
    CredentialsProvider({
      name: 'User Credentials',
      credentials: {
        phoneNumber: {
          label: 'Phone Number',
          type: 'text',
          placeholder: 'Enter your phone number',
        },
        email: {
          label: 'email',
          type: 'email',
          placeholder: 'Enter email address',
        },
        password: {
          label: 'password',
          type: 'password',
          placeholder: 'Enter your pasword',
        },
      },
      async authorize(credentials) {
        await DbConnect()
        const user = await OtpUserModel.findOne({ phoneNumber: credentials?.phoneNumber });
        if (user) {
          return user 
        } else {
          return null;
        }
      },
    }),

    
  ],
};

export default authOptions;
