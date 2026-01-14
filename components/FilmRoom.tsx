
import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { SearchSource } from '../types.ts';

const FilmRoom: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [sources, setSources] = useState<SearchSource[]>([]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setResult(null);
    setSources([]);

    try {
      const ai = new GoogleGenAI({ apiKey: (process as any).env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `You are a legendary high school football coach. Provide a brief, tactical breakdown for this question: ${query}`,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      setResult(response.text || "I couldn't find a tactical advantage for that scenario, Coach.");
      
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const extractedSources: SearchSource[] = chunks
        .filter((chunk: any) => chunk.web)
        .map((chunk: any) => ({
          title: chunk.web.title,
          uri: chunk.web.uri,
        }));
      
      setSources(extractedSources);
    } catch (err) {
      console.error(err);
      setResult("The scouts are having trouble reaching the network. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    "How to beat a 4-3 defense",
    "Best red zone passing concepts",
    "How to stop a dual-threat QB",
    "West Coast vs Air Raid offense",
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <header className="flex flex-col gap-2">
        <h2 className="text-4xl font-black text-white italic tracking-tight uppercase">Coaching Film Room</h2>
        <p className="text-slate-400 font-medium">Research real-world tactics to get an edge on Friday night.</p>
      </header>

      <div className="glass rounded-[2.5rem] p-8 border-t-8 border-blue-600 shadow-2xl bg-slate-900/40">
        <form onSubmit={handleSearch} className="space-y-6">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask the veterans about any tactic..."
              className="w-full bg-slate-950 border-2 border-white/5 rounded-2xl px-6 py-5 text-xl font-bold focus:border-blue-500 outline-none transition-all placeholder:text-slate-800"
            />
            <button
              type="submit"
              disabled={loading}
              className="absolute right-3 top-3 bottom-3 px-8 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white font-black rounded-xl transition-all uppercase tracking-widest text-xs"
            >
              {loading ? 'Analyzing...' : 'Analyze Film'}
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setQuery(s)}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-full text-[10px] font-black uppercase text-slate-500 hover:text-slate-300 transition-all"
              >
                {s}
              </button>
            ))}
          </div>
        </form>

        {(loading || result) && (
          <div className="mt-12 pt-12 border-t border-white/5 space-y-6 animate-in slide-in-from-bottom-4">
            {loading ? (
              <div className="flex flex-col items-center py-12 gap-4">
                <div className="text-5xl animate-spin">📽️</div>
                <div className="text-xs font-black uppercase tracking-widest text-blue-500 animate-pulse">Running the tapes...</div>
              </div>
            ) : (
              <>
                <div className="prose prose-invert max-w-none">
                  <div className="p-8 bg-blue-900/10 border-l-4 border-blue-600 rounded-r-2xl italic text-slate-200 leading-relaxed font-medium">
                    {result}
                  </div>
                </div>

                {sources.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Scouting Sources</h3>
                    <div className="flex flex-wrap gap-3">
                      {sources.map((source, idx) => (
                        <a
                          key={idx}
                          href={source.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-slate-950 border border-white/10 rounded-xl text-[10px] font-bold text-blue-400 hover:text-white hover:border-blue-500 transition-all truncate max-w-[200px]"
                        >
                          🔗 {source.title}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass p-6 rounded-3xl border border-white/5 bg-slate-950/20">
          <div className="text-blue-500 text-2xl mb-2">💡</div>
          <h4 className="font-black text-white uppercase tracking-tight mb-2">Study Opponents</h4>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            Use the Film Room to understand different philosophies. If you're facing a "Triple Option" team, search for how to defend it to adjust your defensive sliders.
          </p>
        </div>
        <div className="glass p-6 rounded-3xl border border-white/5 bg-slate-950/20">
          <div className="text-amber-500 text-2xl mb-2">📋</div>
          <h4 className="font-black text-white uppercase tracking-tight mb-2">Tactical Advantage</h4>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            Research specific passing concepts like "Smash" or "Y-Cross" to see when they are most effective against common high school defensive schemes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FilmRoom;
