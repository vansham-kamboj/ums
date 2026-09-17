import { useRef, useCallback } from 'react';
import { Bold, Italic, Heading1, Heading2, List, Link as LinkIcon, Undo, Redo } from 'lucide-react';

function ToolbarButton({ icon: Icon, label, onClick, active }) {
  return (
    <button
      type="button"
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      className={`p-1.5 rounded-md transition-colors ${
        active ? 'bg-brand-100 text-brand-600' : 'text-text-secondary hover:bg-bg hover:text-text-primary'
      }`}
      title={label}
    >
      <Icon className="w-4 h-4" />
    </button>
  );
}

export default function RichTextEditor({ value, onChange, placeholder = 'Start writing...', className = '' }) {
  const editorRef = useRef(null);

  const exec = useCallback((command, val = null) => {
    document.execCommand(command, false, val);
    if (editorRef.current && onChange) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  const handleInput = () => {
    if (editorRef.current && onChange) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url) exec('createLink', url);
  };

  return (
    <div className={`border border-border rounded-md overflow-hidden bg-surface ${className}`}>
      {/* Toolbar */}
      <div className="flex items-center gap-0.5 px-2 py-1.5 border-b border-border bg-bg/50 flex-wrap">
        <ToolbarButton icon={Bold} label="Bold" onClick={() => exec('bold')} />
        <ToolbarButton icon={Italic} label="Italic" onClick={() => exec('italic')} />
        <div className="w-px h-5 bg-border mx-1" />
        <ToolbarButton icon={Heading1} label="Heading 1" onClick={() => exec('formatBlock', 'h2')} />
        <ToolbarButton icon={Heading2} label="Heading 2" onClick={() => exec('formatBlock', 'h3')} />
        <div className="w-px h-5 bg-border mx-1" />
        <ToolbarButton icon={List} label="Bullet List" onClick={() => exec('insertUnorderedList')} />
        <ToolbarButton icon={LinkIcon} label="Insert Link" onClick={insertLink} />
        <div className="w-px h-5 bg-border mx-1" />
        <ToolbarButton icon={Undo} label="Undo" onClick={() => exec('undo')} />
        <ToolbarButton icon={Redo} label="Redo" onClick={() => exec('redo')} />
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        dangerouslySetInnerHTML={{ __html: value || '' }}
        data-placeholder={placeholder}
        className="min-h-[240px] px-4 py-3 text-sm text-text-primary focus:outline-none prose prose-sm max-w-none
          [&:empty]:before:content-[attr(data-placeholder)] [&:empty]:before:text-text-disabled [&:empty]:before:pointer-events-none
          [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:mt-4 [&_h2]:mb-2
          [&_h3]:text-base [&_h3]:font-semibold [&_h3]:mt-3 [&_h3]:mb-1
          [&_a]:text-brand-600 [&_a]:underline
          [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-2
          [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-2
          [&_li]:my-0.5"
      />
    </div>
  );
}
