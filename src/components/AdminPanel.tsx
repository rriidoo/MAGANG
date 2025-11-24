import { useState, useEffect } from 'react';
import { X, Edit, Trash2, Plus, Save, Image as ImageIcon, Link as LinkIcon, Type, Search } from 'lucide-react';
import { useContent, ContentItem } from '../contexts/ContentContext';
import { supabase } from '../lib/supabase';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminPanel({ isOpen, onClose }: AdminPanelProps) {
  const { content, loading, refreshContent, updateContent, createContent, deleteContent } = useContent();
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSection, setSelectedSection] = useState<string>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({
    key: '',
    type: 'text' as 'text' | 'image' | 'link',
    value: '',
    label: '',
    section: 'hero',
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    } catch (error) {
      console.error('Auth check error:', error);
      setIsAuthenticated(false);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      await checkAuth();
    } catch (error: any) {
      alert(error.message || 'Login failed');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
  };

  const startEdit = (key: string) => {
    setEditingKey(key);
    setEditValue(content[key]?.value || '');
  };

  const cancelEdit = () => {
    setEditingKey(null);
    setEditValue('');
  };

  const saveEdit = async () => {
    if (!editingKey) return;
    try {
      await updateContent(editingKey, editValue);
      setEditingKey(null);
      setEditValue('');
    } catch (error: any) {
      alert(error.message || 'Failed to update content');
    }
  };

  const handleDelete = async (key: string) => {
    if (!confirm(`Are you sure you want to delete "${content[key]?.label}"?`)) return;
    try {
      await deleteContent(key);
    } catch (error: any) {
      alert(error.message || 'Failed to delete content');
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createContent(newItem);
      setNewItem({ key: '', type: 'text', value: '', label: '', section: 'hero' });
      setShowAddForm(false);
    } catch (error: any) {
      alert(error.message || 'Failed to create content');
    }
  };

  const sections = ['all', 'hero', 'about', 'positions', 'benefits', 'testimonials', 'faq', 'closing', 'footer'];
  const filteredContent = Object.values(content).filter((item) => {
    const matchesSearch = item.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.value.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSection = selectedSection === 'all' || item.section === selectedSection;
    return matchesSearch && matchesSection;
  });

  if (!isOpen) return null;

  if (authLoading) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-8">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
          <h2 className="text-2xl font-black text-slate-900 mb-6">Admin Login</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
              <input
                type="email"
                name="email"
                required
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                placeholder="admin@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
              <input
                type="password"
                name="password"
                required
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-500 to-lime-500 hover:from-emerald-600 hover:to-lime-600 text-white font-black py-3 rounded-xl transition-all"
            >
              Login
            </button>
          </form>
          <button
            onClick={onClose}
            className="mt-4 w-full text-slate-600 hover:text-slate-900 font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 overflow-y-auto">
      <div className="min-h-screen bg-white">
        <div className="sticky top-0 bg-gradient-to-r from-emerald-600 to-lime-500 text-white p-6 shadow-lg z-10">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <h1 className="text-3xl font-black">Admin Panel - Content Management</h1>
            <div className="flex items-center gap-4">
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-bold transition-colors"
              >
                Logout
              </button>
              <button
                onClick={onClose}
                className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-6">
          {/* Filters and Search */}
          <div className="bg-slate-50 rounded-2xl p-6 mb-6 border-2 border-slate-200">
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search content..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                />
              </div>
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className="px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none font-medium"
              >
                {sections.map((section) => (
                  <option key={section} value={section}>
                    {section === 'all' ? 'All Sections' : section.charAt(0).toUpperCase() + section.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-lime-500 hover:from-emerald-600 hover:to-lime-600 text-white font-black px-6 py-3 rounded-xl transition-all"
            >
              <Plus className="w-5 h-5" />
              Add New Content
            </button>
          </div>

          {/* Add Form */}
          {showAddForm && (
            <div className="bg-emerald-50 rounded-2xl p-6 mb-6 border-2 border-emerald-200">
              <h3 className="text-xl font-black text-slate-900 mb-4">Add New Content Item</h3>
              <form onSubmit={handleAdd} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Key (unique identifier)</label>
                    <input
                      type="text"
                      required
                      value={newItem.key}
                      onChange={(e) => setNewItem({ ...newItem, key: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                      placeholder="e.g., hero_title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Label (display name)</label>
                    <input
                      type="text"
                      required
                      value={newItem.label}
                      onChange={(e) => setNewItem({ ...newItem, label: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                      placeholder="e.g., Hero Title"
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Type</label>
                    <select
                      required
                      value={newItem.type}
                      onChange={(e) => setNewItem({ ...newItem, type: e.target.value as 'text' | 'image' | 'link' })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                    >
                      <option value="text">Text</option>
                      <option value="image">Image URL</option>
                      <option value="link">Link URL</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Section</label>
                    <select
                      required
                      value={newItem.section}
                      onChange={(e) => setNewItem({ ...newItem, section: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                    >
                      {sections.filter(s => s !== 'all').map((section) => (
                        <option key={section} value={section}>
                          {section.charAt(0).toUpperCase() + section.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Value</label>
                  <textarea
                    required
                    value={newItem.value}
                    onChange={(e) => setNewItem({ ...newItem, value: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                    placeholder="Enter content value..."
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-lime-500 hover:from-emerald-600 hover:to-lime-600 text-white font-black px-6 py-3 rounded-xl transition-all"
                  >
                    <Save className="w-5 h-5" />
                    Create
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false);
                      setNewItem({ key: '', type: 'text', value: '', label: '', section: 'hero' });
                    }}
                    className="px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Content List */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-slate-600 font-medium">Loading content...</p>
            </div>
          ) : filteredContent.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border-2 border-slate-200">
              <p className="text-slate-600 font-medium text-lg">No content found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredContent.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-6 border-2 border-slate-200 hover:border-emerald-400 transition-all shadow-lg"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {item.type === 'text' && <Type className="w-5 h-5 text-blue-500" />}
                        {item.type === 'image' && <ImageIcon className="w-5 h-5 text-purple-500" />}
                        {item.type === 'link' && <LinkIcon className="w-5 h-5 text-green-500" />}
                        <h3 className="text-xl font-black text-slate-900">{item.label}</h3>
                        <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full">
                          {item.section}
                        </span>
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">
                          {item.type}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 font-mono mb-2">Key: {item.key}</p>
                      {editingKey === item.key ? (
                        <div className="space-y-3">
                          {item.type === 'text' ? (
                            <textarea
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              rows={4}
                              className="w-full px-4 py-3 rounded-xl border-2 border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                            />
                          ) : (
                            <input
                              type={item.type === 'link' ? 'url' : 'url'}
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              className="w-full px-4 py-3 rounded-xl border-2 border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                            />
                          )}
                          {item.type === 'image' && editValue && (
                            <img src={editValue} alt="Preview" className="max-w-xs rounded-lg border-2 border-slate-200" />
                          )}
                          <div className="flex gap-3">
                            <button
                              onClick={saveEdit}
                              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-4 py-2 rounded-lg transition-colors"
                            >
                              <Save className="w-4 h-4" />
                              Save
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-lg transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          {item.type === 'text' ? (
                            <p className="text-slate-700 font-medium">{item.value}</p>
                          ) : item.type === 'image' ? (
                            <div>
                              <p className="text-slate-600 font-mono text-sm mb-2 break-all">{item.value}</p>
                              <img src={item.value} alt={item.label} className="max-w-xs rounded-lg border-2 border-slate-200" />
                            </div>
                          ) : (
                            <a
                              href={item.value}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-emerald-600 hover:text-emerald-700 font-medium break-all"
                            >
                              {item.value}
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                    {editingKey !== item.key && (
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => startEdit(item.key)}
                          className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.key)}
                          className="p-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

