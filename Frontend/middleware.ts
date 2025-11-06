import { type NextRequest, NextResponse } from "next/server"

const protectedRoutes = [
  "/dashboard",
  "/projects/create",
  "/resources/upload",
  "/community/create-post",
  "/notifications",
  "/analytics",
  "/profile/edit",
]

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value
  const pathname = request.nextUrl.pathname

  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

  // Redirect to login if trying to access protected route without token
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Redirect to dashboard if trying to access auth pages while logged in
  if ((pathname === "/login" || pathname === "/register") && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public).*)"],
}
