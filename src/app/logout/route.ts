import { NextResponse, type NextRequest } from "next/server";
import { deleteSession } from "@/lib/session";

/**
 * Ends the local session and returns to sign-in. Pages redirect here when
 * goodlife-api rejects the session token (401), since rendering can't clear cookies.
 */
export async function GET(request: NextRequest) {
  await deleteSession();
  return NextResponse.redirect(new URL("/login", request.url));
}
