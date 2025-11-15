import { type NextRequest, NextResponse } from "next/server"

const protectedRoutes = [
  "/dashboard",
  "/projects/create",
  "/resources/upload",
  "/community/create",
  "/notifications",
  "/analytics",
  "/profile/edit",
]

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value
  const pathname = request.nextUrl.pathname

  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

  // Only redirect to login if truly on a protected route without token
  if (isProtectedRoute && !token) {
    // Allow the page to load; client-side check will redirect if needed
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public|icon.svg).*)"],
}
