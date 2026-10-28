import { supabase } from "./supabase";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL ||
  (process.env.NODE_ENV === "development" ? "http://localhost:8081" : "");

export async function apiFetch(path, options = {}) {
  if (!API_BASE_URL) {
    throw new Error("The backend API is not configured for this deployment.");
  }

  if (!supabase) {
    throw new Error("Supabase authentication is not configured.");
  }

  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) throw sessionError;
  if (!session) throw new Error("Your session expired. Sign in again.");

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${session.access_token}`,
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Backend request failed: ${response.status}`);
  }

  return response;
}
