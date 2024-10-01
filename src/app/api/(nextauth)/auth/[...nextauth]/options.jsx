// // /api/(nextauth)/auth/[...nextauth]/options.jsx

// import { DbConnect } from '@/database/database';
// import OtpUserModel from '@/model/otpUser';
   
 
// import CredentialsProvider from 'next-auth/providers/credentials';
 

// export const authOptions = {
//   secret: process.env.NEXTAUTH_SECRET,  
//   pages: {
//     signIn: '/login',
//   },
//   callbacks: {
   
//     async jwt({ token, user }) {
//       if (user) {
//         user.role = user.role == null ? 'user' : user.role;
//         token.user = user;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       session.user = token.user;
//       return session;
//     },
//   },
//   providers: [
//     CredentialsProvider({
//       name: 'User Credentials',
//       credentials: {
//         phoneNumber: {
//           label: 'Phone Number',
//           type: 'text',
//           placeholder: 'Enter your phone number',
//         },
//         email: {
//           label: 'email',
//           type: 'email',
//           placeholder: 'Enter email address',
//         },
//         password: {
//           label: 'password',
//           type: 'password',
//           placeholder: 'Enter your pasword',
//         },
//       },
//       async authorize(credentials) {
//         await DbConnect()
//         const user = await OtpUserModel.findOne({ phoneNumber: credentials?.phoneNumber });
//         if (user) {
//           return user 
//         } else {
//           return null;
//         }
//       },
//     }),

    
//   ],
// };


// /api/(nextauth)/auth/[...nextauth]/options.jsx

import { DbConnect } from '@/database/database';
import OtpUserModel from '@/model/otpUser';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        user.role = user.role == null ? 'user' : user.role;
        token.user = user;
        // Store the login timestamp for admin users
        if (user.role === 'admin') {
          token.loginTime = Date.now();
        }
      }
      return token;
    },
    async session({ session, token }) {
      // Check if the user is an admin and if the session should expire
      if (token.user && token.user.role === 'admin') {
        const currentTime = Date.now();
        // Check if more than 1 minute (60000 milliseconds) has passed since login
        if (currentTime - token.loginTime > 60000) {
          // If the session is expired, set the session to null
          return null;
        }
      }
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
          label: 'Email',
          type: 'email',
          placeholder: 'Enter email address',
        },
        password: {
          label: 'Password',
          type: 'password',
          placeholder: 'Enter your password',
        },
      },
      async authorize(credentials) {
        await DbConnect();
        const user = await OtpUserModel.findOne({ phoneNumber: credentials?.phoneNumber });
        if (user) {
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
};
