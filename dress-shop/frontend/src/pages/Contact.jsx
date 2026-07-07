import { useState } from 'react'
import { useToast } from '../context/ToastContext'

const SHOP_NAME = import.meta.env.VITE_SHOP_NAME || 'U99'
const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '919003753632'
const CONTACT_PHONE = import.meta.env.VITE_CONTACT_PHONE || '+91 90037 53632'
const CONTACT_EMAIL = import.meta.env.VITE_CONTACT_EMAIL || ''

export default function Contact() {
  const toast = useToast()
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [errors, setErrors] = useState({})

  const handleChange = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }))
    setErrors(er => ({ ...er, [field]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email.trim()) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.message.trim()) e.message = 'Message is required'
    return e
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    const text = [
      `*New Contact Form Message*`,
      ``,
      `*Name:* ${form.name}`,
      `*Email:* ${form.email}`,
      form.phone ? `*Phone:* ${form.phone}` : null,
      ``,
      `*Message:*`,
      form.message,
    ].filter(line => line !== null).join('\n')

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer')
    toast('Opening WhatsApp with your message…')
    setForm({ name: '', email: '', phone: '', message: '' })
  }

  return (
    <div className="bg-ivory min-h-screen">
      <div className="max-w-5xl mx-auto px-5 sm:px-8 py-10 sm:py-14">

        {/* Header */}
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose/80 mb-2">Get in touch</p>
          <h1 className="font-display text-3xl sm:text-4xl text-charcoal">Contact Us</h1>
          <p className="text-muted text-sm mt-2 max-w-md">
            Have a question about an order or our collection? We'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-8">

          {/* Contact info */}
          <div className="flex flex-col gap-4">
            <div className="bg-white rounded-2xl shadow-card p-6 flex flex-col gap-5">
              <h2 className="font-display text-lg text-charcoal">Contact Information</h2>

              <a href={`tel:${CONTACT_PHONE.replace(/\s/g, '')}`}
                className="flex items-start gap-4 group">
                <div className="w-10 h-10 bg-rose/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-rose" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-0.5">Phone</p>
                  <p className="text-sm font-medium text-charcoal group-hover:text-rose transition-colors">{CONTACT_PHONE}</p>
                </div>
              </a>

              <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer"
                className="flex items-start gap-4 group">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.855L0 24l6.335-1.508A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.65-.49-5.19-1.348l-.37-.22-3.762.896.952-3.668-.242-.378A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-0.5">WhatsApp</p>
                  <p className="text-sm font-medium text-charcoal group-hover:text-emerald-600 transition-colors">+{WHATSAPP_NUMBER}</p>
                </div>
              </a>

              {CONTACT_EMAIL && (
                <a href={`mailto:${CONTACT_EMAIL}`} className="flex items-start gap-4 group">
                  <div className="w-10 h-10 bg-rose/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-rose" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-0.5">Email</p>
                    <p className="text-sm font-medium text-charcoal group-hover:text-rose transition-colors">{CONTACT_EMAIL}</p>
                  </div>
                </a>
              )}
            </div>

            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5">
              <p className="text-sm font-semibold text-emerald-800 mb-1">Fastest response</p>
              <p className="text-xs text-emerald-700 leading-relaxed">
                Message us directly on WhatsApp for the quickest reply. We typically respond within a few hours.
              </p>
              <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hi! I have a question about your collection.')}`}
                target="_blank" rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-2 bg-emerald-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl hover:bg-emerald-700 transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.855L0 24l6.335-1.508A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.65-.49-5.19-1.348l-.37-.22-3.762.896.952-3.668-.242-.378A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                </svg>
                Chat on WhatsApp
              </a>
            </div>
          </div>

          {/* Contact form */}
          <div className="bg-white rounded-2xl shadow-card p-6 sm:p-8">
            <h2 className="font-display text-lg text-charcoal mb-1">Send us a message</h2>
            <p className="text-xs text-muted mb-6">Fill in the form and we'll open WhatsApp with your message pre-filled.</p>

            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-charcoal mb-1.5">Name <span className="text-rose">*</span></label>
                  <input
                    type="text" value={form.name} onChange={handleChange('name')}
                    placeholder="Your name" autoComplete="name"
                    className={`w-full bg-cream border rounded-xl px-4 py-3 text-sm text-charcoal placeholder-muted focus:outline-none focus:ring-2 focus:ring-rose/30 focus:border-rose transition-all ${errors.name ? 'border-rose' : 'border-taupe'}`}
                  />
                  {errors.name && <p className="text-rose text-xs mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-charcoal mb-1.5">Email <span className="text-rose">*</span></label>
                  <input
                    type="email" value={form.email} onChange={handleChange('email')}
                    placeholder="you@example.com" autoComplete="email"
                    className={`w-full bg-cream border rounded-xl px-4 py-3 text-sm text-charcoal placeholder-muted focus:outline-none focus:ring-2 focus:ring-rose/30 focus:border-rose transition-all ${errors.email ? 'border-rose' : 'border-taupe'}`}
                  />
                  {errors.email && <p className="text-rose text-xs mt-1">{errors.email}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1.5">
                  Phone Number <span className="text-muted font-normal">(optional)</span>
                </label>
                <input
                  type="tel" value={form.phone} onChange={handleChange('phone')}
                  placeholder="10-digit mobile number" autoComplete="tel"
                  className="w-full bg-cream border border-taupe rounded-xl px-4 py-3 text-sm text-charcoal placeholder-muted focus:outline-none focus:ring-2 focus:ring-rose/30 focus:border-rose transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1.5">Message / Query <span className="text-rose">*</span></label>
                <textarea
                  value={form.message} onChange={handleChange('message')}
                  placeholder="Tell us what you're looking for, or ask us anything…"
                  rows={5}
                  className={`w-full bg-cream border rounded-xl px-4 py-3 text-sm text-charcoal placeholder-muted focus:outline-none focus:ring-2 focus:ring-rose/30 focus:border-rose transition-all resize-none ${errors.message ? 'border-rose' : 'border-taupe'}`}
                />
                {errors.message && <p className="text-rose text-xs mt-1">{errors.message}</p>}
              </div>

              <button
                type="submit"
                className="w-full bg-rose-gradient text-white font-semibold py-3.5 rounded-xl shadow-btn hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.855L0 24l6.335-1.508A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.65-.49-5.19-1.348l-.37-.22-3.762.896.952-3.668-.242-.378A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                </svg>
                Send via WhatsApp
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
