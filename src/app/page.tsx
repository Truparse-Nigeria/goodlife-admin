import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { homeFor } from "@/lib/session-token";

/** The proxy normally handles "/", this is the fallback. */
export default async function Home() {
  const session = await getSession();
  redirect(session ? homeFor(session.user.role) : "/login");
}
