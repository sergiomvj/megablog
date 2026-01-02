
import React from 'react';
import { Screen } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface CostOverviewProps {
  onNavigate: (screen: Screen) => void;
}

const mockChartData = [
  { date: 'May 01', llm: 1.2, images: 0.8, keywords: 0.2 },
  { date: 'May 05', llm: 4.5, images: 2.1, keywords: 0.5 },
  { date: 'May 10', llm: 2.1, images: 1.2, keywords: 0.3 },
  { date: 'May 15', llm: 8.4, images: 3.5, keywords: 0.8 },
  { date: 'May 20', llm: 5.2, images: 4.2, keywords: 1.1 },
  { date: 'May 25', llm: 9.1, images: 3.8, keywords: 0.9 },
  { date: 'May 30', llm: 12.5, images: 5.4, keywords: 1.2 },
];

const CostOverview: React.FC<CostOverviewProps> = ({ onNavigate }) => {
  return (
    <div className="flex flex-col h-screen bg-background-dark">
      <header className="sticky top-0 z-50 flex items-center bg-background-dark/95 backdrop-blur-sm p-4 justify-between border-b border-slate-800">
        <h2 className="text-xl font-bold flex-1 text-center">Cost Overview</h2>
        <button className="size-10 flex items-center justify-center rounded-lg hover:bg-slate-800 transition-colors">
          <span className="material-symbols-outlined">ios_share</span>
        </button>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar pb-32">
        <div className="px-4 py-4">
          <div className="flex h-10 w-full items-center justify-center rounded-lg bg-surface-dark p-1">
            {['7D', '30D', '3M', '1Y'].map((filter) => (
              <button 
                key={filter}
                className={`flex-1 h-full rounded text-xs font-semibold transition-all ${
                  filter === '30D' ? 'bg-primary text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="px-4 pb-4">
          <div className="flex flex-col gap-1 rounded-xl p-6 bg-surface-dark shadow-sm border border-slate-800">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">Total Spend</p>
                <h3 className="text-4xl font-bold tracking-tight text-white">$142.50</h3>
              </div>
              <div className="size-10 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                <span className="material-symbols-outlined">attach_money</span>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded text-[10px] font-bold">
                <span className="material-symbols-outlined text-[14px] mr-0.5">trending_down</span>
                5%
              </div>
              <p className="text-slate-400 text-xs font-medium">vs last 30 days</p>
            </div>
          </div>
        </div>

        {/* Visual Chart Integration */}
        <div className="px-4 py-2">
          <div className="flex flex-col gap-4 rounded-xl p-5 bg-surface-dark shadow-sm border border-slate-800 h-80">
            <div className="flex justify-between items-center mb-2">
              <p className="text-white text-sm font-bold">Spending Trend</p>
              <div className="flex items-center gap-3">
                 <div className="flex items-center gap-1">
                    <div className="size-2 rounded-full bg-primary"></div>
                    <span className="text-[10px] text-slate-400">LLM</span>
                 </div>
                 <div className="flex items-center gap-1">
                    <div className="size-2 rounded-full bg-purple-500"></div>
                    <span className="text-[10px] text-slate-400">IMG</span>
                 </div>
              </div>
            </div>
            <div className="flex-1 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={mockChartData}
                  margin={{ top: 10, right: 0, left: -25, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorLlm" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#135bec" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#135bec" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorImg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.3} />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 10 }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 10 }}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e2430', border: '1px solid #334155', borderRadius: '8px', fontSize: '12px' }}
                    itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="llm" 
                    stackId="1" 
                    stroke="#135bec" 
                    fillOpacity={1} 
                    fill="url(#colorLlm)" 
                    strokeWidth={2}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="images" 
                    stackId="1" 
                    stroke="#a855f7" 
                    fillOpacity={1} 
                    fill="url(#colorImg)" 
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="px-4 py-2 mt-2">
          <div className="flex flex-col gap-4 rounded-xl p-5 bg-surface-dark shadow-sm border border-slate-800">
            <div className="flex justify-between items-center">
              <p className="text-white text-sm font-bold">Cost Distribution</p>
              <button className="text-primary text-xs font-semibold">View Report</button>
            </div>
            <div className="flex h-3 w-full rounded-full overflow-hidden gap-0.5">
              <div className="h-full bg-primary w-[60%]"></div>
              <div className="h-full bg-purple-500 w-[30%]"></div>
              <div className="h-full bg-teal-500 w-[10%]"></div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'LLM', val: '$85.50', color: 'bg-primary' },
                { label: 'Images', val: '$42.00', color: 'bg-purple-500' },
                { label: 'Keywords', val: '$15.00', color: 'bg-teal-500' }
              ].map((item, i) => (
                <div key={i} className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-1.5">
                    <div className={`size-2 rounded-full ${item.color}`}></div>
                    <span className="text-[10px] font-medium text-slate-400">{item.label}</span>
                  </div>
                  <p className="text-xs font-bold text-white">{item.val}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col px-4">
          <h3 className="text-white text-base font-bold py-4">Detailed Breakdown</h3>
          <div className="flex flex-col gap-3">
            {[
              { label: 'GPT-4 Turbo', provider: 'OpenAI', cost: '$85.50', perc: '60%', unit: '1.2M Tokens', rate: '$0.00007 avg/token', icon: 'psychology', color: 'text-primary' },
              { label: 'DALL-E 3', provider: 'Image Generation', cost: '$42.00', perc: '30%', unit: '1,050 Images', rate: '$0.040 avg/img', icon: 'image', color: 'text-purple-500' },
              { label: 'Keyword Research', provider: 'SEMrush API', cost: '$15.00', perc: '10%', unit: '300 Queries', rate: '$0.050 avg/query', icon: 'key', color: 'text-teal-500' }
            ].map((item, i) => (
              <div key={i} className="flex flex-col gap-3 rounded-xl bg-surface-dark p-4 border border-slate-800">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className={`size-10 flex items-center justify-center rounded-lg bg-white/5 ${item.color}`}>
                      <span className="material-symbols-outlined">{item.icon}</span>
                    </div>
                    <div>
                      <p className="text-white text-sm font-bold">{item.label}</p>
                      <p className="text-slate-400 text-xs">{item.provider}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white text-sm font-bold">{item.cost}</p>
                    <p className="text-slate-400 text-[10px]">{item.perc} of total</p>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-800 flex justify-between items-center mt-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-medium text-slate-300">{item.unit}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">{item.rate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 w-full max-w-md mx-auto p-4 bg-background-dark/80 backdrop-blur-md border-t border-slate-800 z-50">
        <button className="w-full flex items-center justify-center gap-2 rounded-xl h-12 bg-primary/20 hover:bg-primary/30 text-primary font-bold transition-colors">
          <span className="material-symbols-outlined text-[20px]">notifications_active</span>
          Set Budget Alert
        </button>
        <div className="h-6"></div>
      </div>
    </div>
  );
};

export default CostOverview;
