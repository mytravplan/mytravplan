// /api/(nextauth)/auth/[...nextauth]/route.jsx

import NextAuth from "next-auth"
import authOptions from "./options"
 
 
 
let handler=NextAuth(authOptions)


export {handler as GET , handler as POST}