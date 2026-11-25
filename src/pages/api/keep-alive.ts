import type { NextApiRequest, NextApiResponse } from "next";
import supabase, { isSupabaseConfigured } from "@/lib/db";
import {
  isCronAuthorized,
  isMissingKeepAliveSchemaError,
  type KeepAliveHeartbeat,
} from "@/lib/keep-alive-utils";

type KeepAliveResponse = {
  success: boolean;
  message: string;
  timestamp: string;
  heartbeat?: KeepAliveHeartbeat | null;
  details?: {
    mode?: string;
    rpcStatus?: number;
    selectStatus?: number;
    error?: string | null;
    code?: string | null;
  };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<KeepAliveResponse>
) {
  // Pastikan response tidak pernah di-cache oleh CDN / Edge agar setiap hit mencapai Supabase
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");

  if (req.method !== "GET" && req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method Not Allowed",
      timestamp: new Date().toISOString(),
    });
  }

  if (!isCronAuthorized(process.env.CRON_SECRET, req.headers.authorization)) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: Invalid or missing CRON_SECRET",
      timestamp: new Date().toISOString(),
    });
  }

  if (!isSupabaseConfigured) {
    return res.status(503).json({
      success: false,
      message: "Supabase environment variables are not configured",
      timestamp: new Date().toISOString(),
    });
  }

  try {
    // 1. Operasi WRITE nyata di PostgreSQL melalui RPC public.ping_keep_alive()
    const {
      data: rpcData,
      status: rpcStatus,
      error: rpcError,
    } = await supabase.rpc("ping_keep_alive");

    if (rpcError) {
      const missingSchema = isMissingKeepAliveSchemaError(rpcError);
      return res.status(missingSchema ? 503 : 500).json({
        success: false,
        message: missingSchema
          ? "Fungsi/tabel keep_alive belum terpasang di Supabase. Jalankan file supabase/keep-alive.sql di Supabase SQL Editor."
          : "Supabase RPC keep-alive write ping failed",
        timestamp: new Date().toISOString(),
        details: {
          mode: "rpc_failed",
          rpcStatus,
          error: rpcError.message,
          code: rpcError.code ?? null,
        },
      });
    }

    // 2. Operasi READ (GET) nyata via PostgREST (tanpa head: true) agar mengembalikan baris JSON
    const {
      data: rowData,
      status: selectStatus,
      error: selectError,
    } = await supabase
      .from("keep_alive")
      .select("id, ping_count, last_pinged_at")
      .eq("id", 1)
      .maybeSingle<KeepAliveHeartbeat>();

    if (selectError) {
      return res.status(500).json({
        success: false,
        message: "Supabase SELECT keep-alive read ping failed",
        timestamp: new Date().toISOString(),
        details: {
          mode: "select_failed",
          rpcStatus,
          selectStatus,
          error: selectError.message,
          code: selectError.code ?? null,
        },
      });
    }

    const heartbeat = rowData ?? (rpcData as KeepAliveHeartbeat | null) ?? null;

    return res.status(200).json({
      success: true,
      message: "Supabase keep-alive write + read ping successful. Project stays active.",
      timestamp: new Date().toISOString(),
      heartbeat,
      details: {
        mode: "rpc_write_and_select_read",
        rpcStatus,
        selectStatus,
      },
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return res.status(500).json({
      success: false,
      message: "Unexpected error during keep-alive ping",
      timestamp: new Date().toISOString(),
      details: { error: errorMessage },
    });
  }
}
