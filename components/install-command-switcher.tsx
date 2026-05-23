'use client';

import { Check, Copy, Monitor, TerminalSquare } from 'lucide-react';
import { useMemo, useState } from 'react';

const commands = [
  {
    label: 'macOS / Linux',
    language: 'bash',
    command: 'curl -fsSL https://static.modelsell.com/modelsell-cli/install.sh | sh',
    icon: TerminalSquare,
  },
  {
    label: 'Windows',
    language: 'powershell',
    command:
      'powershell -ExecutionPolicy Bypass -c "irm https://static.modelsell.com/modelsell-cli/install.ps1 | iex"',
    icon: Monitor,
  },
];

export function InstallCommandSwitcher() {
  const [activeLabel, setActiveLabel] = useState(commands[0].label);
  const [copied, setCopied] = useState(false);
  const active = useMemo(
    () => commands.find((command) => command.label === activeLabel) ?? commands[0],
    [activeLabel],
  );

  async function copyCommand() {
    try {
      await window.navigator.clipboard.writeText(active.command);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = active.command;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.top = '-9999px';
      document.body.append(textarea);
      textarea.select();
      document.execCommand('copy');
      textarea.remove();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <div className="mt-7 overflow-hidden rounded-lg border bg-fd-card">
      <div className="flex flex-col gap-2 border-b bg-fd-muted/40 p-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-1" role="tablist" aria-label="安装系统">
          {commands.map((item) => {
            const selected = item.label === active.label;
            const Icon = item.icon;

            return (
              <button
                key={item.label}
                role="tab"
                type="button"
                aria-selected={selected}
                data-selected={selected}
                className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition hover:bg-fd-accent data-[selected=true]:bg-fd-background data-[selected=true]:text-fd-foreground"
                onClick={() => {
                  setActiveLabel(item.label);
                  setCopied(false);
                }}
              >
                <Icon className="size-4" />
                {item.label}
              </button>
            );
          })}
        </div>
        <button
          type="button"
          aria-label={copied ? '已复制' : '复制命令'}
          className="inline-flex items-center justify-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium text-fd-muted-foreground transition hover:bg-fd-accent hover:text-fd-foreground"
          onClick={copyCommand}
        >
          {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
          {copied ? '已复制' : '复制'}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-sm leading-6">
        <code data-language={active.language}>{active.command}</code>
      </pre>
    </div>
  );
}
