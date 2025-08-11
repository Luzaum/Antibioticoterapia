
export type Species = 'Cão' | 'Gato';

export type LifeStageKey = 'filhote' | 'adulto' | 'gestante' | 'lactante' | 'idoso';

export interface LifeStage {
  label: string;
  warn?: string;
  warn_why?: string;
}

export interface Antibiotic {
  name: string;
  spectrum: string;
  dose_dog: string;
  dose_cat: string;
  indications: string;
  cautions: string;
  // NEW detailed fields
  mechanism?: string;
  prep_admin?: string;
  infusion?: string;
  infusion_why?: string;
  duration?: string;
  contraindications?: string;
  adverse_effects?: string;
}

export interface AntibioticClass {
  [className: string]: Antibiotic[];
}

export interface Disease {
  name:string;
  pathogens: string;
  first_line: string[];
  alternatives: string[];
  duration: string;
  notes: string;
}

export interface DiseaseSystem {
  [systemName: string]: Disease[];
}

export interface PkPdInfo {
  pd: string;
  hydro: string;
  elim: string;
  moa: string;
}

export interface ClassStyle {
  emoji: string;
  bg: string;
  border: string;
}

export interface DiseaseExplanation {
  physio: string;
  why: string;
  signs: string;
  adjuncts: string;
}

export type Page = 'home' | 'ab' | 'paciente';

export interface ComorbidityState {
  renal: boolean;
  hepatic: boolean;
  septic: boolean;
  cardiac: boolean;
}
