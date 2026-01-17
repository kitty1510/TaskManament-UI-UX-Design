import { useRef, useEffect, useState } from 'react';
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Link2,
  Strikethrough
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const isComposing = useRef(false);

  // Toolbar state for visual feedback
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrike, setIsStrike] = useState(false);
  const [isListUnordered, setIsListUnordered] = useState(false);
  const [isListOrdered, setIsListOrdered] = useState(false);
  const [currentColor, setCurrentColor] = useState<string>('#000000');

  const PALETTE = [
    '#111827', // slate-900 
    '#ef4444', // red-500
    '#fb923c', // orange-400
    '#f59e0b', // yellow-400
    '#84cc16', // lime-400
    '#10b981', // emerald-500
    '#06b6d4', // cyan-400
    '#3b82f6', // blue-500
    '#8b5cf6', // violet-500
    '#ec4899'  // pink-500
  ];

  // Sync external value -> editor
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  // update toolbar state based on current selection / caret
  const updateToolbarState = () => {
    try {
      setIsBold(Boolean(document.queryCommandState && document.queryCommandState('bold')));
      setIsItalic(Boolean(document.queryCommandState && document.queryCommandState('italic')));
      setIsUnderline(Boolean(document.queryCommandState && document.queryCommandState('underline')));
      setIsStrike(Boolean(document.queryCommandState && document.queryCommandState('strikeThrough')));
      setIsListUnordered(Boolean(document.queryCommandState && document.queryCommandState('insertUnorderedList')));
      setIsListOrdered(Boolean(document.queryCommandState && document.queryCommandState('insertOrderedList')));

      // query current foreColor
      if (document.queryCommandValue) {
        const v = document.queryCommandValue('foreColor') || '';
        if (v) {
          setCurrentColor(v as string);
        }
      }
    } catch {
      // ignore - some browsers may throw for deprecated commands
    }
  };

  useEffect(() => {
    // update initially
    updateToolbarState();

    // listen for selection changes so toolbar updates when user moves caret
    const handler = () => updateToolbarState();
    document.addEventListener('selectionchange', handler);
    return () => {
      document.removeEventListener('selectionchange', handler);
    };
  }, []);

  const handleInput = () => {
    if (editorRef.current && !isComposing.current) {
      onChange(editorRef.current.innerHTML);
      updateToolbarState();
    }
  };

  const execCommand = (command: string, value?: string) => {
    try {
      // deprecated API but still widely supported for simple rich text editing
      document.execCommand(command, false, value);
    } catch {
      // ignore
    }
    editorRef.current?.focus();
    handleInput();
  };

  const formatBlock = (tag: string) => {
    execCommand('formatBlock', tag);
  };

  const insertLink = () => {
    const url = prompt('Nhập URL:');
    if (url) {
      execCommand('createLink', url);
    }
  };

  const applyColor = (color: string) => {
    // 'foreColor' expects a CSS color string
    execCommand('foreColor', color);
    setCurrentColor(color);
  };

  

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white relative">
      <div className="flex flex-wrap gap-1 p-2 border-b border-gray-300 bg-gray-50 items-center">
        <button
          type="button"
          onClick={() => { execCommand('bold'); }}
          className={`p-2 rounded transition-colors ${isBold ? 'bg-gray-200' : 'hover:bg-gray-200'} text-gray-900`}
          title="Bold (Ctrl+B)"
          aria-pressed={isBold}
        >
          <Bold className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => { execCommand('italic'); }}
          className={`p-2 rounded transition-colors ${isItalic ? 'bg-gray-200' : 'hover:bg-gray-200'} text-gray-900`}
          title="Italic (Ctrl+I)"
          aria-pressed={isItalic}
        >
          <Italic className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => { execCommand('underline'); }}
          className={`p-2 rounded transition-colors ${isUnderline ? 'bg-gray-200' : 'hover:bg-gray-200'} text-gray-900`}
          title="Underline (Ctrl+U)"
          aria-pressed={isUnderline}
        >
          <Underline className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => { execCommand('strikeThrough'); }}
          className={`p-2 rounded transition-colors ${isStrike ? 'bg-gray-200' : 'hover:bg-gray-200'} text-gray-900`}
          title="Strikethrough"
          aria-pressed={isStrike}
        >
          <Strikethrough className="w-4 h-4" />
        </button>

        <div className="w-px h-6 self-center mx-1 bg-gray-300" />

        <button
          type="button"
          onClick={() => { execCommand('insertUnorderedList'); }}
          className={`p-2 rounded transition-colors ${isListUnordered ? 'bg-gray-200' : 'hover:bg-gray-200'} text-gray-900`}
          title="Bullet List"
          aria-pressed={isListUnordered}
        >
          <List className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => { execCommand('insertOrderedList'); }}
          className={`p-2 rounded transition-colors ${isListOrdered ? 'bg-gray-200' : 'hover:bg-gray-200'} text-gray-900`}
          title="Numbered List"
          aria-pressed={isListOrdered}
        >
          <ListOrdered className="w-4 h-4" />
        </button>

        <div className="w-px h-6 self-center mx-1 bg-gray-300" />

        <button
          type="button"
          onClick={() => formatBlock('h1')}
          className="p-2 rounded transition-colors hover:bg-gray-200 text-gray-900"
          title="Heading 1"
        >
          <Heading1 className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => formatBlock('h2')}
          className="p-2 rounded transition-colors hover:bg-gray-200 text-gray-900"
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </button>

        <div className="flex-1" />

        <button
          type="button"
          onClick={insertLink}
          className="p-2 rounded transition-colors hover:bg-gray-200 text-gray-900"
          title="Insert Link"
        >
          <Link2 className="w-4 h-4" />
        </button>

        {/* Text color palette */}
        <div className="flex items-center gap-1 ml-2">
          {PALETTE.map((c) => {
            const isActive = (() => {
              // compare using simple string includes as queryCommandValue might return rgb()
              const v = currentColor || '';
              return v.toLowerCase().includes(c.replace('#', '').toLowerCase()) || v === c;
            })();

            return (
              <button
                key={c}
                type="button"
                onClick={() => applyColor(c)}
                title={c}
                className={`w-6 h-6 rounded transition-all border ${isActive ? 'ring-2 ring-offset-1 ring-gray-400' : 'hover:scale-105'}`}
                style={{ backgroundColor: c, borderColor: isActive ? undefined : 'rgba(0,0,0,0.08)' }}
                aria-pressed={isActive}
              />
            );
          })}
        </div>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onCompositionStart={() => { isComposing.current = true; }}
        onCompositionEnd={() => {
          isComposing.current = false;
          handleInput();
        }}
        className="min-h-[200px] max-h-[400px] overflow-y-auto p-4 focus:outline-none prose prose-sm max-w-none bg-white text-gray-900"
        style={{
          wordWrap: 'break-word',
        }}
        data-placeholder={placeholder}
      />

      <style>{`
        /* placeholder support requires parent to be relative (we added 'relative' to wrapper) */
        [contenteditable][data-placeholder]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
          position: absolute;
          left: 1rem;
          top: 1rem;
        }

        [contenteditable] h1 {
          font-size: 1.875rem;
          font-weight: 700;
          margin: 0.5em 0;
          color: #000000;
        }

        [contenteditable] h2 {
          font-size: 1.5rem;
          font-weight: 600;
          margin: 0.5em 0;
          color: #000000;
        }

        [contenteditable] p {
          margin: 0.5em 0;
          color: #000000;
        }

        [contenteditable] ul, [contenteditable] ol {
          margin: 0.5em 0;
          padding-left: 1.5em;
          color: #000000;
        }

        [contenteditable] blockquote {
          border-left: 4px solid #d1d5db;
          padding-left: 1em;
          margin: 0.5em 0;
          color: #6b7280;
          font-style: italic;
        }

        [contenteditable] pre {
          background: #f3f4f6;
          color: #000000;
          padding: 1em;
          border-radius: 0.375rem;
          overflow-x: auto;
          font-family: monospace;
          margin: 0.5em 0;
          border: 1px solid #e5e7eb;
        }

        [contenteditable] a {
          color: #3b82f6;
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}