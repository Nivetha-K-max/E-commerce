import { useState } from 'react'
import { uploadImage } from '../api'
import { CATEGORIES } from '../constants/categories'

const EMPTY_PRODUCT = {
  name: '',
  price: '',
  category: '',
  description: '',
  imageUrl: '',
  inStock: true,
  isNewArrival: true,
}

export default function ProductForm({ initialProduct, onSubmit, onCancel, submitLabel = 'Add Product' }) {
  const [form, setForm] = useState(initialProduct || EMPTY_PRODUCT)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)

  const handleChange = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError(null)
    try {
      const { imageUrl } = await uploadImage(file)
      setForm((prev) => ({ ...prev, imageUrl }))
    } catch (err) {
      setError(err?.response?.data?.message || 'Image upload failed. Try a smaller JPG/PNG/WEBP.')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    if (!form.name || !form.price || !form.category) {
      setError('Name, price, and category are required.')
      return
    }
    setSaving(true)
    try {
      await onSubmit({ ...form, price: parseFloat(form.price) })
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not save product. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-white border border-taupe rounded-sm p-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-body text-charcoal/80 mb-1">Product name</label>
          <input
            type="text"
            value={form.name}
            onChange={handleChange('name')}
            className="w-full border border-taupe rounded-sm px-3 py-2 font-body focus:border-teal"
            placeholder="e.g. Kanjeevaram Silk Saree"
          />
        </div>
        <div>
          <label className="block text-sm font-body text-charcoal/80 mb-1">Price (₹)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={handleChange('price')}
            className="w-full border border-taupe rounded-sm px-3 py-2 font-body focus:border-teal"
            placeholder="e.g. 2499"
          />
        </div>
        <div>
          <label className="block text-sm font-body text-charcoal/80 mb-1">Category</label>
          <select
            value={form.category}
            onChange={handleChange('category')}
            className="w-full border border-taupe rounded-sm px-3 py-2 font-body bg-white focus:border-teal"
          >
            <option value="" disabled>Select a category</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-body text-charcoal/80 mb-1">Product photo</label>

          <div className="flex flex-col gap-3">
            <div>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageUpload}
                className="w-full font-body text-sm"
              />
              {uploading && <p className="text-xs text-charcoal/50 mt-1">Uploading…</p>}
            </div>

            <div>
              <label className="block text-xs font-body text-charcoal/60 mb-1">Or paste image URL</label>
              <input
                type="url"
                inputMode="url"
                placeholder="https://example.com/uploads/filename.jpg"
                value={form.imageUrl || ''}
                onChange={(e) => setForm((prev) => ({ ...prev, imageUrl: e.target.value }))}
                className="w-full border border-taupe rounded-sm px-3 py-2 font-body focus:border-teal"
              />
            </div>

            {form.imageUrl && !uploading && (
              <img
                src={form.imageUrl}
                alt="Preview"
                className="mt-1 h-20 w-20 object-cover rounded-sm border border-taupe"
                onError={(e) => {
                  // Avoid throwing errors into React; just hide broken preview.
                  e.currentTarget.style.display = 'none'
                }}
              />
            )}
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-body text-charcoal/80 mb-1">Description (optional)</label>
        <textarea
          value={form.description || ''}
          onChange={handleChange('description')}
          rows={2}
          className="w-full border border-taupe rounded-sm px-3 py-2 font-body focus:border-teal"
        />
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 font-body text-sm text-charcoal/80">
          <input type="checkbox" checked={form.inStock} onChange={handleChange('inStock')} />
          In stock
        </label>
        <label className="flex items-center gap-2 font-body text-sm text-charcoal/80">
          <input type="checkbox" checked={form.isNewArrival} onChange={handleChange('isNewArrival')} />
          Mark as New Arrival
        </label>
      </div>

      {error && <p className="text-maroon text-sm font-body">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving || uploading}
          className="bg-maroon text-ivory font-body font-medium px-5 py-2.5 rounded-sm hover:bg-maroon/90 transition-colors disabled:opacity-60"
        >
          {saving ? 'Saving…' : submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-charcoal/70 font-body px-5 py-2.5 rounded-sm border border-taupe hover:border-charcoal transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}
