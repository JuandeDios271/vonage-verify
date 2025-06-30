export default function sanitizePhone(phone) {
  const cleaned = phone.replace(/[^\d+]/g, '')
  if (!cleaned.startsWith('+52')) {
    throw new Error('Solo se permiten números de México con formato +52...')
  }
  return cleaned
}
