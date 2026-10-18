/** FormSubmit — yalnızca tarayıcıdan (Origin berktugberke.com). Sunucu IP’lerinde güvenilir değil. */
export type ClientFormSubmitPayload = {
  name: string;
  email: string;
  projectTypeLabel: string;
  details: string;
  locale: string;
};

export async function sendContactViaFormSubmitClient(
  formSubmitId: string,
  payload: ClientFormSubmitPayload,
): Promise<boolean> {
  const id = formSubmitId.trim();
  if (!id) return false;

  const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(id)}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      name: payload.name,
      email: payload.email,
      project_type: payload.projectTypeLabel,
      message: payload.details,
      locale: payload.locale,
      _subject: `[${payload.locale}] İletişim formu — ${payload.name}`,
      _template: "table",
    }),
  });

  if (!response.ok) return false;
  const data = (await response.json().catch(() => null)) as { success?: string | boolean } | null;
  return data?.success === true || data?.success === "true";
}
