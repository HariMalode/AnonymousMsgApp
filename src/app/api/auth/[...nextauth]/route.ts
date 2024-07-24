import NextAuth from 'next-auth/next'; 
import { authOptions } from './options';

const handler = NextAuth(authOptions); 

export { handler as GET, handler as POST }; 
// Export the handler function for both GET and POST HTTP methods, it is syntax
