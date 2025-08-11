import React from 'react';
import { AntibioticClass, ComorbidityState } from '../types';
import { canonicalDrugName } from '../utils/textUtils';
import { pkpdForClass, subclassFor, getComorbidityWarnings } from '../utils/pkpdUtils';
import { CLASS_STYLE } from '../constants';
import Icon from './Icon';

const DrugItem: React.FC<{
  name: string;
  abDict: AntibioticClass;
  onSeeGuide: (drugName: string) => void;
  comorbidities: ComorbidityState;
}> = ({ name, abDict, onSeeGuide, comorbidities }) => {
  const wantedFullName = canonicalDrugName(name);
  let foundDrug = null;
  let foundClass = null;

  for (const k of Object.keys(abDict || {})) {
    const drug = (abDict[k] || []).find(d => canonicalDrugName(d.name) === wantedFullName);
    if (drug) {
      foundDrug = drug;
      foundClass = k;
      break;
    }
  }

  if (!foundDrug || !foundClass) {
    return <div className="text-xs text-slate-500 mt-2 p-3">(Sem dados da ficha de antibiótico para: {name})</div>;
  }

  const pk = pkpdForClass(foundClass);
  const sub = subclassFor(foundDrug.name, foundClass);
  const st = CLASS_STYLE[sub] || CLASS_STYLE.penicilina;
  const warnings = getComorbidityWarnings(sub, comorbidities);

  return (
    <div className="mt-2 rounded-lg border p-3 text-sm shadow-sm" style={{ background: st.bg, borderColor: st.border }}>
      <div className="flex items-start justify-between">
        <div>
            <div className="font-bold text-slate-900 text-base">{foundDrug.name}</div>
            <div className="text-xs text-slate-600">Classe: {foundClass} · PK/PD: {pk.pd} · Eliminação: {pk.elim}</div>
        </div>
        <button onClick={() => onSeeGuide(foundDrug!.name)} className="text-indigo-700 hover:underline text-xs inline-flex items-center gap-1 flex-shrink-0 ml-2">
          <Icon name="open" className="h-4 w-4" /> Guia
        </button>
      </div>
      
      <div className="mt-2 text-xs text-slate-700 space-y-1">
        <div><b>MOA:</b> {foundDrug.mechanism || pk.moa}</div>
        <div><b>Espectro:</b> {foundDrug.spectrum || '—'}</div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-x-4 gap-y-1 mt-2 text-xs text-slate-800">
        <div><b>Dose cão:</b> {foundDrug.dose_dog || '—'}</div>
        <div><b>Dose gato:</b> {foundDrug.dose_cat || '—'}</div>
      </div>
      
      {warnings.length > 0 && (
        <div className="mt-2 text-rose-800 bg-rose-50 border border-rose-200 p-2 rounded-md text-sm space-y-1">
          <div className="font-bold">🚨 Alertas de Comorbidade:</div>
          <ul className="list-disc list-inside text-xs">
            {warnings.map((warn, i) => <li key={i}>{warn}</li>)}
          </ul>
        </div>
      )}
      {foundDrug.cautions && <div className="mt-2 text-amber-800 bg-amber-50 border border-amber-200 p-2 rounded-md text-sm"><b>⚠️ Cautelas:</b> {foundDrug.cautions}</div>}
    </div>
  );
};


const InlineDrugSummary: React.FC<{
  name: string;
  abDict: AntibioticClass;
  onSeeGuide: (drugName: string) => void;
  comorbidities: ComorbidityState;
}> = ({ name, abDict, onSeeGuide, comorbidities }) => {
    // Check if the full combined drug name exists in the dictionary
    const canonicalFullName = canonicalDrugName(name);
    let drugExists = false;
    for (const key in abDict) {
        if (abDict[key].some(d => canonicalDrugName(d.name) === canonicalFullName)) {
            drugExists = true;
            break;
        }
    }

    // If the full drug name is a single entry (like Amoxi+Clav), render it as one item.
    if (drugExists) {
        return <DrugItem name={name} abDict={abDict} onSeeGuide={onSeeGuide} comorbidities={comorbidities} />;
    }
    
    // If not, it might be a combination therapy that should be split (like Enro + Metro).
    const separatorRegex = /\s*\+\s*|\s+seguido de\s+/i;
    const parts = name.split(separatorRegex).map(p => p.trim()).filter(Boolean);

    // If it's just a single drug name that wasn't found, DrugItem will handle the error message.
    if (parts.length <= 1) {
        return <DrugItem name={name} abDict={abDict} onSeeGuide={onSeeGuide} comorbidities={comorbidities} />;
    }
    
    // It's a combination where the combined name isn't a single entry. Render parts separately.
    return (
        <div className="space-y-2">
            {parts.map((partName, index) => (
                <DrugItem key={`${partName}-${index}`} name={partName} abDict={abDict} onSeeGuide={onSeeGuide} comorbidities={comorbidities} />
            ))}
        </div>
    );
};

export default InlineDrugSummary;