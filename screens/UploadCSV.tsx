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
    const headers = "blog,category,article_style,objective,theme,word_count,language,tags,tone,cta,featured_image_url,top_image_url,featured_image_alt,top_image_alt,sources";
    const example = "pnpmagazine,Fitness,analitico,Gerar leads para consultoria,Treino HIIT para iniciantes,1000,pt,\"hiit;emagrecimento;cardio\",\"moderno;direto\",\"Agende uma avaliação\",,,,";
    const csvContent = `${headers}\n${example}`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "autowriter_template.csv");
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
        <h1 className="text-lg font-bold flex-1 text-center pr-10 text-white">Upload CSV</h1>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar">
        <div className="flex w-full items-center justify-center gap-2 py-6">
          <div className="h-1.5 w-6 rounded-full bg-primary shadow-glow"></div>
          <div className="h-1.5 w-1.5 rounded-full bg-white/10"></div>
          <div className="h-1.5 w-1.5 rounded-full bg-white/10"></div>
          <div className="h-1.5 w-1.5 rounded-full bg-white/10"></div>
        </div>

        <div className="px-6 pb-2">
          <h2 className="text-2xl font-bold pb-2 text-white">Import Article Data</h2>
          <p className="text-slate-400 text-sm font-normal leading-relaxed">
            Select a CSV file containing your article topics. Ensure your file is strictly formatted for the AutoWriter engine.
          </p>
        </div>

        <div className="px-6 py-6">
          <label className="group relative flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-white/10 bg-surface-dark px-6 py-10 transition-all hover:border-primary/50 hover:bg-white/5 cursor-pointer">
            <input accept=".csv" className="hidden" type="file" onChange={handleFileChange} />
            <div className={`flex size-14 items-center justify-center rounded-full transition-transform duration-300 ${file ? 'bg-emerald-500/10 text-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.2)]' : 'bg-primary/10 text-primary group-hover:scale-110'}`}>
              <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>{file ? 'check_circle' : 'cloud_upload'}</span>
            </div>
            <div className="flex flex-col items-center gap-1 text-center">
              <p className="text-lg font-bold truncate max-w-[200px] text-white">{file ? file.name : 'Tap to browse files'}</p>
              <p className="text-slate-400 text-xs font-normal">Supports .csv (Max 5MB)</p>
            </div>
            {!file && (
              <div className="mt-2 flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-white shadow-glow hover:brightness-110 active:scale-95 transition-all">
                <span className="text-sm font-bold leading-normal tracking-wide">Select File</span>
              </div>
            )}
          </label>
        </div>

        <div className="px-6 pb-40">
          <div className="rounded-2xl bg-surface-dark border border-white/5 p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-primary/80">CSV Specification</h3>
              <button
                onClick={downloadTemplate}
                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white/80 px-4 py-2 rounded-full text-xs font-bold transition-all active:scale-95"
              >
                <span className="material-symbols-outlined text-[18px]">download</span>
                GET TEMPLATE
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-[10px] font-bold text-white/30 uppercase tracking-tighter mb-3">Required Columns</p>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { col: 'blog', desc: 'Site identifier (e.g. pnpmagazine).' },
                    { col: 'category', desc: 'WP category name.' },
                    { col: 'article_style', desc: 'Format (e.g. tutorial, news, list).' },
                    { col: 'objective', desc: 'Guideline for AI generation in PT.' },
                    { col: 'theme', desc: 'Central theme or keyword in PT.' },
                    { col: 'word_count', desc: 'Length: 500, 1000, 2000.' },
                    { col: 'language', desc: 'ISO code: pt, en, es.' }
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                      <span className="material-symbols-outlined text-primary mt-0.5" style={{ fontSize: '18px' }}>check_circle</span>
                      <div>
                        <p className="font-mono text-[11px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded inline-block mb-1">{item.col}</p>
                        <p className="text-[11px] text-slate-400 leading-tight">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold text-white/30 uppercase tracking-tighter mb-3">Optional Columns</p>
                <div className="grid grid-cols-2 gap-2">
                  {['tags', 'tone', 'cta', 'featured_image_url', 'top_image_url', 'sources'].map((col) => (
                    <div key={col} className="bg-white/5 p-2 rounded-lg border border-white/5 text-center">
                      <p className="font-mono text-[10px] text-slate-400">{col}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 flex items-center gap-3 rounded-xl bg-primary/10 p-4 border border-primary/20">
              <span className="material-symbols-outlined text-primary shrink-0 text-[20px]">info</span>
              <p className="text-xs text-slate-300 leading-relaxed italic">
                Input (objective/theme) should be in **Portuguese**. AI will output in the selected **language**.
              </p>
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
