import React from 'react';

const colorMap: { [key: string]: string } = {
  blue: 'border-blue-500 text-blue-800 bg-blue-50',
  green: 'border-green-500 text-green-800 bg-green-50',
  purple: 'border-purple-500 text-purple-800 bg-purple-50',
  rose: 'border-rose-500 text-rose-800 bg-rose-50',
  yellow: 'border-yellow-400 text-yellow-800 bg-yellow-50',
  red: 'border-red-500 text-red-800 bg-red-50',
};

// Maps for inline text/bg colors to ensure Tailwind's JIT compiler finds them.
const textColors: { [key: string]: string } = {
  'rose-700': 'text-rose-700',
  'red-700': 'text-red-700',
  'red-600': 'text-red-600',
  'blue-700': 'text-blue-700',
  'green-700': 'text-green-700',
  'purple-700': 'text-purple-700',
  'orange-700': 'text-orange-700',
};

const bgColors: { [key:string]: string } = {
    'yellow-100': 'bg-yellow-100',
    'green-100': 'bg-green-100',
    'blue-100': 'bg-blue-100',
    'red-100': 'bg-red-100',
    'purple-100': 'bg-purple-100',
};

const parseInline = (line: string): React.ReactNode => {
  // Guard for non-string, null, or undefined inputs
  if (typeof line !== 'string') return line;

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  // Regex without an outer capturing group. Captures content of each tag type.
  const regex = /\*\*(.*?)\*\*|\[color:([^\]]+)\](.*?)\[\/color\]|\[bg:([^\]]+)\](.*?)\[\/bg\]/g;
  let match;

  while ((match = regex.exec(line)) !== null) {
    const [, boldText, colorName, colorText, bgName, bgText] = match;

    // Push the text that came before this match
    if (match.index > lastIndex) {
      parts.push(line.substring(lastIndex, match.index));
    }

    const key = `${match.index}`; // Simplified key
    
    if (boldText !== undefined) {
      parts.push(<strong key={key} className="font-semibold text-slate-800">{parseInline(boldText)}</strong>);
    } else if (colorText !== undefined) {
      const textColorClass = textColors[colorName] || 'text-slate-800';
      parts.push(<span key={key} className={`${textColorClass} font-semibold`}>{parseInline(colorText)}</span>);
    } else if (bgText !== undefined) {
      const bgColorClass = bgColors[bgName] || 'bg-slate-200';
      parts.push(<span key={key} className={`${bgColorClass} px-1.5 py-0.5 rounded-md text-slate-900`}>{parseInline(bgText)}</span>);
    }
    
    lastIndex = regex.lastIndex;
  }
  
  // Push the remaining text after the last match
  if (lastIndex < line.length) {
    parts.push(line.substring(lastIndex));
  }
  
  // If only one part and it's a string, return just the string to avoid unnecessary <></> wrapper.
  return parts.length === 1 && typeof parts[0] === 'string' ? parts[0] : <>{parts}</>;
};


const Flowchart: React.FC<{ content: string }> = ({ content }) => {
  const steps = content.split('->').map(s => s.trim());
  return (
    <div className="flex items-center justify-center flex-wrap my-4 -mx-1">
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          <div className="bg-indigo-100 border-2 border-indigo-300 rounded-lg px-4 py-2 text-indigo-800 font-semibold shadow-sm text-center m-1 flex-grow sm:flex-grow-0">
            {step}
          </div>
          {index < steps.length - 1 && (
            <svg className="h-6 w-8 text-indigo-400 hidden sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

const AlertBox: React.FC<{ type: string; children: React.ReactNode }> = ({ type, children }) => {
  const styles: { [key: string]: string } = {
    info: 'bg-sky-50 border-sky-400 text-sky-800',
    success: 'bg-emerald-50 border-emerald-400 text-emerald-800',
    warning: 'bg-amber-50 border-amber-400 text-amber-800',
    danger: 'bg-red-50 border-red-400 text-red-800',
  };
  const selectedStyle = styles[type] || styles.info;
  return (
    <div className={`my-3 p-3 border-l-4 rounded-r-lg ${selectedStyle}`}>
      <div className="text-sm">{children}</div>
    </div>
  );
};

const MindMap: React.FC<{ content: string }> = ({ content }) => {
  const lines = content.split('\n').filter(line => line.trim() !== '');
  const renderNode = (line: string, index: number) => {
    const level = (line.match(/^\s*/)?.[0].length || 0) / 2;
    const [title, ...descParts] = line.trim().split(':');
    const description = descParts.join(':').trim();
    
    const colors = ['blue', 'green', 'purple', 'rose'];
    const color = colors[level % colors.length];

    return (
      <div key={index} className={`relative my-2 py-1 pl-4 border-l-2 ${colorMap[color]?.split(' ')[0]}`} style={{ marginLeft: `${level * 1.5}rem`}}>
        <span className={`absolute -left-[5px] top-3 h-2 w-2 rounded-full ${colorMap[color]?.split(' ')[2]}`}></span>
        <p className="font-bold text-slate-800">{parseInline(title)}</p>
        {description && <p className="text-sm text-slate-600">{parseInline(description)}</p>}
      </div>
    );
  };
  
  return <div className="my-4 p-4 bg-slate-50/50 rounded-lg border border-slate-200">{lines.map(renderNode)}</div>;
}

const RichTextViewer: React.FC<{ text: string }> = ({ text }) => {
  if (!text) return null;

  const blocks = text.split(/(\[flow\][\s\S]*?\[\/flow\]|\[map\][\s\S]*?\[\/map\]|\[alert:.*?\][\s\S]*?\[\/alert\])/g).filter(Boolean);

  return (
    <div>
      {blocks.map((block, i) => {
        if (block.startsWith('[flow]')) {
          const content = block.replace(/\[\/?flow\]/g, '').trim();
          return <Flowchart key={i} content={content} />;
        }
        if (block.startsWith('[map]')) {
          const content = block.replace(/\[\/?map\]/g, '').trim();
          return <MindMap key={i} content={content} />;
        }
        if (block.startsWith('[alert:')) {
          const type = block.match(/\[alert:([^\]]+)\]/)?.[1] || 'info';
          const content = block.replace(/^\[alert:[^\]]+\]/, '').replace(/\[\/alert\]$/, '').trim();
          const parsedContent = content.split('\n').map((line, idx) => (
            <p key={idx} className="my-1">{parseInline(line)}</p>
          ));
          return <AlertBox key={i} type={type}>{parsedContent}</AlertBox>;
        }
        
        return block.split('\n').map((line, j) => {
          if (line.trim() === '') return <div key={`${i}-${j}`} className="h-2"></div>;
          if (line.startsWith('##')) {
            return <h4 key={`${i}-${j}`} className="text-lg font-bold text-slate-800 mt-4 mb-2 border-b border-slate-200 pb-1">{line.replace(/##/g, '').trim()}</h4>;
          }
          if (line.startsWith('--')) {
            return <li key={`${i}-${j}`} className="ml-5 list-disc my-1">{parseInline(line.substring(2).trim())}</li>;
          }
          return <p key={`${i}-${j}`} className="my-1">{parseInline(line)}</p>;
        });
      })}
    </div>
  );
};

export default RichTextViewer;