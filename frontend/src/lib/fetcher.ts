export interface ApiErrorPayload {
  success?: boolean;
  code?: number;
  message?: string;
  meta?: Record<string, unknown>;
}

export async function apiFetch<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: Record<string, string> = {
    Accept: "*/*",
    ...(options.headers as Record<string, string>),
  };

  if (
    options.body &&
    typeof options.body === "string" &&
    !headers["Content-Type"]
  ) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(url, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const contentType = res.headers.get("content-type") || "";
    let message = res.statusText;
    let payload: ApiErrorPayload | null = null;

    try {
      if (contentType.includes("application/json")) {
        payload = (await res.json()) as ApiErrorPayload;
        message = payload.message || message;
      } else {
        const text = await res.text();
        message = text || message;
      }
    } catch {
      // fallback to status text if parsing fails
    }

    const error = new Error(message) as Error & {
      status?: number;
      payload?: ApiErrorPayload | null;
    };

    error.status = res.status;
    error.payload = payload;

    throw error;
  }

  const contentType = res.headers.get("content-type") || "";

  if (
    contentType.includes("application/x-protobuf") ||
    contentType.includes("application/octet-stream")
  ) {
    return (await res.arrayBuffer()) as unknown as T;
  }

  if (contentType.includes("application/json")) {
    return (await res.json()) as T;
  }

  return (await res.text()) as unknown as T;
}
