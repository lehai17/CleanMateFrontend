export function phoneLink(phone) {
  const value = typeof phone === "string" ? phone.trim() : "";
  if (!/^\+?[\d\s().-]+$/.test(value)) return null;
  const digits = value.replace(/\D/g, "");
  if (digits.length < 6 || digits.length > 15) return null;
  return `tel:${value.startsWith("+") ? "+" : ""}${digits}`;
}
