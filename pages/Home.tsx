import React from 'react';
import Icon from '../components/Icon';
import Importer from '../components/Importer';
import { Page, AntibioticClass, DiseaseSystem } from '../types';

interface HomeProps {
  setPage: (page: Page) => void;
  onMergeAB: (data: AntibioticClass) => void;
  onMergeDZ: (data: DiseaseSystem) => void;
}

const Home: React.FC<HomeProps> = ({ setPage, onMergeAB, onMergeDZ }) => (
  <div className="min-h-screen bg-slate-50 p-6 animate-fade-in">
    <header className="text-center mb-10 max-w-5xl mx-auto">
      <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800">Antibioticoterapia</h1>
      <p className="text-slate-500 mt-2">Guia clínico de antibióticos e condições para medicina veterinária.</p>
    </header>
    <div className="grid gap-6 max-w-5xl mx-auto md:grid-cols-2">
      <button onClick={() => setPage('ab')} className="group rounded-2xl bg-green-600 text-white p-7 shadow-lg hover:bg-green-700 transition hover:scale-105">
        <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-green-500"><Icon name="pill" className="h-8 w-8" /></div>
        <h2 className="text-2xl font-bold mb-1">Guia de Antibióticos</h2>
        <p className="text-white/90">Consulte fármacos, espectro, e use a calculadora de dose.</p>
      </button>
      <button onClick={() => setPage('paciente')} className="group rounded-2xl bg-indigo-600 text-white p-7 shadow-lg hover:bg-indigo-700 transition hover:scale-105">
        <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-indigo-500"><Icon name="paw" className="h-8 w-8" /></div>
        <h2 className="text-2xl font-bold mb-1">Guia por Paciente</h2>
        <p className="text-white/90">Receba recomendações baseadas no paciente e condição.</p>
      </button>
    </div>
    <div className="max-w-5xl mx-auto mt-8">
      <Importer onMergeAB={onMergeAB} onMergeDZ={onMergeDZ} />
    </div>
    <footer className="text-center text-xs text-slate-500 mt-12">Ferramenta educacional. Para uso clínico: baseie-se em cultura/antibiograma e consensos atualizados.</footer>
  </div>
);

export default Home;