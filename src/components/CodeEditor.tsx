import { useMemo, useRef } from 'react';
import { scheduleFrame } from '../game/clock';
const keywords = new Set(
  'public static boolean int long double float char String return if else for while new class true false null final void SELECT FROM WHERE JOIN INNER LEFT RIGHT ON AS AND OR NOT IN IS NULL WITH GROUP BY ORDER ASC DESC HAVING LIMIT DISTINCT COUNT SUM AVG MIN MAX'.split(
    ' ',
  ),
);
function tokens(code: string) {
  const pattern =
    /(\/\/[^\n]*|--[^\n]*|\/\*[\s\S]*?\*\/|'(?:''|\\.|[^'\\])*'|"(?:\\.|[^"\\])*"|\b\d+(?:\.\d+)?\b|\b[A-Za-z_]\w*\b|[<>=!+*/%&|\-]+)/g;
  let last = 0;
  const parts: { text: string; kind: string }[] = [];
  for (const match of code.matchAll(pattern)) {
    if (match.index! > last) parts.push({ text: code.slice(last, match.index), kind: '' });
    const value = match[0];
    parts.push({
      text: value,
      kind: /^(\/\/|--|\/\*)/.test(value)
        ? 'comment'
        : /^['"]/.test(value)
          ? 'string'
          : /^\d/.test(value)
            ? 'number'
            : keywords.has(value) || keywords.has(value.toUpperCase())
              ? 'keyword'
              : /^[<>=!+*/%&|\-]+$/.test(value)
                ? 'operator'
                : code
                      .slice(match.index! + value.length)
                      .trimStart()
                      .startsWith('(')
                  ? 'function'
                  : '',
    });
    last = match.index! + value.length;
  }
  if (last < code.length) parts.push({ text: code.slice(last), kind: '' });
  return parts;
}
export function CodeEditor({
  code,
  language,
  disabled,
  onChange,
  onRun,
  maxLength,
}: {
  code: string;
  language: string;
  disabled: boolean;
  onChange: (text: string) => void;
  onRun: () => void;
  maxLength: number;
}) {
  const input = useRef<HTMLTextAreaElement>(null),
    highlight = useRef<HTMLPreElement>(null),
    lines = useRef<HTMLDivElement>(null);
  const highlighted = useMemo(() => tokens(code), [code]);
  return (
    <div className="code-editor enhanced-editor">
      <div ref={lines} className="line-numbers" aria-hidden="true">
        {code.split('\n').map((_, i) => (
          <span key={i}>{i + 1}</span>
        ))}
      </div>
      <div className="code-surface">
        <pre ref={highlight} aria-hidden="true" className="code-highlight">
          {highlighted.map((part, i) => (
            <span className={part.kind ? `syntax-${part.kind}` : undefined} key={i}>
              {part.text}
            </span>
          ))}
          {'\n'}
        </pre>
        <textarea
          ref={input}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          aria-label={`${language} code editor`}
          value={code}
          maxLength={maxLength}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
          onScroll={(event) => {
            if (highlight.current)
              highlight.current.style.transform = `translate(${-event.currentTarget.scrollLeft}px,${-event.currentTarget.scrollTop}px)`;
            if (lines.current) lines.current.scrollTop = event.currentTarget.scrollTop;
          }}
          onKeyDown={(event) => {
            if (event.key === 'Tab') {
              event.preventDefault();
              const start = event.currentTarget.selectionStart,
                end = event.currentTarget.selectionEnd;
              onChange(code.slice(0, start) + '    ' + code.slice(end));
              scheduleFrame(() => input.current?.setSelectionRange(start + 4, start + 4));
            }
            if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
              event.preventDefault();
              onRun();
            }
          }}
        />
      </div>
    </div>
  );
}
