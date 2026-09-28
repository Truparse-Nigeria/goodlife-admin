import "server-only";

/*
 * Document storage shared with the website (good-life-credit). It only
 * accepts browser calls from the website's domain, so the admin uploads
 * from its server instead (see app/api/uploads/route.ts).
 */
const UPLOAD_URL_ENDPOINT = "https://core.figur.africa/api/v1/upload/generate-url";

type GenerateUrlResponse = { data?: { uploadUrl?: string; fileUrl?: string }; message?: string };

/** Store a file and return its public URL. Throws with a readable message on failure. */
export async function uploadFile(file: File): Promise<string> {
  const url = new URL(UPLOAD_URL_ENDPOINT);
  url.searchParams.set("fileName", file.name);
  url.searchParams.set("fileType", file.type || "application/octet-stream");

  const res = await fetch(url, { cache: "no-store" });
  const body = (await res.json().catch(() => null)) as GenerateUrlResponse | null;
  const { uploadUrl, fileUrl } = body?.data ?? {};
  if (!res.ok || !uploadUrl || !fileUrl) throw new Error(body?.message ?? "Couldn’t start the upload.");

  const put = await fetch(uploadUrl, { method: "PUT", body: file });
  if (!put.ok) throw new Error("Couldn’t upload the file.");

  return fileUrl;
}
