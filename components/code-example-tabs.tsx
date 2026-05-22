'use client';

import { Check, Copy } from 'lucide-react';
import { useMemo, useState } from 'react';

export type CodeExample = {
  label: string;
  language: string;
  code: string;
};

type CodeExampleTabsProps = {
  examples: CodeExample[];
};

export function CodeExampleTabs({ examples }: CodeExampleTabsProps) {
  const [activeLabel, setActiveLabel] = useState(examples[0]?.label);
  const [copied, setCopied] = useState(false);
  const active = useMemo(
    () => examples.find((example) => example.label === activeLabel) ?? examples[0],
    [activeLabel, examples],
  );

  if (!active) return null;

  async function copyCode() {
    await window.navigator.clipboard.writeText(active.code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <div className="code-example-panel not-prose my-6 overflow-hidden rounded-lg border bg-fd-card">
      <div className="flex items-center justify-between border-b bg-fd-muted/40 px-3 py-2">
        <div className="flex gap-1" role="tablist" aria-label="Code examples">
          {examples.map((example) => {
            const selected = example.label === active.label;

            return (
              <button
                key={example.label}
                role="tab"
                type="button"
                aria-selected={selected}
                className="rounded-md px-3 py-1.5 text-xs font-medium transition hover:bg-fd-accent data-[selected=true]:bg-fd-background data-[selected=true]:text-fd-foreground"
                data-selected={selected}
                onClick={() => {
                  setActiveLabel(example.label);
                  setCopied(false);
                }}
              >
                {example.label}
              </button>
            );
          })}
        </div>
        <button
          type="button"
          aria-label={copied ? 'Copied' : 'Copy code'}
          className="inline-flex size-8 items-center justify-center rounded-md text-fd-muted-foreground transition hover:bg-fd-accent hover:text-fd-foreground"
          onClick={copyCode}
        >
          {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-sm leading-6">
        <code data-language={active.language}>{active.code}</code>
      </pre>
    </div>
  );
}
