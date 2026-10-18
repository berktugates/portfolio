import { isZohoSmtpConfigured } from "./send-via-zoho-smtp";

/** FormSubmit tarayıcıdan; Zoho SMTP sunucudan. */
export function useClientFormSubmitDelivery(): boolean {
  if (isZohoSmtpConfigured()) return false;
  const id =
    process.env.CONTACT_FORMSUBMIT_ID?.trim() ||
    process.env.NEXT_PUBLIC_FORMSUBMIT_ID?.trim() ||
    process.env.CONTACT_FORMSUBMIT_EMAIL?.trim();
  return Boolean(id);
}

export function contactDeliveryConfigured(): boolean {
  return (
    isZohoSmtpConfigured() ||
    Boolean(
      process.env.CONTACT_FORMSUBMIT_ID?.trim() ||
        process.env.NEXT_PUBLIC_FORMSUBMIT_ID?.trim() ||
        process.env.CONTACT_FORMSUBMIT_EMAIL?.trim(),
    ) ||
    Boolean(process.env.CONTENT_PUBLISHER_CONTACT_URL?.trim() && process.env.CONTACT_INGEST_SECRET?.trim()) ||
    Boolean(
      process.env.EMAILJS_SERVICE_ID?.trim() &&
        process.env.EMAILJS_TEMPLATE_ID?.trim() &&
        process.env.EMAILJS_PUBLIC_KEY?.trim(),
    )
  );
}
