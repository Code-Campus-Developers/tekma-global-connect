const apiUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, "");

export async function submitForm(path: string, values: FormData) {
  if (!apiUrl) {
    throw new Error("The submission service is not configured.");
  }

  const response = await fetch(`${apiUrl}${path}`, {
    method: "POST",
    body: values,
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { message?: string } | null;
    throw new Error(payload?.message ?? "We could not send your submission. Please try again.");
  }
}
