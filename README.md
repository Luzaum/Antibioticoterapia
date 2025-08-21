# Antibioticoterapia

Guia clínico de antibióticos e condições para medicina veterinária.

## 🎨 Novo Design

O aplicativo agora apresenta um design moderno e intuitivo com:

- **Interface limpa e profissional** com gradientes e sombras
- **Padrão de fundo animado** com pílulas coloridas
- **Cards interativos** para navegação principal
- **Tipografia moderna** usando a fonte Inter
- **Responsividade completa** para desktop e mobile

## 🚀 Funcionalidades

### Guia de Antibióticos
- Consulta completa de fármacos
- Informações sobre espectro de ação
- Calculadora de dose integrada
- Alertas de comorbidades

### Guia por Paciente
- Recomendações baseadas no paciente
- Consideração de espécie e idade
- Alertas de comorbidades
- Links diretos para fichas de antibióticos

## 🛠️ Tecnologias

- **React 19** - Framework principal
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Lucide React** - Ícones
- **React Router** - Navegação
- **Vite** - Build tool

## 📦 Instalação

```bash
# Instalar dependências
npm install --legacy-peer-deps

# Executar em modo desenvolvimento
npm run dev

# Build para produção
npm run build
```

## 🎯 Estrutura do Projeto

```
├── App.tsx              # Componente principal com novo design
├── AppRouter.tsx        # Configuração de rotas
├── index.tsx           # Ponto de entrada
├── index.css           # Estilos globais (Tailwind)
├── tailwind.config.tjs # Configuração do Tailwind
├── postcss.config.js   # Configuração do PostCSS
├── data/
│   ├── antibiotics.ts  # Dados dos antibióticos
│   └── diseases.ts     # Dados das doenças
├── components/         # Componentes reutilizáveis
├── pages/             # Páginas principais
├── types.ts           # Definições de tipos
└── utils/             # Utilitários
```

## 🎨 Design System

### Cores
- **Azul primário**: `#3B82F6` (blue-500)
- **Verde**: `#10B981` (emerald-500)
- **Amarelo**: `#FBBF24` (amber-400)
- **Vermelho**: `#EF4444` (red-500)
- **Roxo**: `#8B5CF6` (violet-500)

### Gradientes
- **Teal**: `from-teal-500 to-teal-600`
- **Blue**: `from-blue-600 to-indigo-600`

### Tipografia
- **Fonte principal**: Inter (Google Fonts)
- **Tamanhos**: Responsivos com breakpoints do Tailwind

## 🔧 Configuração

### Tailwind CSS
O projeto usa Tailwind CSS para estilização. A configuração está em `tailwind.config.tjs` e inclui:
- Fonte Inter como padrão
- Caminhos de conteúdo configurados
- Plugins necessários

### PostCSS
Configurado em `postcss.config.js` para processar Tailwind e Autoprefixer.

## 📱 Responsividade

O design é totalmente responsivo com:
- **Mobile-first** approach
- **Breakpoints** do Tailwind (sm, md, lg, xl)
- **Grid system** adaptativo
- **Tipografia** escalável

## 🎯 Próximos Passos

1. **Integração completa** com as funcionalidades existentes
2. **Navegação** entre Guia de Antibióticos e Guia por Paciente
3. **Melhorias de UX** baseadas em feedback
4. **Testes** de usabilidade

## 📄 Licença

Ferramenta educacional. Para uso clínico: baseie-se em cultura/antibiograma e consensos atualizados.
