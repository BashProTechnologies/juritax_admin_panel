import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Plus, Trash2, Save, Image as ImageIcon, ChevronRight, Search, Tag, Briefcase, Eye, EyeOff } from 'lucide-react';
import { Product, Category, Brand } from './types';

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [showPrices, setShowPrices] = useState(true);
  
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [newCategory, setNewCategory] = useState('');
  const [newBrand, setNewBrand] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [pRes, cRes, bRes, sRes] = await Promise.all([
      fetch('/api/products'),
      fetch('/api/categories'),
      fetch('/api/brands'),
      fetch('/api/settings')
    ]);
    
    setProducts(await pRes.json());
    setCategories(await cRes.json());
    setBrands(await bRes.json());
    
    const settings = await sRes.json();
    const priceSetting = settings.find((s: any) => s.id === 'show_prices');
    if (priceSetting) setShowPrices(priceSetting.value === 'true');
  };

  const handleSaveProduct = async () => {
    if (!selectedProduct) return;
    const method = selectedProduct.id ? 'PUT' : 'POST';
    const url = selectedProduct.id ? `/api/products/${selectedProduct.id}` : '/api/products';
    
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(selectedProduct)
    });

    if (res.ok) {
      fetchData();
      alert('Məhsul yadda saxlanıldı!');
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm('Bu məhsulu silmək istədiyinizə əminsiniz?')) return;
    const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
    if (res.ok) {
      fetchData();
      if (selectedProduct?.id === id) setSelectedProduct(null);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;
    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newCategory })
    });
    if (res.ok) {
      setNewCategory('');
      fetchData();
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!confirm('Bu kateqoriyanı silmək istədiyinizə əminsiniz?')) return;
    await fetch(`/api/categories/${id}`, { method: 'DELETE' });
    fetchData();
  };

  const handleAddBrand = async () => {
    if (!newBrand.trim()) return;
    const res = await fetch('/api/brands', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newBrand })
    });
    if (res.ok) {
      setNewBrand('');
      fetchData();
    }
  };

  const handleDeleteBrand = async (id: number) => {
    if (!confirm('Bu brendi silmək istədiyinizə əminsiniz?')) return;
    await fetch(`/api/brands/${id}`, { method: 'DELETE' });
    fetchData();
  };

  const togglePriceVisibility = async () => {
    const newValue = !showPrices;
    const res = await fetch('/api/settings/show_prices', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value: String(newValue) })
    });
    if (res.ok) setShowPrices(newValue);
  };

  const handleNewProduct = () => {
    setSelectedProduct({
      name: 'Yeni Məhsul',
      subtitle: '',
      description: '',
      price: 0,
      image: '',
      category_id: categories[0]?.id || 0,
      brand_id: brands[0]?.id || 0,
      status: 'Aktiv'
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-8 flex gap-8 h-[calc(100vh-64px)] overflow-hidden"
    >
      {/* Left Sidebar: Products List & Quick Actions */}
      <div className="w-1/3 flex flex-col gap-6 overflow-y-auto pr-2">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Məhsullar</h2>
          <div className="flex gap-2">
            <button 
              onClick={togglePriceVisibility}
              className={`p-2 rounded-lg transition-colors ${showPrices ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-400'}`}
              title={showPrices ? "Qiymətlər göstərilir" : "Qiymətlər gizlidir"}
            >
              {showPrices ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
            <button onClick={handleNewProduct} className="bg-juritax-gold text-white p-2 rounded-lg flex items-center gap-2 text-sm font-bold">
              <Plus size={18} />
              Yeni
            </button>
          </div>
        </div>

        {/* Categories & Brands Management */}
        <div className="space-y-4">
          <div className="card p-4 space-y-3">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Kateqoriyalar</h4>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <div key={cat.id} className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg text-sm group">
                  <span>{cat.name}</span>
                  <button onClick={() => handleDeleteCategory(cat.id)} className="text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
              <div className="flex items-center gap-2 w-full mt-2">
                <input 
                  type="text" 
                  placeholder="Yeni kateqoriya"
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value)}
                  className="flex-1 bg-gray-100 border-none rounded-lg px-3 py-1.5 text-xs focus:ring-1 focus:ring-juritax-gold"
                />
                <button onClick={handleAddCategory} className="p-1.5 bg-juritax-gold text-white rounded-lg">
                  <Plus size={14} />
                </button>
              </div>
            </div>
          </div>

          <div className="card p-4 space-y-3">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Brendlər</h4>
            <div className="flex flex-wrap gap-2">
              {brands.map(brand => (
                <div key={brand.id} className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg text-sm group">
                  <span>{brand.name}</span>
                  <button onClick={() => handleDeleteBrand(brand.id)} className="text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
              <div className="flex items-center gap-2 w-full mt-2">
                <input 
                  type="text" 
                  placeholder="Yeni brend"
                  value={newBrand}
                  onChange={e => setNewBrand(e.target.value)}
                  className="flex-1 bg-gray-100 border-none rounded-lg px-3 py-1.5 text-xs focus:ring-1 focus:ring-juritax-gold"
                />
                <button onClick={handleAddBrand} className="p-1.5 bg-juritax-gold text-white rounded-lg">
                  <Plus size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Product List */}
        <div className="space-y-3">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Məhsul axtar..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-juritax-gold"
            />
          </div>
          {products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).map(product => (
            <div
              key={product.id}
              onClick={() => setSelectedProduct(product)}
              className={`w-full card p-3 flex items-center justify-between cursor-pointer transition-all ${
                selectedProduct?.id === product.id ? 'bg-juritax-gold/10 border-juritax-gold ring-1 ring-juritax-gold' : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                  {product.image ? (
                    <img src={product.image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300"><ImageIcon size={20} /></div>
                  )}
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-gray-800 truncate text-sm">{product.name}</h4>
                  <p className="text-[10px] text-gray-400 truncate">{product.category_name} • {product.brand_name}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-xs font-bold text-juritax-gold">{product.price} AZN</span>
                <button 
                  onClick={(e) => { e.stopPropagation(); handleDeleteProduct(product.id); }}
                  className="text-red-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Content: Product Editor */}
      <div className="flex-1 card p-8 overflow-y-auto">
        {selectedProduct ? (
          <div className="space-y-8">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold">Məhsul Redaktəsi</h2>
                <p className="text-gray-400 text-sm mt-1">Məhsul məlumatlarını və saytda görünüşünü tənzimləyin.</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-500">Aktiv</span>
                <button 
                  onClick={() => setSelectedProduct({...selectedProduct, status: selectedProduct.status === 'Aktiv' ? 'Deaktiv' : 'Aktiv'})}
                  className={`w-12 h-6 rounded-full transition-colors relative ${selectedProduct.status === 'Aktiv' ? 'bg-juritax-gold' : 'bg-gray-200'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${selectedProduct.status === 'Aktiv' ? 'right-1' : 'left-1'}`} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              {/* Image Upload */}
              <div className="space-y-4">
                <label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">MƏHSUL ŞƏKLİ</label>
                <div className="aspect-square bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center overflow-hidden relative group">
                  {selectedProduct.image ? (
                    <>
                      <img src={selectedProduct.image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <label className="cursor-pointer bg-white text-gray-800 px-4 py-2 rounded-lg text-xs font-bold">Dəyişdir</label>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center text-gray-400">
                      <ImageIcon size={48} className="mb-2 opacity-20" />
                      <p className="text-xs">Şəkil yükləmək üçün klikləyin</p>
                    </div>
                  )}
                  <input 
                    type="file" 
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    accept="image/*"
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => setSelectedProduct({...selectedProduct, image: reader.result as string});
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </div>
              </div>

              {/* Basic Info */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">ƏSAS BAŞLIQ *</label>
                  <input 
                    type="text" 
                    value={selectedProduct.name}
                    onChange={e => setSelectedProduct({...selectedProduct, name: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 text-sm focus:outline-none focus:ring-1 focus:ring-juritax-gold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">ALTBAŞLIQ</label>
                  <input 
                    type="text" 
                    value={selectedProduct.subtitle}
                    onChange={e => setSelectedProduct({...selectedProduct, subtitle: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 text-sm focus:outline-none focus:ring-1 focus:ring-juritax-gold"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">QİYMƏT (AZN)</label>
                    <input 
                      type="number" 
                      value={selectedProduct.price}
                      onChange={e => setSelectedProduct({...selectedProduct, price: parseFloat(e.target.value)})}
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 text-sm focus:outline-none focus:ring-1 focus:ring-juritax-gold"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">KATEQORİYA</label>
                    <select 
                      value={selectedProduct.category_id}
                      onChange={e => setSelectedProduct({...selectedProduct, category_id: parseInt(e.target.value)})}
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 text-sm focus:outline-none focus:ring-1 focus:ring-juritax-gold"
                    >
                      {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">BREND</label>
                  <select 
                    value={selectedProduct.brand_id}
                    onChange={e => setSelectedProduct({...selectedProduct, brand_id: parseInt(e.target.value)})}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 text-sm focus:outline-none focus:ring-1 focus:ring-juritax-gold"
                  >
                    {brands.map(brand => <option key={brand.id} value={brand.id}>{brand.name}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">HAQQINDA (DAHA ÇOX)</label>
              <textarea 
                rows={6}
                value={selectedProduct.description}
                onChange={e => setSelectedProduct({...selectedProduct, description: e.target.value})}
                className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 text-sm focus:outline-none focus:ring-1 focus:ring-juritax-gold resize-none"
                placeholder="Məhsul haqqında ətraflı məlumat..."
              />
            </div>

            <div className="flex justify-end gap-4 pt-8 border-t border-gray-100">
              <button onClick={() => setSelectedProduct(null)} className="btn-secondary">Ləğv et</button>
              <button onClick={handleSaveProduct} className="btn-primary flex items-center gap-2">
                <Save size={18} />
                Yadda saxla
              </button>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <Search size={48} className="mb-4 opacity-20" />
            <p>Redaktə etmək üçün bir məhsul seçin və ya yenisini əlavə edin</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProductsPage;
