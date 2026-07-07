const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '919003753632'

export function buildOrderLink(product) {
  const message = `Hi! I'd like to order:\n\n*${product.name}*\nPrice: ₹${product.price}\n\nIs this available?`
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

export function buildCartOrderLink(items) {
  const lines = items.map(i => `• ${i.name} × ${i.qty} — ₹${(i.price * i.qty).toLocaleString('en-IN')}`).join('\n')
  const total = items.reduce((s, i) => s + i.price * i.qty, 0)
  const message = `Hi! I'd like to order the following:\n\n${lines}\n\n*Total: ₹${total.toLocaleString('en-IN')}*\n\nPlease confirm availability.`
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

export function buildGeneralInquiryLink() {
  const message = `Hi! I have a question about your collection.`
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}
