export { default } from "next-auth/middleware"

// Protect these routes — redirect to /login if not authenticated
export const config = {
  matcher: [
    "/approvals/:path*",
  ],
}



/*

export { default } from "next-auth/middleware"

// Protect these routes — redirect to /login if not authenticated
export const config = {
  matcher: [
    "/approvals/:path*",
    "/dashboard/:path*",
  ],
}

*/