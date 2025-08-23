import React, { useState, useMemo, useEffect, useRef } from 'react';
import Icon from '../components/Icon';
import DrugCard from '../components/DrugCard';
import { Page, AntibioticClass, Antibiotic } from '../types';
import { safeList } from '../utils/dataUtils';
import AnimatedBackground from '../components/AnimatedBackground';

interface AntibioticsGuideProps {
  setPage: (page: Page) => void;
  abDict: AntibioticClass;
  focusDrug: string | null;
  sourcePage: Page | null;
}

const AntibioticsGuide: React.FC<AntibioticsGuideProps> = ({ setPage, abDict, focusDrug, sourcePage }) => {
  const classes = useMemo(() => Object.keys(abDict).sort((a, b) => a.localeCompare(b, 'pt')), [abDict]);
  const [q, setQ] = useState("");
  const [cls, setCls] = useState("todas");
  const firstHighlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (focusDrug) {
      setQ(focusDrug);
      setCls('todas');
      setTimeout(() => {
        firstHighlightRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  }, [focusDrug]);

  const filtered = useMemo(() => {
    const res: [string, Antibiotic[]][] = [];
    const lowerQ = q.toLowerCase();
    for (const k of classes) {
      if (cls !== "todas" && k !== cls) continue;
      const list = safeList(abDict[k]).filter(d =>
        (`${d.name} ${d.spectrum} ${d.indications}`).toLowerCase().includes(lowerQ)
      );
      if (list.length) res.push([k, list]);
    }
    return res;
  }, [q, cls, abDict, classes]);

  const headerEmoji = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes('β')) return '🧪';
    if (t.includes('carbapen')) return '🟣';
    if (t.includes('fluoro')) return '🔵';
    if (t.includes('linco')) return '🟩';
    if (t.includes('tetra')) return '🟥';
    if (t.includes('amino')) return '🟧';
    if (t.includes('nitro')) return '⚙️';
    if (t.includes('sulfon')) return '🌸';
    if (t.includes('macrol')) return '🟠';
    return '💊';
  };

  let firstHitGiven = false;

  const backTarget = sourcePage === 'paciente' ? 'paciente' : 'home';
  const backText = sourcePage === 'paciente' ? 'Voltar para Recomendações do Paciente' : 'Voltar';

  return (
    <div className="bg-slate-50 min-h-screen p-4 md:p-8 animate-fade-in relative overflow-hidden">
      <AnimatedBackground pillCount={100} />
      <div className="relative z-10 bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg p-6">
      <button onClick={() => setPage(backTarget)} className="mb-6 flex items-center text-indigo-600 hover:text-indigo-800 font-semibold text-lg">
        <Icon name="back" className="h-6 w-6 mr-2" />{backText}
      </button>
      <h1 className="text-3xl font-extrabold text-slate-800 mb-4">Guia de Antibióticos</h1>
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Buscar por nome, espectro ou indicação" className="flex-1 rounded-lg border-slate-300 p-3 bg-white text-slate-900 placeholder-slate-500 focus:ring-indigo-500 focus:border-indigo-500" />
        <select value={cls} onChange={e => setCls(e.target.value)} className="w-full md:w-64 rounded-lg border-slate-300 p-3 bg-white text-slate-900 focus:ring-indigo-500 focus:border-indigo-500">
          <option value="todas">Todas as classes</option>
          {classes.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div className="space-y-5">
        {filtered.map(([k, list]) => (
          <div key={k} className="bg-white rounded-2xl shadow-sm">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center gap-3">
              <span className="text-xl">{headerEmoji(k)}</span>
              <h2 className="text-xl font-bold text-slate-800">{k}</h2>
            </div>
            <div className="grid gap-4 p-5 md:grid-cols-2">
              {list.map((d) => {
                const isHighlighted = !firstHitGiven && !!q;
                if (isHighlighted) firstHitGiven = true;
                return (
                  <div key={d.name} ref={isHighlighted ? firstHighlightRef : null}>
                    <DrugCard drug={d} cls={k} highlight={isHighlighted} />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div className="text-center text-slate-500 py-10">Nenhum antibiótico encontrado. Tente uma busca diferente.</div>}
      </div>
      </div>
    </div>
  );
};

export default AntibioticsGuide;
