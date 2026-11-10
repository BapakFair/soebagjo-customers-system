import type { NextApiRequest, NextApiResponse } from "next";
import supabase, { isSupabaseConfigured } from "@/lib/db";

type KeepAliveResponse = {
  success: boolean;
  message: string;
  timestamp: string;
  details?: {
    status?: number;
    error?: string | null;
  };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<KeepAliveResponse>
) {
  // Hanya menerima GET atau POST (Vercel Cron mengirim GET)
  if (req.method !== "GET" && req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method Not Allowed",
      timestamp: new Date().toISOString(),
    });
  }

  // Pengamanan opsional: jika CRON_SECRET disetel di Vercel / Environment
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const authHeader = req.headers.authorization;
    if (authHeader !== `Bearer ${cronSecret}`) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Invalid or missing CRON_SECRET",
        timestamp: new Date().toISOString(),
      });
    }
  }

  if (!isSupabaseConfigured) {
    return res.status(503).json({
      success: false,
      message: "Supabase environment variables are not configured",
      timestamp: new Date().toISOString(),
    });
  }

  try {
    // Query ringan ke PostgREST Supabase untuk membangkitkan aktivitas database
    const { status, error } = await supabase
      .from("customers")
      .select("id", { count: "exact", head: true });

    if (error && status !== 200 && status !== 206) {
      return res.status(500).json({
        success: false,
        message: "Supabase query ping failed",
        timestamp: new Date().toISOString(),
        details: { status, error: error.message },
      });
    }

    return res.status(200).json({
      success: true,
      message: "Supabase keep-alive ping successful. Project stays active.",
      timestamp: new Date().toISOString(),
      details: { status },
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
