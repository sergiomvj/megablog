import React, { useState, useEffect } from 'react';
import { Screen } from '../types';
import { api } from '../services/api';

interface Blog {
    id: string;
    blog_key: string;
    blog_id: number;
    name: string;
    site_url: string;
    api_url: string;
    last_discovery: string;
    categories_json: string;
}

interface BlogsProps {
    onNavigate: (screen: Screen) => void;
}

const Blogs: React.FC<BlogsProps> = ({ onNavigate }) => {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [showAdd, setShowAdd] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSyncing, setIsSyncing] = useState<string | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        blog_key: '',
        blog_id: '',
        site_url: '',
        api_url: '',
        application_password: ''
    });

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        setIsLoading(true);
        try {
            const data = await api.getBlogs?.() || [];
            setBlogs(data);
        } catch (error) {
            console.error('Failed to fetch blogs', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddBlog = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.addBlog?.({
                ...formData,
                blog_id: parseInt(formData.blog_id)
            });
            setShowAdd(false);
            fetchBlogs();
        } catch (error) {
            alert('Failed to add blog');
        }
    };

    const syncBlog = async (id: string) => {
        setIsSyncing(id);
        try {
            await api.syncBlog?.(id);
            fetchBlogs();
        } catch (error) {
            alert('Sync failed. Check API URL and Password.');
        } finally {
            setIsSyncing(null);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-background-dark text-white">
            <header className="sticky top-0 z-50 flex items-center justify-between bg-background-dark/95 backdrop-blur-md px-6 py-4 border-b border-white/5">
                <div className="flex items-center gap-4">
                    <button onClick={() => onNavigate(Screen.DASHBOARD)} className="size-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors">
                        <span className="material-symbols-outlined">arrow_back_ios_new</span>
                    </button>
                    <h1 className="text-xl font-bold">Blogs Clientes</h1>
                </div>
                <button
                    onClick={() => setShowAdd(true)}
                    className="bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-glow transition-all active:scale-95 flex items-center gap-2"
                >
                    <span className="material-symbols-outlined text-sm">add</span>
                    NOVO SITE
                </button>
            </header>

            <main className="flex-1 overflow-y-auto p-6 no-scrollbar">
                {isLoading ? (
                    <div className="flex items-center justify-center h-40">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {blogs.length === 0 && !showAdd && (
                            <div className="text-center py-20 opacity-30">
                                <span className="material-symbols-outlined text-6xl mb-4">language</span>
                                <p>Nenhum blog cadastrado ainda.</p>
                            </div>
                        )}

                        {blogs.map(blog => (
                            <div key={blog.id} className="bg-surface-dark border border-white/5 rounded-2xl p-5 hover:border-primary/30 transition-all group">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-lg font-bold group-hover:text-primary transition-colors">{blog.name || 'Site Sem Nome'}</h3>
                                        <p className="text-xs text-slate-400 font-mono">{blog.blog_key} (ID: {blog.blog_id})</p>
                                    </div>
                                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${blog.last_discovery ? 'bg-emerald-500/10 text-emerald-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                                        {blog.last_discovery ? 'Sincronizado' : 'Pendente'}
                                    </span>
                                </div>

                                <div className="flex flex-col gap-2 mb-6">
                                    <div className="flex items-center gap-2 text-slate-400">
                                        <span className="material-symbols-outlined text-sm">link</span>
                                        <span className="text-xs truncate">{blog.site_url}</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                    <div className="text-[10px] text-slate-500 italic">
                                        {blog.last_discovery ? `Última sync: ${new Date(blog.last_discovery).toLocaleDateString()}` : 'Nunca sincronizado'}
                                    </div>
                                    <button
                                        onClick={() => syncBlog(blog.id)}
                                        disabled={isSyncing === blog.id}
                                        className="flex items-center gap-2 text-primary hover:text-blue-400 text-xs font-bold transition-colors disabled:opacity-50"
                                    >
                                        <span className={`material-symbols-outlined text-sm ${isSyncing === blog.id ? 'animate-spin' : ''}`}>sync</span>
                                        {isSyncing === blog.id ? 'SINCRONIZANDO...' : 'SINCRONIZAR AGORA'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Modal Simplificado para Adicionar */}
                {showAdd && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
                        <div className="bg-surface-dark w-full max-w-md rounded-3xl border border-white/10 p-8 shadow-2xl animate-in fade-in zoom-in duration-300">
                            <h2 className="text-2xl font-bold mb-6">Configurar Novo Site</h2>
                            <form onSubmit={handleAddBlog} className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Chave (blog_key do CSV)</label>
                                    <input
                                        required
                                        className="w-full bg-background-dark border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary outline-none"
                                        placeholder="ex: pnpmagazine"
                                        value={formData.blog_key}
                                        onChange={e => setFormData({ ...formData, blog_key: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">ID no WP</label>
                                        <input
                                            required type="number"
                                            className="w-full bg-background-dark border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary outline-none"
                                            placeholder="ex: 2"
                                            value={formData.blog_id}
                                            onChange={e => setFormData({ ...formData, blog_id: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Editor (Login)</label>
                                        <input
                                            disabled
                                            className="w-full bg-background-dark/50 border border-white/10 rounded-xl px-4 py-3 text-sm opacity-50 cursor-not-allowed"
                                            value="admin"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Endpoint API Autowriter</label>
                                    <input
                                        required
                                        className="w-full bg-background-dark border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary outline-none"
                                        placeholder="https://meusite.com/wp-json"
                                        value={formData.api_url}
                                        onChange={e => setFormData({ ...formData, api_url: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Application Password</label>
                                    <input
                                        required type="password"
                                        className="w-full bg-background-dark border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary outline-none font-mono"
                                        placeholder="xxxx xxxx xxxx xxxx"
                                        value={formData.application_password}
                                        onChange={e => setFormData({ ...formData, application_password: e.target.value })}
                                    />
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowAdd(false)}
                                        className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold py-3 rounded-xl transition-all"
                                    >
                                        CANCELAR
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 bg-primary hover:bg-blue-600 text-white font-bold py-3 rounded-xl shadow-glow transition-all"
                                    >
                                        SALVAR SITE
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Blogs;
