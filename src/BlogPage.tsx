import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Plus, Trash2, Save, Image as ImageIcon, Search, FileText, ExternalLink, HelpCircle } from 'lucide-react';
import { BlogPost } from './types';

const BlogPage: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const res = await fetch('/api/blog');
    setPosts(await res.json());
  };

  const generateSlug = (text: string) => {
    const azChars: Record<string, string> = {
      'ə': 'e', 'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
      'Ə': 'e', 'Ç': 'c', 'Ğ': 'g', 'İ': 'i', 'Ö': 'o', 'Ş': 's', 'Ü': 'u'
    };
    
    let slug = text.toLowerCase();
    Object.keys(azChars).forEach(char => {
      slug = slug.replace(new RegExp(char, 'g'), azChars[char]);
    });
    
    return slug
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleSave = async () => {
    if (!selectedPost) return;
    const method = selectedPost.id ? 'PUT' : 'POST';
    const url = selectedPost.id ? `/api/blog/${selectedPost.id}` : '/api/blog';
    
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(selectedPost)
    });

    if (res.ok) {
      fetchPosts();
      alert('Yazı yadda saxlanıldı!');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bu yazını silmək istədiyinizə əminsiniz?')) return;
    const res = await fetch(`/api/blog/${id}`, { method: 'DELETE' });
    if (res.ok) {
      fetchPosts();
      if (selectedPost?.id === id) setSelectedPost(null);
    }
  };

  const handleNewPost = () => {
    setSelectedPost({
      id: 0,
      title: 'Yeni Blog Yazısı',
      subtitle: '',
      content: '',
      image: '',
      slug: '',
      status: 'Aktiv',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
  };

  const updateTitle = (title: string) => {
    if (selectedPost) {
      setSelectedPost({
        ...selectedPost,
        title,
        slug: generateSlug(title)
      });
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-8 flex gap-8 h-[calc(100vh-64px)] overflow-hidden"
    >
      {/* Left Sidebar: Posts List */}
      <div className="w-1/3 flex flex-col gap-6 overflow-y-auto pr-2">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Blog Yazıları</h2>
          <button onClick={handleNewPost} className="bg-juritax-gold text-white p-2 rounded-lg flex items-center gap-2 text-sm font-bold">
            <Plus size={18} />
            Yeni
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text" 
            placeholder="Yazı axtar..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-juritax-gold"
          />
        </div>

        <div className="space-y-3">
          {posts.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase())).map(post => (
            <div
              key={post.id}
              onClick={() => setSelectedPost(post)}
              className={`w-full card p-3 flex items-center justify-between cursor-pointer transition-all ${
                selectedPost?.id === post.id ? 'bg-juritax-gold/10 border-juritax-gold ring-1 ring-juritax-gold' : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                  {post.image ? (
                    <img src={post.image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300"><ImageIcon size={20} /></div>
                  )}
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-gray-800 truncate text-sm">{post.title}</h4>
                  <p className="text-[10px] text-gray-400 truncate">
                    {new Date(post.created_at).toLocaleDateString('az-AZ')}
                  </p>
                </div>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); handleDelete(post.id); }}
                className="text-red-400 hover:text-red-600 transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Right Content: Editor */}
      <div className="flex-1 card p-8 overflow-y-auto">
        {selectedPost ? (
          <div key={selectedPost.id} className="space-y-8">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold">Yazı Redaktəsi</h2>
                <p className="text-gray-400 text-sm mt-1">Blog məzmununu və SEO tənzimləmələrini idarə edin.</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-500">Aktiv</span>
                <button 
                  onClick={() => setSelectedPost({...selectedPost, status: selectedPost.status === 'Aktiv' ? 'Deaktiv' : 'Aktiv'})}
                  className={`w-12 h-6 rounded-full transition-colors relative ${selectedPost.status === 'Aktiv' ? 'bg-juritax-gold' : 'bg-gray-200'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${selectedPost.status === 'Aktiv' ? 'right-1' : 'left-1'}`} />
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">BAŞLIQ *</label>
                <input 
                  type="text" 
                  value={selectedPost.title}
                  onChange={e => updateTitle(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 text-sm focus:outline-none focus:ring-1 focus:ring-juritax-gold font-bold"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">SEO URL (SLUG)</label>
                <div className="flex items-center gap-2 bg-gray-100 p-3 rounded-xl text-xs text-gray-500">
                  <ExternalLink size={14} />
                  <span>https://site.az/news/{selectedPost.id || 'ID'}/{selectedPost.slug}</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">ALT BAŞLIQ</label>
                <input 
                  type="text" 
                  value={selectedPost.subtitle}
                  onChange={e => setSelectedPost({...selectedPost, subtitle: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 text-sm focus:outline-none focus:ring-1 focus:ring-juritax-gold"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">ƏSAS ŞƏKİL</label>
                <div className="aspect-video bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center overflow-hidden relative group">
                  {selectedPost.image ? (
                    <>
                      <img src={selectedPost.image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <label className="cursor-pointer bg-white text-gray-800 px-4 py-2 rounded-lg text-xs font-bold">Dəyişdir</label>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center text-gray-400">
                      <ImageIcon size={48} className="mb-2 opacity-20" />
                      <p className="text-xs">Blog şəkli yükləyin</p>
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
                        reader.onloadend = () => setSelectedPost({...selectedPost, image: reader.result as string});
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">BLOG YAZISI (MƏZMUN)</label>
                <textarea 
                  rows={12}
                  value={selectedPost.content || ''}
                  onChange={e => setSelectedPost({...selectedPost, content: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 text-sm focus:outline-none focus:ring-1 focus:ring-juritax-gold resize-none"
                  placeholder="Məqalə mətni bura daxil edilir..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-8 border-t border-gray-100">
              <button onClick={() => setSelectedPost(null)} className="btn-secondary">Ləğv et</button>
              <button onClick={handleSave} className="btn-primary flex items-center gap-2">
                <Save size={18} />
                Yadda saxla
              </button>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <FileText size={48} className="mb-4 opacity-20" />
            <p>Redaktə etmək üçün bir yazı seçin və ya yenisini əlavə edin</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default BlogPage;
