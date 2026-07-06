import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProducts, createProduct, updateProduct, deleteProduct } from '../api'
import ProductForm from '../components/ProductForm'

export default function AdminDashboard() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [banner, setBanner] = useState(null)
  const [selected, setSelected] = useState(new Set())
  const navigate = useNavigate()

  const loadProducts = () => {
    setLoading(true)
    getProducts()
      .then(setProducts)
      .catch(() => setBanner({ type: 'error', text: 'Could not load products.' }))
      .finally(() => setLoading(false))
  }

  useEffect(loadProducts, [])

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    navigate('/admin/login')
  }

  const handleAdd = async (product) => {
    await createProduct(product)
    setShowAddForm(false)
    setBanner({ type: 'success', text: 'Product added.' })
    loadProducts()
  }

  const handleUpdate = async (id, product) => {
    await updateProduct(id, product)
    setEditingId(null)
    setBanner({ type: 'success', text: 'Product updated.' })
    loadProducts()
  }

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Remove "${name}" from the catalog?`)) return
    try {
      await deleteProduct(id)
      setBanner({ type: 'success', text: 'Product removed.' })
      loadProducts()
    } catch {
      setBanner({ type: 'error', text: 'Could not remove product.' })
    }
  }

  const toggleSelect = (id) => {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const selectAll = () => {
    setSelected(selected.size === products.length ? new Set() : new Set(products.map(p => p.id)))
  }

  const bulkToggleStock = async (inStock) => {
    try {
      await Promise.all(
        products
          .filter(p => selected.has(p.id))
          .map(p => updateProduct(p.id, { ...p, inStock }))
      )
      setSelected(new Set())
      setBanner({ type: 'success', text: `Marked ${selected.size} product(s) as ${inStock ? 'in stock' : 'out of stock'}.` })
      loadProducts()
    } catch {
      setBanner({ type: 'error', text: 'Bulk update failed.' })
    }
  }

  const inStockCount = products.filter(p => p.inStock).length
  const newArrivalCount = products.filter(p => p.isNewArrival).length

  return (
    <div className="max-w-4xl mx-auto px-5 sm:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl text-charcoal">Manage Catalog</h1>
        <button onClick={handleLogout} className="text-sm font-body text-charcoal/60 hover:text-maroon transition-colors">
          Log out
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total Products', value: products.length },
          { label: 'In Stock', value: inStockCount },
          { label: 'New Arrivals', value: newArrivalCount },
        ].map(s => (
          <div key={s.label} className="bg-white border border-taupe rounded-sm p-4 text-center">
            <p className="font-display text-3xl text-charcoal">{s.value}</p>
            <p className="font-body text-xs text-charcoal/50 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {banner && (
        <div className={`mb-6 px-4 py-2.5 rounded-sm text-sm font-body ${banner.type === 'error' ? 'bg-maroon/10 text-maroon' : 'bg-teal/10 text-teal'}`}>
          {banner.text}
        </div>
      )}

      <div className="mb-6">
        {!showAddForm ? (
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-charcoal text-ivory font-body font-medium px-5 py-2.5 rounded-sm hover:bg-charcoal/90 transition-colors"
          >
            + Add New Product
          </button>
        ) : (
          <ProductForm onSubmit={handleAdd} onCancel={() => setShowAddForm(false)} submitLabel="Add Product" />
        )}
      </div>

      {loading ? (
        <p className="font-body text-charcoal/50 py-10 text-center">Loading products…</p>
      ) : products.length === 0 ? (
        <p className="font-body text-charcoal/50 py-10 text-center">No products yet. Add your first one above.</p>
      ) : (
        <>
          {/* Bulk actions */}
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <label className="flex items-center gap-2 text-sm font-body text-charcoal/70 cursor-pointer">
              <input type="checkbox" checked={selected.size === products.length && products.length > 0} onChange={selectAll} className="accent-maroon" />
              Select all
            </label>
            {selected.size > 0 && (
              <>
                <span className="text-xs font-body text-charcoal/50">{selected.size} selected</span>
                <button onClick={() => bulkToggleStock(true)} className="text-xs font-body bg-teal/10 text-teal px-3 py-1.5 rounded-sm hover:bg-teal/20 transition-colors">
                  Mark In Stock
                </button>
                <button onClick={() => bulkToggleStock(false)} className="text-xs font-body bg-maroon/10 text-maroon px-3 py-1.5 rounded-sm hover:bg-maroon/20 transition-colors">
                  Mark Out of Stock
                </button>
              </>
            )}
          </div>

          <div className="flex flex-col gap-3">
            {products.map(product =>
              editingId === product.id ? (
                <ProductForm
                  key={product.id}
                  initialProduct={{ ...product, price: String(product.price) }}
                  onSubmit={(updated) => handleUpdate(product.id, updated)}
                  onCancel={() => setEditingId(null)}
                  submitLabel="Save Changes"
                />
              ) : (
                <div key={product.id} className="flex items-center gap-3 bg-white border border-taupe rounded-sm p-3">
                  <input
                    type="checkbox"
                    checked={selected.has(product.id)}
                    onChange={() => toggleSelect(product.id)}
                    className="accent-maroon flex-shrink-0"
                  />
                  <div className="h-16 w-16 flex-shrink-0 bg-taupe/20 rounded-sm overflow-hidden">
                    {product.imageUrl && <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body font-medium text-charcoal truncate">{product.name}</p>
                    <p className="text-sm text-charcoal/60 font-body">
                      ₹{product.price.toLocaleString('en-IN')} · {product.category}
                      {product.isNewArrival && ' · New'}
                      {!product.inStock && <span className="text-maroon"> · Out of stock</span>}
                    </p>
                  </div>
                  <div className="flex gap-3 flex-shrink-0">
                    <button onClick={() => setEditingId(product.id)} className="text-sm font-body text-teal hover:underline">Edit</button>
                    <button onClick={() => handleDelete(product.id, product.name)} className="text-sm font-body text-maroon hover:underline">Delete</button>
                  </div>
                </div>
              )
            )}
          </div>
        </>
      )}
    </div>
  )
}
