import { NextRequest,NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
export { default } from "next-auth/middleware"

export const config = {
  matcher: ['/dashboard/:path*', '/sign-in', '/sign-up', '/', '/verify/:path*'],
};


// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {

  const token = await getToken({req: request});
  const url= request.nextUrl;
  

  // redirect to dashboard if user is already logged in and authenticated, 
  // trying to access signin , signup or home

  if(
    token &&
    (url.pathname.startsWith('/sign-in') ||
    url.pathname.startsWith('/sign-up') ||
    url.pathname.startsWith('/') ||
    url.pathname.startsWith('/verify'))
  ){
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // redirect to signin if user is not logged in and trying to access dashboard
  if(!token && url.pathname.startsWith('/dashboard')){
    return NextResponse.redirect(new URL('/sign-in', request.url))
  }



  return NextResponse.next(); // this is main
}
 

