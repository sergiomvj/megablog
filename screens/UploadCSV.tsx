import React, { useState } from 'react';
import { Screen } from '../types';
import { api } from '../services/api';

interface UploadCSVProps {
  onNavigate: (screen: Screen, id?: string) => void;
}

const UploadCSV: React.FC<UploadCSVProps> = ({ onNavigate }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('csv', file);

    try {
      const response = await api.uploadCSV(formData);
      console.log('Upload success:', response);
      onNavigate(Screen.QUEUE);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload CSV. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const downloadTemplate = () => {
    const csvContent = "post_title,focus_keywords,target_word_count\nExemplo de Título do Artigo,\"seo, tecnologia, automação\",1200\nComo usar IA no Marketing,\"marketing digital, ia, gpt\",800";
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "smartblog_template.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col h-screen bg-background-dark">
      <header className="sticky top-0 z-50 flex items-center justify-between bg-background-dark/95 backdrop-blur-md px-4 py-3 border-b border-white/5">
        <button onClick={() => onNavigate(Screen.DASHBOARD)} className="size-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors">
          <span className="material-symbols-outlined">arrow_back_ios_new</span>
        </button>
        <h1 className="text-lg font-bold flex-1 text-center pr-10">Upload CSV</h1>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar">
        <div className="flex w-full items-center justify-center gap-2 py-6">
          <div className="h-1.5 w-6 rounded-full bg-primary"></div>
          <div className="h-1.5 w-1.5 rounded-full bg-slate-700"></div>
          <div className="h-1.5 w-1.5 rounded-full bg-slate-700"></div>
          <div className="h-1.5 w-1.5 rounded-full bg-slate-700"></div>
        </div>

        <div className="px-6 pb-2">
          <h2 className="text-2xl font-bold pb-2">Import Article Data</h2>
          <p className="text-slate-400 text-sm font-normal leading-relaxed">
            Select a CSV file containing your article topics. Ensure your file is strictly formatted for the SmartBlog engine.
          </p>
        </div>

        <div className="px-6 py-6">
          <label className="group relative flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-slate-700 bg-surface-dark px-6 py-10 transition-all hover:border-primary hover:bg-white/5 cursor-pointer">
            <input accept=".csv" className="hidden" type="file" onChange={handleFileChange} />
            <div className={`flex size-14 items-center justify-center rounded-full transition-transform duration-300 ${file ? 'bg-emerald-500/10 text-emerald-500' : 'bg-primary/10 text-primary group-hover:scale-110'}`}>
              <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>{file ? 'check_circle' : 'cloud_upload'}</span>
            </div>
            <div className="flex flex-col items-center gap-1 text-center">
              <p className="text-lg font-bold truncate max-w-[200px]">{file ? file.name : 'Tap to browse files'}</p>
              <p className="text-slate-400 text-xs font-normal">Supports .csv (Max 5MB)</p>
            </div>
            {!file && (
              <div className="mt-2 flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-white shadow-sm shadow-primary/30 group-hover:shadow-primary/50">
                <span className="text-sm font-bold leading-normal tracking-wide">Select File</span>
              </div>
            )}
          </label>
        </div>

        <div className="px-6 pb-32">
          <div className="rounded-xl bg-surface-dark border border-white/5 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Required CSV Format</h3>
              <button
                onClick={downloadTemplate}
                className="flex items-center gap-1 text-primary hover:text-blue-400 text-xs font-medium active:scale-95 transition-transform"
              >
                <span className="material-symbols-outlined text-[18px]">download</span>
                Template
              </button>
            </div>
            <div className="space-y-4">
              {[
                { col: 'post_title', desc: 'The main headline for the generated article.' },
                { col: 'focus_keywords', desc: 'Comma-separated keywords for SEO targeting.' },
                { col: 'target_word_count', desc: 'Estimated length (e.g., 800, 1500).' }
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-green-500 mt-0.5" style={{ fontSize: '18px' }}>check_circle</span>
                  <div>
                    <p className="font-mono text-xs font-semibold text-slate-200 bg-black/30 px-1.5 py-0.5 rounded inline-block mb-1">{item.col}</p>
                    <p className="text-xs text-slate-400 leading-snug">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex items-center gap-2 rounded-lg bg-yellow-500/10 p-3 border border-yellow-500/20">
              <span className="material-symbols-outlined text-yellow-500 shrink-0 text-[18px]">info</span>
              <p className="text-[10px] text-yellow-500 font-medium">Please ensure your file uses UTF-8 encoding to avoid special character errors.</p>
            </div>
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background-dark/80 backdrop-blur-xl border-t border-white/5 z-40 max-w-md mx-auto">
        <button
          disabled={!file || isUploading}
          onClick={handleSubmit}
          className={`w-full rounded-xl font-bold py-3.5 text-base flex items-center justify-center gap-2 transition-all ${file ? 'bg-primary text-white shadow-lg shadow-primary/20 hover:bg-blue-600' : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
        >
          {isUploading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
          <span>Generate Articles</span>
        </button>
        <div className="h-6"></div>
      </div>
    </div>
  );
};

export default UploadCSV;
