import { NextResponse } from "next/server";
import { uploadFile } from "@/api/upload";
import { getSession } from "@/lib/session";
import { isAdminRole } from "@/lib/session-token";

/** Stays under the proxy's 10MB body buffer. */
const MAX_BYTES = 8 * 1024 * 1024;

/** POST multipart `file` → `{ url }`. Admins only (documents for loans created on a customer's behalf). */
export async function POST(request: Request) {
  const session = await getSession();
  if (!session || !isAdminRole(session.user.role)) {
    return NextResponse.json({ message: "Not authorized." }, { status: 401 });
  }

  const file = (await request.formData()).get("file");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ message: "Choose a file to upload." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ message: "Files must be 8MB or smaller." }, { status: 413 });
  }

  try {
    return NextResponse.json({ url: await uploadFile(file) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed.";
    return NextResponse.json({ message }, { status: 502 });
  }
}
