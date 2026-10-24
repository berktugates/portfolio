/** Form gönderimlerinin gittiği adres — yalnızca sunucu tarafında kullanın (kamuya yazdırılmaz). */
export function contactInboundEmail(): string | null {
  const raw =
    process.env.CONTACT_INBOUND_EMAIL?.trim() ?? process.env.EMAILJS_TO_EMAIL?.trim() ?? "";
  return raw || null;
}
