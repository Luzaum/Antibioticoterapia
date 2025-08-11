import React, { useState, useEffect, useMemo } from 'react';
import { Antibiotic, Species, ComorbidityState } from '../types';
import { pkpdForClass, subclassFor, getComorbidityWarnings } from '../utils/pkpdUtils';
import { CLASS_STYLE, LIFE_STAGES } from '../constants';
import Icon from './Icon';
import Modal from './Modal';

interface DrugCardProps {
  drug: Antibiotic;
  cls: string;
  highlight?: boolean;
}

const comorbLabels: { [key in keyof ComorbidityState]: string } = {
  renal: 'Renal',
  hepatic: 'Hepática',
  septic: 'Séptica',
  cardiac: 'Cardíaca',
};

const InfoRow: React.FC<{ label: string; text?: string; children?: React.ReactNode }> = ({ label, text, children }) => {
  if (!text && !children) return null;
  return (
    <div className="text-sm">
      <p className="font-semibold text-slate-800">{label}</p>
      <div className="text-slate-700 leading-normal">{text || children}</div>
    </div>
  );
};

const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
    <h4 className="font-semibold text-slate-800 text-base mt-4 border-b border-slate-200 pb-1 mb-2">{title}</h4>
);

// Tolerant dose parser
const parseDose = (t: string) => { 
  const s = String(t || '').replace(/[≤≥~≈≃]/g, '').replace(/,/, '.');
  const r = s.match(/(\d+(?:\.\d+)?)\s*[–-]\s*(\d+(?:\.\d+)?)\s*mg\s*\/\s*kg/i); 
  if (r) return { min: +r[1], max: +r[2] }; 
  const m = s.match(/(\d+(?:\.\d+)?)\s*mg\s*\/\s*kg/i); 
  if (m) return { min: +m[1], max: +m[1] }; 
  return { min: NaN, max: NaN }; 
};

