/** Form gönderimlerinin gittiği adres — yalnızca sunucu tarafında kullanın. */
export function contactInboundEmail(): string {
  return (
    process.env.CONTACT_INBOUND_EMAIL?.trim() ??
    process.env.EMAILJS_TO_EMAIL?.trim() ??
    "contact@berktugberke.com"
  );
}
