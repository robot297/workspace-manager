import { SnippetBlock } from './SnippetBlock';

interface Props {
  stepNumber: number;
  title: string;
  description: string;
  configFileName: string;
  configSnippet: string;
  configLanguage: string;
  scriptSnippet: string;
  done: boolean;
  onToggleDone: () => void;
}

export function InstructionStep({
  stepNumber,
  title,
  description,
  configFileName,
  configSnippet,
  configLanguage,
  scriptSnippet,
  done,
  onToggleDone,
}: Props) {
  return (
    <div className={`border rounded-xl p-5 transition-all ${done ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-white'}`}>
      <div className="flex items-start gap-4">
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
          ${done ? 'bg-green-500 text-white' : 'bg-indigo-100 text-indigo-700'}`}>
          {done ? '✓' : stepNumber}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-3 mb-2">
            <h3 className={`font-semibold text-base ${done ? 'line-through text-gray-400' : 'text-gray-800'}`}>
              {title}
            </h3>
            <button
              onClick={onToggleDone}
              className={`text-xs px-3 py-1 rounded-full border transition-colors whitespace-nowrap
                ${done
                  ? 'border-green-400 text-green-700 bg-green-100 hover:bg-green-200'
                  : 'border-gray-300 text-gray-600 hover:bg-gray-100'
                }`}
            >
              {done ? 'Undo' : 'Mark done'}
            </button>
          </div>
          <p className="text-sm text-gray-600 mb-3">{description}</p>
          <div className="space-y-2">
            <SnippetBlock code={configSnippet} language={configLanguage} title={configFileName} />
            {scriptSnippet && (
              <SnippetBlock code={scriptSnippet} language="bash" title="Or run this command" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