const DrugCard: React.FC<DrugCardProps> = ({ drug, cls, highlight = false }) => {
  const pk = pkpdForClass(cls);
  const sub = subclassFor(drug.name, cls);
  const st = CLASS_STYLE[sub] || CLASS_STYLE.penicilina;
  
  const [species, setSpecies] = useState<Species>('Cão');
  const [kg, setKg] = useState(10);
  const [conc, setConc] = useState(50);
  const [form, setForm] = useState('Líquido (mg/mL)');
  const [comorbidities, setComorbidities] = useState<ComorbidityState>({ renal: false, hepatic: false, septic: false, cardiac: false });
  const [modalInfo, setModalInfo] = useState<{ title: string; content: string } | null>(null);

  const baseDog = useMemo(() => parseDose(drug.dose_dog), [drug.dose_dog]);
  const baseCat = useMemo(() => parseDose(drug.dose_cat), [drug.dose_cat]);

  const [mgkg, setMgkg] = useState(Number.isFinite(baseDog.min) ? baseDog.min : 10);

  useEffect(() => {
    const baseDose = species === 'Cão' ? baseDog : baseCat;
    setMgkg(Number.isFinite(baseDose.min) ? baseDose.min : 10);
  }, [species, baseDog, baseCat]);

  const roundTabs = (x: number) => Math.round(x * 4) / 4; // 1/4 tablet
  const roundVol = (x: number) => Math.round(x * 100) / 100; // 0.01 mL

  const loading = comorbidities.septic && pk.hydro === 'hidrofílico' ? 1.25 : 1;
  const b = species === 'Cão' ? baseDog : baseCat;
  const calcEnabled = Number.isFinite(b.min);
  const totalMg = calcEnabled ? kg * mgkg * loading : NaN;
  const vol = calcEnabled && form.startsWith('Líquido') ? totalMg / Math.max(conc, 1) : NaN;
  const tabs = calcEnabled && form.startsWith('Comprimido') ? totalMg / Math.max(conc, 1) : NaN;

  const doseHint = species === 'Cão' 
    ? (Number.isFinite(baseDog.min) ? `${baseDog.min}${baseDog.max !== baseDog.min ? '–' + baseDog.max : ''}` : '—') 
    : (Number.isFinite(baseCat.min) ? `${baseCat.min}${baseCat.max !== baseCat.min ? '–' + baseCat.max : ''}` : '—');

  const comorbWarnings = getComorbidityWarnings(sub, comorbidities);

  return (
    <div className="rounded-xl border p-4 shadow-sm h-full flex flex-col" style={{ background: st.bg, borderColor: st.border, boxShadow: highlight ? '0 0 0 3px #4f46e5' : '0 1px 2px 0 rgb(0 0 0 / 0.05)' }}>
      <div className="flex items-center gap-3 mb-1">
        <span className="text-2xl" title={cls}>{st.emoji}</span>
        <div>
            <h3 className="text-lg font-bold text-slate-900">{drug.name}</h3>
            <p className="text-xs text-slate-600">Classe: {cls} · PK/PD: <b>{pk.pd}</b> · Perfil: <b>{pk.hydro}</b> · Elim.: <b>{pk.elim}</b></p>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-x-4">
        <div>
            <SectionHeader title="Mecanismo de Ação"/>
            <p className="text-sm text-slate-700">{drug.mechanism || pk.moa}</p>
        </div>
        <div>
            <SectionHeader title="Indicações Comuns"/>
            <p className="text-sm text-slate-700">{drug.indications}</p>
        </div>
      </div>

      <SectionHeader title="Espectro de Ação"/>
      <p className="text-sm text-slate-700">{drug.spectrum}</p>
      
      <SectionHeader title="Dosagem Padrão"/>
      <div className="mt-1 text-sm grid md:grid-cols-2 gap-x-4">
        <div><span className="font-semibold text-slate-800">Cão:</span> <span className="text-slate-700">{drug.dose_dog || '—'}</span></div>
        <div><span className="font-semibold text-slate-800">Gato:</span> <span className="text-slate-700">{drug.dose_cat || '—'}</span></div>
      </div>

      <InfoRow label="Preparo e Administração" text={drug.prep_admin} />
      {drug.infusion && <InfoRow label="Infusão" text={drug.infusion} />}
      {drug.infusion_why && <p className="text-xs mt-1 p-2 rounded-md bg-sky-50 text-sky-800 border border-sky-200">💡 {drug.infusion_why}</p>}
      
      {drug.cautions && <div className="mt-3 text-amber-800 bg-amber-50 border border-amber-200 p-2 rounded-md text-sm"><b>⚠️ Cautelas:</b> {drug.cautions}</div>}
      
      <div className="mt-4 p-3 rounded-lg bg-white/60 border border-slate-200 flex-grow flex flex-col">
        <h4 className="font-semibold text-slate-900 mb-3">Calculadora de dose</h4>
        <fieldset disabled={!calcEnabled} className={!calcEnabled ? 'opacity-50 pointer-events-none' : ''}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div>
              <label className="block text-slate-800 font-medium mb-1">Espécie</label>
              <select value={species} onChange={e => setSpecies(e.target.value as Species)} className="w-full rounded-md border-slate-300 bg-white p-2 text-slate-900 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"><option>Cão</option><option>Gato</option></select>
            </div>
            <div>
              <label className="block text-slate-800 font-medium mb-1">Peso (kg)</label>
              <input type="number" value={kg} onChange={e => setKg(parseFloat(e.target.value || '0'))} step="0.1" className="w-full rounded-md border-slate-300 bg-white p-2 text-slate-900 shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-slate-800 font-medium mb-1">Dose (mg/kg)</label>
              <input type="number" value={mgkg} onChange={e => setMgkg(parseFloat(e.target.value || '0'))} step="0.1" className="w-full rounded-md border-slate-300 bg-white p-2 text-slate-900 shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
              <p className="text-xs text-slate-600 mt-1">Sugestão: {doseHint}</p>
            </div>
            <div>
              <label className="block text-slate-800 font-medium mb-1">Forma</label>
              <select value={form} onChange={e => setForm(e.target.value)} className="w-full rounded-md border-slate-300 bg-white p-2 text-slate-900 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mb-1"><option>Líquido (mg/mL)</option><option>Comprimido (mg)</option></select>
              <input type="number" placeholder="Concentração" value={conc} onChange={e => setConc(parseFloat(e.target.value || '1'))} step="1" className="w-full rounded-md border-slate-300 bg-white p-2 text-slate-900 shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
              {(Object.keys(comorbidities) as Array<keyof ComorbidityState>).map(k => (
                <label key={k} className="inline-flex items-center gap-2 text-slate-800 font-medium">
                  <input type="checkbox" className="rounded border-slate-400 text-indigo-600 shadow-sm focus:ring-indigo-500" checked={comorbidities[k]} onChange={e => setComorbidities({ ...comorbidities, [k]: e.target.checked })} />
                  {comorbLabels[k]}
                </label>
              ))}
          </div>
          {comorbWarnings.length > 0 && (
              <div className="mt-3 text-rose-800 bg-rose-50 border border-rose-200 p-2 rounded-md text-sm space-y-1">
                <p className="font-bold">🚨 Alertas de Comorbidade:</p>
                <ul className="list-disc list-inside text-xs">
                  {comorbWarnings.map((warn, i) => <li key={i}>{warn}</li>)}
                </ul>
              </div>
            )}
        </fieldset>
        
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-center">
          <div className="rounded-lg bg-slate-100 border border-slate-200 p-2"><div className="text-xs font-medium text-slate-600">Dose Total</div><div className="text-lg font-bold text-slate-900">{Number.isFinite(totalMg) ? totalMg.toFixed(2) : '—'} mg</div></div>
          <div className="rounded-lg bg-indigo-100 border border-indigo-200 p-2"><div className="text-xs font-medium text-indigo-800">{form.startsWith('Líquido') ? 'Volume/dose' : 'Comprimidos/dose'}</div><div className="text-lg font-bold text-indigo-900">{form.startsWith('Líquido') ? (Number.isFinite(vol) ? `${roundVol(vol).toFixed(2)} mL` : '—') : (Number.isFinite(tabs) ? `${roundTabs(tabs).toFixed(2)} un` : '—')}</div></div>
          <div className="rounded-lg bg-slate-100 border border-slate-200 p-2"><div className="text-xs font-medium text-slate-600">Ajuste Séptico</div><div className="text-lg font-bold text-slate-900">{comorbidities.septic && pk.hydro === 'hidrofílico' ? 'x1.25 Aplicado' : 'N/A'}</div></div>
        </div>
      </div>
      <div className="mt-auto pt-2 text-[11px] text-slate-500">Fontes base: Plumb's, BSAVA, Nelson & Couto.</div>
      <Modal open={!!modalInfo} title={modalInfo?.title || 'Informação'} onClose={() => setModalInfo(null)}>
        {modalInfo?.content}
      </Modal>
    </div>
  );
};

export default DrugCard;