export type KeepAliveHeartbeat = {
  id: number;
  ping_count: number;
  last_pinged_at: string;
};

export type SupabaseErrorLike = {
  code?: string | null;
  message?: string | null;
} | null;

const MISSING_SCHEMA_CODES = new Set(["PGRST202", "PGRST205", "42883", "42P01"]);

export function isCronAuthorized(
  cronSecret: string | undefined,
  authorizationHeader: string | undefined
): boolean {
  if (!cronSecret) {
    return true;
  }
  return authorizationHeader === `Bearer ${cronSecret}`;
}

export function isMissingKeepAliveSchemaError(error: SupabaseErrorLike): boolean {
  if (!error) {
    return false;
  }
  if (error.code && MISSING_SCHEMA_CODES.has(error.code)) {
    return true;
  }
  const message = (error.message ?? "").toLowerCase();
  return (
    message.includes("ping_keep_alive") ||
    message.includes("keep_alive") && (message.includes("does not exist") || message.includes("could not find"))
  );
}
