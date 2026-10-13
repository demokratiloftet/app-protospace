// Operator supplies this fixed service URL. Never take an upstream URL from a request.
export async function pdsStatus(url?: string) {
  if (!url) return { configured: false, available: false };
  try {
    const response = await fetch(
      new URL("/xrpc/com.atproto.server.describeServer", url),
      {
        signal: AbortSignal.timeout(3000),
        redirect: "error",
      },
    );
    if (!response.ok) return { configured: true, available: false };
    const data = await response.json();
    return {
      configured: true,
      available: true,
      inviteRequired: data.inviteCodeRequired === true,
    };
  } catch {
    return { configured: true, available: false };
  }
}
